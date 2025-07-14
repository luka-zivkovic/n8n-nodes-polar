/* eslint-disable n8n-nodes-base/node-filename-against-convention */
import type { 
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodePropertyOptions,
	INodeType, 
	INodeTypeDescription, 
	NodeConnectionType 
} from 'n8n-workflow';

import { 
	polarApiRequest,
	polarApiRequestAllItems 
} from '../../shared/GenericFunctions';

import { productFields, productOperations } from './descriptions/ProductDescription';
import { checkoutFields, checkoutOperations } from './descriptions/CheckoutDescription';
import { customerFields, customerOperations } from './descriptions/CustomerDescription';

export class Polar implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Polar',
		name: 'polar',
		icon: 'file:polar.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Consume Polar.sh API',
		defaults: {
			name: 'Polar',
		},
		inputs: ['main' as NodeConnectionType],
		outputs: ['main' as NodeConnectionType],
		credentials: [
			{
				name: 'polarApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: '={{$credentials.environment === "sandbox" ? "https://sandbox-api.polar.sh" : "https://api.polar.sh"}}',
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Checkout',
						value: 'checkout',
						description: 'Create and manage checkout sessions',
					},
					{
						name: 'Customer',
						value: 'customer',
						description: 'Manage customers',
					},
					{
						name: 'Product',
						value: 'product',
						description: 'Manage products and pricing',
					},
				],
				default: 'product',
			},

			...productOperations,
			...productFields,
			...checkoutOperations,
			...checkoutFields,
			...customerOperations,
			...customerFields,
		],
	};

	methods = {
		loadOptions: {
			// Get products for dropdown
			async getProducts(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				try {
					const products = await polarApiRequestAllItems.call(
						this,
						'GET',
						'/v1/products',
						{},
						{ limit: 100 }
					);

					for (const product of products) {
						returnData.push({
							name: product.name,
							value: product.id,
							description: `${product.description || ''} - ID: ${product.id}`,
						});
					}
				} catch (error) {
					// Return empty array if API call fails
				}

				return returnData;
			},

			// Get product prices for dropdown
			async getProductPrices(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const productId = this.getCurrentNodeParameter('productId') as string;
				if (!productId) {
					return [];
				}

				const returnData: INodePropertyOptions[] = [];
				try {
					const product = await polarApiRequest.call(
						this,
						'GET',
						`/v1/products/${productId}`
					);

					if (product.prices) {
						for (const price of product.prices) {
							const amount = price.amount_type === 'fixed' 
								? `${(price.price_amount / 100).toFixed(2)} ${price.price_currency?.toUpperCase()}`
								: 'Custom amount';
							
							returnData.push({
								name: `${amount} - ${price.type}`,
								value: price.id,
								description: price.recurring_interval 
									? `Recurring ${price.recurring_interval}`
									: 'One-time',
							});
						}
					}
				} catch (error) {
					// Return empty array if API call fails
				}

				return returnData;
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData;

				// PRODUCT OPERATIONS
				if (resource === 'product') {
					if (operation === 'create') {
						const name = this.getNodeParameter('name', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as any;
						
						const body: any = {
							name,
							...additionalFields,
						};

						// Handle prices array
						if (additionalFields.prices?.price) {
							body.prices = additionalFields.prices.price.map((price: any) => ({
								type: price.type,
								amount_type: price.amount_type,
								price_amount: price.price_amount ? Math.round(price.price_amount * 100) : undefined,
								price_currency: price.price_currency || 'usd',
								recurring_interval: price.recurring_interval,
							}));
						}

						// Handle metadata
						if (additionalFields.metadata?.metadata) {
							const metadata: any = {};
							for (const item of additionalFields.metadata.metadata) {
								metadata[item.key] = item.value;
							}
							body.metadata = metadata;
						}

						responseData = await polarApiRequest.call(
							this,
							'POST',
							'/v1/products',
							body
						);
					}

					if (operation === 'get') {
						const productId = this.getNodeParameter('productId', i) as string;
						responseData = await polarApiRequest.call(
							this,
							'GET',
							`/v1/products/${productId}`
						);
					}

					if (operation === 'getMany') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as any;

						if (returnAll) {
							responseData = await polarApiRequestAllItems.call(
								this,
								'GET',
								'/v1/products',
								{},
								filters
							);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							const response = await polarApiRequest.call(
								this,
								'GET',
								'/v1/products',
								{},
								{ ...filters, limit }
							);
							responseData = response.items || response;
						}
					}

					if (operation === 'update') {
						const productId = this.getNodeParameter('productId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as any;
						
						responseData = await polarApiRequest.call(
							this,
							'PATCH',
							`/v1/products/${productId}`,
							updateFields
						);
					}

					if (operation === 'archive') {
						const productId = this.getNodeParameter('productId', i) as string;
						responseData = await polarApiRequest.call(
							this,
							'POST',
							`/v1/products/${productId}/archive`
						);
					}
				}

				// CHECKOUT OPERATIONS
				if (resource === 'checkout') {
					if (operation === 'create') {
						const productId = this.getNodeParameter('productId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as any;
						
						const body: any = {
							product_id: productId,
							...additionalFields,
						};

						// Handle multiple products
						if (additionalFields.products && additionalFields.products.length > 0) {
							body.product_ids = [productId, ...additionalFields.products];
							delete body.products;
						}

						// Handle metadata
						if (additionalFields.metadata?.metadata) {
							const metadata: any = {};
							for (const item of additionalFields.metadata.metadata) {
								metadata[item.key] = item.value;
							}
							body.metadata = metadata;
						}

						// Convert amount to cents
						if (body.amount) {
							body.amount = Math.round(body.amount * 100);
						}

						responseData = await polarApiRequest.call(
							this,
							'POST',
							'/v1/checkouts',
							body
						);
					}

					if (operation === 'get') {
						const checkoutId = this.getNodeParameter('checkoutId', i) as string;
						responseData = await polarApiRequest.call(
							this,
							'GET',
							`/v1/checkouts/${checkoutId}`
						);
					}

					if (operation === 'update') {
						const checkoutId = this.getNodeParameter('checkoutId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as any;
						
						// Convert amount to cents
						if (updateFields.amount) {
							updateFields.amount = Math.round(updateFields.amount * 100);
						}

						responseData = await polarApiRequest.call(
							this,
							'PATCH',
							`/v1/checkouts/${checkoutId}`,
							updateFields
						);
					}
				}

				// CUSTOMER OPERATIONS
				if (resource === 'customer') {
					if (operation === 'create') {
						const email = this.getNodeParameter('email', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as any;
						
						const body: any = {
							email,
							...additionalFields,
						};

						// Handle billing address
						if (additionalFields.billing_address?.address) {
							body.billing_address = additionalFields.billing_address.address;
						}

						// Handle metadata
						if (additionalFields.metadata?.metadata) {
							const metadata: any = {};
							for (const item of additionalFields.metadata.metadata) {
								metadata[item.key] = item.value;
							}
							body.metadata = metadata;
						}

						responseData = await polarApiRequest.call(
							this,
							'POST',
							'/v1/customers',
							body
						);
					}

					if (operation === 'get') {
						const customerId = this.getNodeParameter('customerId', i) as string;
						responseData = await polarApiRequest.call(
							this,
							'GET',
							`/v1/customers/${customerId}`
						);
					}

					if (operation === 'getMany') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as any;

						if (returnAll) {
							responseData = await polarApiRequestAllItems.call(
								this,
								'GET',
								'/v1/customers',
								{},
								filters
							);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							const response = await polarApiRequest.call(
								this,
								'GET',
								'/v1/customers',
								{},
								{ ...filters, limit }
							);
							responseData = response.items || response;
						}
					}

					if (operation === 'update') {
						const customerId = this.getNodeParameter('customerId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as any;
						
						// Handle billing address
						if (updateFields.billing_address?.address) {
							updateFields.billing_address = updateFields.billing_address.address;
						}

						responseData = await polarApiRequest.call(
							this,
							'PATCH',
							`/v1/customers/${customerId}`,
							updateFields
						);
					}

					if (operation === 'delete') {
						const customerId = this.getNodeParameter('customerId', i) as string;
						await polarApiRequest.call(
							this,
							'DELETE',
							`/v1/customers/${customerId}`
						);
						responseData = { success: true, deleted_customer_id: customerId };
					}
				}

				// Handle response
				if (Array.isArray(responseData)) {
					returnData.push(...responseData.map(item => ({ json: item })));
				} else {
					returnData.push({ json: responseData });
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ 
						json: { 
							error: error.message,
							details: error.description || 'No additional details available',
						} 
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
} 
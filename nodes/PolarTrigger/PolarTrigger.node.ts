import {
	IWebhookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
	IDataObject,
	NodeOperationError,
	NodeConnectionType,
} from 'n8n-workflow';

import { validateStandardWebhookSignature } from '../../shared/GenericFunctions';

export class PolarTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Polar Trigger',
		name: 'polarTrigger',
		icon: 'file:polar.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["events"].join(", ")}}',
		description: 'Handle Polar.sh webhooks (Manual UI Setup Required)',
		defaults: {
			name: 'Polar Trigger',
		},
		inputs: [],
		outputs: ['main' as NodeConnectionType],
		credentials: [
			{
				name: 'polarApi',
				required: false,
				displayOptions: {
					show: {
						authentication: ['credentials'],
					},
				},
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Authentication',
				name: 'authentication',
				type: 'options',
				options: [
					{
						name: 'None',
						value: 'none',
					},
					{
						name: 'Webhook Secret',
						value: 'secret',
					},
					{
						name: 'Credentials (Not Required)',
						value: 'credentials',
					},
				],
				default: 'secret',
				description: 'How to authenticate the webhook',
			},
			{
				displayName: 'Webhook Secret',
				name: 'webhookSecret',
				type: 'string',
				typeOptions: {
					password: true,
				},
				displayOptions: {
					show: {
						authentication: ['secret'],
					},
				},
				default: '',
				description: 'The webhook secret from your Polar.sh webhook configuration',
				placeholder: 'Your Polar.sh webhook secret',
			},
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				options: [
					{
						name: 'Benefit Created',
						value: 'benefit.created',
						description: 'When a benefit is created',
					},
					{
						name: 'Benefit Grant Created',
						value: 'benefit_grant.created',
						description: 'When a benefit is granted to a customer',
					},
					{
						name: 'Benefit Grant Revoked',
						value: 'benefit_grant.revoked',
						description: 'When a benefit is revoked from a customer',
					},
					{
						name: 'Benefit Updated',
						value: 'benefit.updated',
						description: 'When a benefit is updated',
					},
					{
						name: 'Checkout Created',
						value: 'checkout.created',
						description: 'When a checkout session is created (cart)',
					},
					{
						name: 'Checkout Updated',
						value: 'checkout.updated',
						description: 'When a checkout session is updated (cart)',
					},
					{
						name: 'Customer Created',
						value: 'customer.created',
						description: 'When a customer is created',
					},
					{
						name: 'Customer Updated',
						value: 'customer.updated',
						description: 'When a customer is updated',
					},
					{
						name: 'Donation Created',
						value: 'donation.created',
						description: 'When a donation is created',
					},
					{
						name: 'Order Created',
						value: 'order.created',
						description: 'When an order is created (payment completed)',
					},
					{
						name: 'Order Updated',
						value: 'order.updated',
						description: 'When an order is updated (refunds, etc.)',
					},
					{
						name: 'Organization Updated',
						value: 'organization.updated',
						description: 'When an organization is updated',
					},
					{
						name: 'Pledge Created',
						value: 'pledge.created',
						description: 'When a pledge is created',
					},
					{
						name: 'Pledge Updated',
						value: 'pledge.updated',
						description: 'When a pledge is updated',
					},
					{
						name: 'Product Created',
						value: 'product.created',
						description: 'When a product is created',
					},
					{
						name: 'Product Updated',
						value: 'product.updated',
						description: 'When a product is updated',
					},
					{
						name: 'Subscription Canceled',
						value: 'subscription.canceled',
						description: 'When a subscription is canceled',
					},
					{
						name: 'Subscription Created',
						value: 'subscription.created',
						description: 'When a subscription is created',
					},
					{
						name: 'Subscription Updated',
						value: 'subscription.updated',
						description: 'When a subscription is updated',
					},
				],
				default: [],
				description: 'The events to listen for (filter events you want to process)',
			},
			{
				displayName: 'MANUAL SETUP REQUIRED: 1) Copy this webhook URL: {{$node.webhookUrl}} 2) Go to your Polar.sh Developer Settings → Webhooks 3) Click "Add Endpoint" 4) Paste the URL above 5) Set a webhook secret (save it for below) 6) Select the events you want to receive 7) Save the webhook in Polar.sh',
				name: 'setupInstructions',
				type: 'notice',
				default: '',
				displayOptions: {
					show: {
						authentication: ['secret', 'credentials'],
					},
				},
				typeOptions: {
					theme: 'info',
				},
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Validate Timestamp',
						name: 'validateTimestamp',
						type: 'boolean',
						default: true,
						description: 'Whether to validate the webhook timestamp (recommended for security)',
					},
					{
						displayName: 'Timestamp Tolerance (Seconds)',
						name: 'timestampTolerance',
						type: 'number',
						default: 300,
						description: 'How many seconds to allow for timestamp difference (default: 5 minutes)',
						displayOptions: {
							show: {
								validateTimestamp: [true],
							},
						},
					},
					{
						displayName: 'Include Headers',
						name: 'includeHeaders',
						type: 'boolean',
						default: false,
						description: 'Whether to include webhook headers in the output',
					},
					{
						displayName: 'Include Raw Body',
						name: 'includeRawBody',
						type: 'boolean',
						default: false,
						description: 'Whether to include the raw webhook body in the output',
					},
				],
			},
		],
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const req = this.getRequestObject();
		const authentication = this.getNodeParameter('authentication') as string;
		const events = this.getNodeParameter('events') as string[];
		const options = this.getNodeParameter('options') as IDataObject;

		// Get webhook headers
		const webhookId = req.headers['webhook-id'] as string;
		const webhookTimestamp = req.headers['webhook-timestamp'] as string;
		const webhookSignature = req.headers['webhook-signature'] as string;

		// Parse the request body
		let body: any;
		try {
			body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
		} catch (error) {
			throw new NodeOperationError(this.getNode(), 'Invalid JSON in request body');
		}

		// Validate webhook signature if authentication is enabled
		if (authentication === 'secret') {
			const webhookSecret = this.getNodeParameter('webhookSecret') as string;
			
			if (!webhookSecret) {
				throw new NodeOperationError(this.getNode(), 'Webhook secret is required for authentication');
			}

			if (!webhookId || !webhookTimestamp || !webhookSignature) {
				throw new NodeOperationError(this.getNode(), 'Missing required webhook headers (webhook-id, webhook-timestamp, webhook-signature)');
			}

			// Validate timestamp if enabled
			if (options.validateTimestamp !== false) {
				const timestampTolerance = (options.timestampTolerance as number) || 300;
				const webhookTime = parseInt(webhookTimestamp, 10);
				const currentTime = Math.floor(Date.now() / 1000);
				const timeDiff = Math.abs(currentTime - webhookTime);

				if (timeDiff > timestampTolerance) {
					throw new NodeOperationError(
						this.getNode(),
						`Webhook timestamp is too old. Time difference: ${timeDiff} seconds, tolerance: ${timestampTolerance} seconds`
					);
				}
			}

			// Validate signature
			const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
			
			const isValid = await validateStandardWebhookSignature(
				rawBody,
				webhookId,
				webhookTimestamp,
				webhookSignature,
				webhookSecret
			);

			if (!isValid) {
				throw new NodeOperationError(this.getNode(), 'Invalid webhook signature. Please verify your webhook secret matches the one configured in Polar.sh settings.');
			}
		}

		// Filter events if specified
		if (events.length > 0) {
			const eventType = body.type || body.event_type || body.eventType;
			if (eventType && !events.includes(eventType)) {
				// Return empty response for filtered events
				return {
					workflowData: [[]],
				};
			}
		}

		// Prepare the output data
		const outputData: IDataObject = {
			...body,
			webhook_id: webhookId,
			webhook_timestamp: webhookTimestamp,
		};

		// Add optional data
		if (options.includeHeaders) {
			outputData.headers = req.headers;
		}

		if (options.includeRawBody) {
			outputData.raw_body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
		}

		return {
			workflowData: [
				[
					{
						json: outputData,
					},
				],
			],
		};
	}
} 
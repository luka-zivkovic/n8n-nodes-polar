import { INodeProperties } from 'n8n-workflow';

export const checkoutOperations: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['checkout'],
            },
        },
        options: [
            {
                name: 'Create',
                value: 'create',
                description: 'Create a checkout session',
                action: 'Create a checkout session',
            },
            {
                name: 'Get',
                value: 'get',
                description: 'Get a checkout session',
                action: 'Get a checkout session',
            },
            {
                name: 'Update',
                value: 'update',
                description: 'Update a checkout session',
                action: 'Update a checkout session',
            },
        ],
        default: 'create',
    },
];

export const checkoutFields: INodeProperties[] = [
    // ========== Create Operation ==========
    {
        displayName: 'Product Name or ID',
        name: 'productId',
        type: 'options',
        typeOptions: {
            loadOptionsMethod: 'getProducts',
        },
        required: true,
        displayOptions: {
            show: {
                resource: ['checkout'],
                operation: ['create'],
            },
        },
        default: '',
        description: 'The product to checkout. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
    },
    {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
            show: {
                resource: ['checkout'],
                operation: ['create'],
            },
        },
        options: [
            {
                displayName: 'Allow Discount Codes',
                name: 'allow_discount_codes',
                type: 'boolean',
                default: true,
                description: 'Whether to allow customers to apply discount codes',
            },
            {
                displayName: 'Amount',
                name: 'amount',
                type: 'number',
                typeOptions: {
                    numberPrecision: 2,
                    minValue: 0.50,
                    maxValue: 999999.99,
                },
                default: 0,
                description: 'Amount in dollars for custom prices (will be converted to cents)',
                hint: 'Only for products with custom pricing',
            },
            {
                displayName: 'Customer Email',
                name: 'customer_email',
                type: 'string',
                placeholder: 'name@example.com',
                default: '',
                description: 'Email address to pre-fill in the checkout',
            },
            {
                displayName: 'Customer ID',
                name: 'customer_id',
                type: 'string',
                default: '',
                description: 'ID of an existing Polar customer',
            },
            {
                displayName: 'Customer Name',
                name: 'customer_name',
                type: 'string',
                default: '',
                description: 'Name to pre-fill in the checkout',
            },
            {
                displayName: 'Discount ID',
                name: 'discount_id',
                type: 'string',
                default: '',
                description: 'ID of a discount to apply',
            },
            {
                displayName: 'Embed Origin',
                name: 'embed_origin',
                type: 'string',
                placeholder: 'https://example.com',
                default: '',
                description: 'Origin of the page embedding the checkout (for iframe usage)',
            },
            {
                displayName: 'External Customer ID',
                name: 'external_customer_id',
                type: 'string',
                default: '',
                description: 'Your internal customer ID for reconciliation',
            },
            {
                displayName: 'Metadata',
                name: 'metadata',
                type: 'fixedCollection',
                typeOptions: {
                    multipleValues: true,
                },
                placeholder: 'Add Metadata',
                default: {},
                options: [
                    {
                        displayName: 'Metadata',
                        name: 'metadata',
                        values: [
                            {
                                displayName: 'Key',
                                name: 'key',
                                type: 'string',
                                default: '',
                                description: 'Key name (max 40 characters)',
                            },
                            {
                                displayName: 'Value',
                                name: 'value',
                                type: 'string',
                                default: '',
                                description: 'Value (max 500 characters)',
                            },
                        ],
                    },
                ],
                description: 'Key-value pairs to store with the checkout',
            },
            {
                displayName: 'Multiple Product Names or IDs',
                name: 'products',
                type: 'multiOptions',
                typeOptions: {
                    loadOptionsMethod: 'getProducts',
                },
                default: [],
                description: 'Additional products for multi-product checkout. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
                hint: 'First product will be selected by default',
            },
            {
                displayName: 'Require Billing Address',
                name: 'require_billing_address',
                type: 'boolean',
                default: false,
                description: 'Whether to require full billing address (not just country)',
                hint: 'US customers always require full address',
            },
            {
                displayName: 'Subscription ID to Upgrade',
                name: 'subscription_id',
                type: 'string',
                default: '',
                description: 'ID of a free subscription to upgrade',
            },
            {
                displayName: 'Success URL',
                name: 'success_url',
                type: 'string',
                placeholder: 'https://example.com/success?checkout_id={CHECKOUT_ID}',
                default: '',
                description: 'URL to redirect after successful payment',
                hint: 'Use {CHECKOUT_ID} to include the checkout ID',
            },
        ],
    },

    // ========== Get Operation ==========
    {
        displayName: 'Checkout ID',
        name: 'checkoutId',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: ['checkout'],
                operation: ['get', 'update'],
            },
        },
        default: '',
        description: 'The ID of the checkout session',
    },

    // ========== Update Operation ==========
    {
        displayName: 'Update Fields',
        name: 'updateFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
            show: {
                resource: ['checkout'],
                operation: ['update'],
            },
        },
        options: [
            {
                displayName: 'Amount',
                name: 'amount',
                type: 'number',
                typeOptions: {
                    numberPrecision: 2,
                    minValue: 0.50,
                    maxValue: 999999.99,
                },
                default: 0,
                description: 'Amount in dollars for custom prices',
            },
            {
                displayName: 'Customer Email',
                name: 'customer_email',
                type: 'string',
                placeholder: 'name@example.com',
                default: '',
                description: 'Update customer email',
            },
            {
                displayName: 'Customer Name',
                name: 'customer_name',
                type: 'string',
                default: '',
                description: 'Update customer name',
            },
            {
                displayName: 'Discount ID',
                name: 'discount_id',
                type: 'string',
                default: '',
                description: 'Apply a different discount',
            },
            {
                displayName: 'Product Name or ID',
                name: 'product_id',
                type: 'options',
                typeOptions: {
                    loadOptionsMethod: 'getProducts',
                },
                default: '',
                description: 'Switch to a different product. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
            },
            {
                displayName: 'Product Price Name or ID',
                name: 'product_price_id',
                type: 'options',
                typeOptions: {
                    loadOptionsMethod: 'getProductPrices',
                    loadOptionsDependsOn: ['product_id'],
                },
                default: '',
                description: 'Select a specific price tier. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
            },
        ],
    },
];

// Helper descriptions for consistent terminology
export const checkoutDescriptions = {
    checkoutSession: 'A checkout session represents a customer\'s journey through the payment process',
    metadata: 'Custom key-value pairs that will be attached to the resulting order/subscription',
    externalId: 'Your own system\'s ID to help match Polar customers with your users',
    successUrl: 'Where to send customers after successful payment. Use {CHECKOUT_ID} to include the session ID',
    embedOrigin: 'Required only if you\'re embedding the checkout in an iframe on your site',
}; 
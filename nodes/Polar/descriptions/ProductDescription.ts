import type { INodeProperties } from 'n8n-workflow';

export const productOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['product'],
			},
		},
		options: [
			{
				name: 'Archive',
				value: 'archive',
				description: 'Archive a product',
				action: 'Archive a product',
			},
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new product',
				action: 'Create a product',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a product',
				action: 'Get a product',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many products',
				action: 'Get many products',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a product',
				action: 'Update a product',
			},
		],
		default: 'create',
	},
];

export const productFields: INodeProperties[] = [
	// Create
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['product'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'The name of the product',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['product'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				description: 'The description of the product',
			},
			{
				displayName: 'Is Recurring',
				name: 'is_recurring',
				type: 'boolean',
				default: false,
				description: 'Whether the product is a subscription',
			},
			{
				displayName: 'Prices',
				name: 'prices',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				options: [
					{
						displayName: 'Price',
						name: 'price',
						values: [
							{
						displayName: 'Amount Type',
						name: 'amount_type',
						type: 'options',
						options: [
									{
										name: 'Fixed',
										value: 'fixed',
									},
									{
										name: 'Custom',
										value: 'custom',
									},
									{
										name: 'Free',
										value: 'free',
									},
								],
						default: 'fixed',
							},
							{
						displayName: 'Currency',
						name: 'price_currency',
						type: 'options',
						options: [
                                    {
                                        name: 'AUD',
                                        value: 'aud',
                                    },
                                    {
                                        name: 'CAD',
                                        value: 'cad',
                                    },
                                    {
                                        name: 'DKK',
                                        value: 'dkk',
                                    },
                                    {
                                        name: 'EUR',
                                        value: 'eur',
                                    },
                                    {
                                        name: 'GBP',
                                        value: 'gbp',
                                    },
                                    {
                                        name: 'NOK',
                                        value: 'nok',
                                    },
                                    {
                                        name: 'SEK',
                                        value: 'sek',
                                    },
                                    {
                                        name: 'USD',
                                        value: 'usd',
                                    },
                                ],
						default: 'usd',
							},
							{
						displayName: 'Price Amount',
						name: 'price_amount',
						type: 'number',
						default: 0,
						description: 'The price amount in dollars (will be converted to cents)',
							},
							{
						displayName: 'Recurring Interval',
						name: 'recurring_interval',
						type: 'options',
						options: [
									{
										name: 'Month',
										value: 'month',
									},
									{
										name: 'Year',
										value: 'year',
									},
					],
						default: 'month',
							},
							{
						displayName: 'Type',
						name: 'type',
						type: 'options',
						options: [
									{
										name: 'One Time',
										value: 'one_time',
									},
									{
										name: 'Recurring',
										value: 'recurring',
									},
					],
						default: 'one_time',
							},
					],
					},
				],
			},
			{
				displayName: 'Metadata',
				name: 'metadata',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
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
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
							},
						],
					},
				],
			},
		],
	},

	// Get
	{
		displayName: 'Product ID',
		name: 'productId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['product'],
				operation: ['get', 'update', 'archive'],
			},
		},
		default: '',
		description: 'The ID of the product',
	},

	// Get Many
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['product'],
				operation: ['getMany'],
			},
		},
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['product'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
		},
		default: 50,
		description: 'Max number of results to return',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['product'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				displayName: 'Is Archived',
				name: 'is_archived',
				type: 'boolean',
				default: false,
				description: 'Whether to filter by archived products',
			},
			{
				displayName: 'Is Recurring',
				name: 'is_recurring',
				type: 'boolean',
				default: false,
				description: 'Whether to filter by recurring products',
			},
			{
				displayName: 'Organization ID',
				name: 'organization_id',
				type: 'string',
				default: '',
				description: 'Filter by organization',
			},
			{
				displayName: 'Query',
				name: 'query',
				type: 'string',
				default: '',
				description: 'Search query',
			},
		],
	},

	// Update
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['product'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The name of the product',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				description: 'The description of the product',
			},
			{
				displayName: 'Is Recurring',
				name: 'is_recurring',
				type: 'boolean',
				default: false,
				description: 'Whether the product is a subscription',
			},
		],
	},
]; 
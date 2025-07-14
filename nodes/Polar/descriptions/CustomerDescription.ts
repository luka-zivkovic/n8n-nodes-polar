import { INodeProperties } from 'n8n-workflow';

export const customerOperations: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['customer'],
            },
        },
        options: [
            {
                name: 'Create',
                value: 'create',
                description: 'Create a new customer',
                action: 'Create a customer',
            },
            {
                name: 'Delete',
                value: 'delete',
                description: 'Delete a customer',
                action: 'Delete a customer',
            },
            {
                name: 'Get',
                value: 'get',
                description: 'Get a customer',
                action: 'Get a customer',
            },
            {
                name: 'Get Many',
                value: 'getMany',
                description: 'Get many customers',
                action: 'Get many customers',
            },
            {
                name: 'Update',
                value: 'update',
                description: 'Update a customer',
                action: 'Update a customer',
            },
        ],
        default: 'create',
    },
];

export const customerFields: INodeProperties[] = [
    // Create operation
    {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        placeholder: 'name@example.com',
        required: true,
        displayOptions: {
            show: {
                resource: ['customer'],
                operation: ['create'],
            },
        },
        default: '',
        description: 'The email address of the customer',
    },
    {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
            show: {
                resource: ['customer'],
                operation: ['create'],
            },
        },
        options: [
            {
                displayName: 'Billing Address',
                name: 'billing_address',
                type: 'fixedCollection',
                typeOptions: {
                    multipleValues: false,
                },
                default: {},
                options: [
                    {
                        displayName: 'Address',
                        name: 'address',
                        values: [
                            {
                                displayName: 'Country',
                                name: 'country',
                                type: 'string',
                                default: '',
                                description: 'Two-letter country code (e.g., "US", "CA", "GB")',
                                required: true,
                            },
                            {
                                displayName: 'State',
                                name: 'state',
                                type: 'string',
                                default: '',
                            },
                            {
                                displayName: 'City',
                                name: 'city',
                                type: 'string',
                                default: '',
                            },
                            {
                                displayName: 'Line 1',
                                name: 'line1',
                                type: 'string',
                                default: '',
                                description: 'Street address line 1',
                            },
                            {
                                displayName: 'Line 2',
                                name: 'line2',
                                type: 'string',
                                default: '',
                                description: 'Street address line 2',
                            },
                            {
                                displayName: 'Postal Code',
                                name: 'postal_code',
                                type: 'string',
                                default: '',
                            },
                        ],
                    },
                ],
            },
            {
                displayName: 'External ID',
                name: 'external_id',
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
            },
            {
                displayName: 'Name',
                name: 'name',
                type: 'string',
                default: '',
                description: 'Customer name',
            },
            {
                displayName: 'Tax ID',
                name: 'tax_id',
                type: 'string',
                default: '',
                description: 'Tax ID number',
            },
        ],
    },

    // Get operation
    {
        displayName: 'Customer ID',
        name: 'customerId',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: ['customer'],
                operation: ['get', 'update', 'delete'],
            },
        },
        default: '',
        description: 'The ID of the customer',
    },

    // Get Many operation
    {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        displayOptions: {
            show: {
                resource: ['customer'],
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
                resource: ['customer'],
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
                resource: ['customer'],
                operation: ['getMany'],
            },
        },
        options: [
            {
                displayName: 'Email',
                name: 'email',
                type: 'string',
																placeholder: 'name@example.com',
                default: '',
                description: 'Filter by email address',
            },
            {
                displayName: 'External ID',
                name: 'external_id',
                type: 'string',
                default: '',
                description: 'Filter by external ID',
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

    // Update operation
    {
        displayName: 'Update Fields',
        name: 'updateFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
            show: {
                resource: ['customer'],
                operation: ['update'],
            },
        },
        options: [
            {
                displayName: 'Billing Address',
                name: 'billing_address',
                type: 'fixedCollection',
                typeOptions: {
                    multipleValues: false,
                },
                default: {},
                options: [
                    {
                        displayName: 'Address',
                        name: 'address',
                        values: [
                            {
                                displayName: 'Country',
                                name: 'country',
                                type: 'string',
                                default: '',
                                description: 'Two-letter country code (e.g., "US", "CA", "GB")',
                                required: true,
                            },
                            {
                                displayName: 'State',
                                name: 'state',
                                type: 'string',
                                default: '',
                            },
                            {
                                displayName: 'City',
                                name: 'city',
                                type: 'string',
                                default: '',
                            },
                            {
                                displayName: 'Line 1',
                                name: 'line1',
                                type: 'string',
                                default: '',
                                description: 'Street address line 1',
                            },
                            {
                                displayName: 'Line 2',
                                name: 'line2',
                                type: 'string',
                                default: '',
                                description: 'Street address line 2',
                            },
                            {
                                displayName: 'Postal Code',
                                name: 'postal_code',
                                type: 'string',
                                default: '',
                            },
                        ],
                    },
                ],
            },
            {
                displayName: 'Email',
                name: 'email',
                type: 'string',
                placeholder: 'name@example.com',
                default: '',
                description: 'Update customer email',
            },
            {
                displayName: 'External ID',
                name: 'external_id',
                type: 'string',
                default: '',
                description: 'Update your internal customer ID',
            },
            {
                displayName: 'Name',
                name: 'name',
                type: 'string',
                default: '',
                description: 'Update customer name',
            },
            {
                displayName: 'Tax ID',
                name: 'tax_id',
                type: 'string',
                default: '',
                description: 'Update tax ID number',
            },
        ],
    },
]; 
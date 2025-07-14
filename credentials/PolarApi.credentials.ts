import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class PolarApi implements ICredentialType {
	name = 'polarApi';
	displayName = 'Polar API';
	documentationUrl = 'https://docs.polar.sh/integrate/authentication';
	properties: INodeProperties[] = [
		{
			displayName: 'Access Token',
			name: 'accessToken',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'Your Polar organization access token',
			hint: 'Create an access token from your organization settings at polar.sh',
			required: true,
		},
		{
			displayName: 'Environment',
			name: 'environment',
			type: 'options',
			options: [
				{
					name: 'Production',
					value: 'production',
				},
				{
					name: 'Sandbox',
					value: 'sandbox',
				},
			],
			default: 'production',
			description: 'Whether to use the production or sandbox environment',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.accessToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.environment === "sandbox" ? "https://sandbox-api.polar.sh" : "https://api.polar.sh"}}',
			url: '/v1/organizations',
			method: 'GET',
		},
	};
}
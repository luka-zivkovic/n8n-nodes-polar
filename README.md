# n8n-nodes-polar

This is an n8n community node for [Polar.sh](https://polar.sh/) - a modern payment infrastructure platform for SaaS and digital products. Polar is an open-source alternative to Stripe, designed specifically for developers selling software.

[n8n](https://n8n.partnerlinks.io/ds9podzjls6d) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## Features

- 💳 **Checkout Management** - Create and manage checkout sessions with flexible pricing
- 📦 **Product Catalog** - Manage products with one-time and recurring pricing models
- 👥 **Customer Management** - Track and manage your customers with billing addresses
- 🪝 **Webhooks** - React to payment events in real-time with secure webhook validation
- 🧪 **Sandbox Support** - Test everything safely before going live
- 🔒 **Secure Authentication** - Built-in webhook signature validation for security

## Installation

### Community Node (Recommended)

1. Go to **Settings > Community Nodes**
2. Select **Install**
3. Enter `n8n-nodes-polar` in the package name field
4. Click **Install**

### Manual Installation

```bash
# Navigate to your n8n installation directory
cd ~/.n8n

# Install the node
npm install n8n-nodes-polar
```

## Authentication

1. Create a Polar account at [polar.sh](https://polar.sh)
2. Go to your organization settings
3. Navigate to **Settings > Access Tokens**
4. Click **Create Token**
5. Copy the token (you'll only see it once!)
6. In n8n, create new Polar credentials:
   - **Access Token**: Your token from step 5
   - **Environment**: Choose between Production or Sandbox

## Supported Operations

### Products
- **Create** - Create products with flexible pricing (one-time, recurring, custom, free)
- **Get** - Retrieve product details by ID
- **Get Many** - List all your products with pagination and filtering
- **Update** - Modify product information
- **Archive** - Archive products you no longer sell

### Checkouts
- **Create** - Generate checkout sessions for customers with pre-filled data
- **Get** - Retrieve checkout details and status
- **Update** - Modify checkout parameters before completion

### Customers
- **Create** - Add new customers with billing information
- **Get** - Retrieve customer information by ID
- **Get Many** - List all customers with filtering options
- **Update** - Update customer details and billing addresses
- **Delete** - Remove customer records

### Webhook Trigger
- Listen for real-time events with signature validation:
  - Checkout created/updated
  - Order created/updated
  - Subscription created/updated/canceled
  - Customer created/updated
  - Benefit granted/revoked
  - Product created/updated

## Example Workflows

### 1. Simple Product Checkout Flow
```
HTTP Request Trigger → 
Polar: Create Product → 
Polar: Create Checkout → 
Send Email with checkout link
```

### 2. Complete SaaS Onboarding
```
Typeform Trigger → 
Polar: Create/Update Customer → 
Polar: Create Checkout → 
Gmail: Send checkout link → 
Polar Webhook: order.created → 
Postgres: Add user to database → 
SendGrid: Send welcome email → 
Slack: Notify team
```

### 3. Subscription Management
```
Polar Webhook: subscription.created → 
Grant access in your app → 
Send welcome email

Polar Webhook: subscription.updated → 
If: Plan changed → Update user permissions
If: Payment failed → Send dunning email

Polar Webhook: subscription.canceled → 
Revoke access → 
Send win-back email → 
Update CRM
```

### 4. Customer Management
```
Polar Webhook: customer.created → 
Airtable: Add to customer database → 
Slack: Notify sales team → 
HubSpot: Create contact
```

## Webhook Security

This node implements secure webhook validation using Polar.sh's webhook keys:

1. **Signature Validation**: All webhooks are validated using HMAC-SHA256 signatures
2. **Automatic Setup**: Webhook endpoints are automatically created and cleaned up
3. **Event Filtering**: Only receive events you've subscribed to
4. **Error Handling**: Graceful handling of invalid signatures and malformed requests

## Sandbox Testing

Polar provides a sandbox environment for safe testing:

1. Set environment to "Sandbox" in credentials
2. Use test credit card: `4242 4242 4242 4242`
3. Any future expiration date and 3-digit CVC
4. Webhooks work in sandbox mode for complete testing

## Common Use Cases

### SaaS Business
- Monthly/annual subscriptions with trials
- One-time payments for lifetime deals
- Tiered pricing with different features
- Usage-based billing for API calls

### Digital Products
- One-time purchases for courses/ebooks
- Early access for supporters
- Bundle deals and discounts
- Downloadable content delivery

### Open Source Monetization
- GitHub Sponsors alternative
- Private repository access
- Priority support tiers
- Commercial license sales

## API Integration Patterns

This node follows n8n's modern routing patterns:

- **Automatic Pagination**: Get Many operations handle large datasets automatically
- **Dynamic URLs**: Product and customer IDs are dynamically inserted into API calls
- **Request Validation**: Input validation happens before API calls
- **Error Handling**: Comprehensive error handling with detailed messages

## Tips & Best Practices

1. **Use Metadata**: Attach metadata to products, checkouts, and customers for easy reconciliation
2. **External IDs**: Use your own user IDs as external_customer_id for linking
3. **Webhook Validation**: Always keep signature validation enabled for security
4. **Test in Sandbox**: Always test payment flows in sandbox before going live
5. **Amount Handling**: Amounts are automatically converted between dollars and cents

## Pricing Features

- **One-time Payments**: Perfect for lifetime deals and single purchases
- **Recurring Subscriptions**: Monthly and yearly billing cycles
- **Custom Pricing**: Let customers set their own amount
- **Free Products**: Useful for trials and lead magnets
- **Multiple Currencies**: Support for USD, EUR, GBP, CAD, AUD, SEK, NOK, DKK

## Resources

* [Polar Documentation](https://docs.polar.sh/)
* [Polar API Reference](https://docs.polar.sh/api-reference)
* [n8n Documentation](https://docs.n8n.io/)
* [n8n Community](https://community.n8n.io/)

## Support

- **Polar Support**: [Discord](https://discord.gg/polar) | [Email](mailto:support@polar.sh)
- **Node Issues**: [GitHub Issues](https://github.com/luka-zivkovic/n8n-nodes-polar/issues)
- **n8n Community**: [Forum](https://community.n8n.io/)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.

## Acknowledgments

- Thanks to the Polar team for building an amazing platform
- Thanks to the n8n community for the excellent automation platform
- Built with ❤️ for the developer community

## ⚡ Webhook Setup (Polar Trigger)

The Polar Trigger node handles webhook events from Polar.sh using the Standard Webhooks specification. Webhooks are automatically created and managed via the Polar.sh API.

### Automatic Webhook Configuration

1. **Add webhook secret to credentials**:
   - Go to your Polar dashboard: https://polar.sh/dashboard
   - Navigate to: Settings → Webhooks
   - Create a webhook (or use an existing one)
   - Copy the webhook secret
   - Add the webhook secret to your Polar webhook node in n8n

2. **Configure the trigger node**:
   - Create a Polar Trigger node in your n8n workflow
   - Select the events you want to listen to
   - Choose your Polar API credentials (with webhook secret)
   - Activate the workflow

3. **Webhook is automatically created**:
   - n8n will automatically create a webhook in your Polar dashboard
   - The webhook URL will be generated automatically
   - Selected events will be subscribed
   - When you deactivate the workflow, the webhook is automatically deleted

### Webhook Events

The Polar Trigger supports these webhook events:
- `benefit_grant.created` - When a benefit is granted
- `benefit_grant.revoked` - When a benefit is revoked
- `checkout.created` - When a checkout session is created
- `checkout.updated` - When a checkout session is updated
- `customer.created` - When a customer is created
- `customer.updated` - When a customer is updated
- `order.created` - When an order is created
- `order.updated` - When an order is updated
- `product.created` - When a product is created
- `product.updated` - When a product is updated
- `subscription.canceled` - When a subscription is canceled
- `subscription.created` - When a subscription is created
- `subscription.updated` - When a subscription is updated

### Security Features

Webhooks are validated using the [Standard Webhooks specification](https://standardwebhooks.com/):
- **Signature validation**: Uses HMAC-SHA256 with your webhook secret
- **Timestamp validation**: Prevents replay attacks (configurable tolerance)
- **Required headers**: `webhook-id`, `webhook-timestamp`, `webhook-signature`
- **Event filtering**: Only subscribed events are processed

### Configuration Options

- **Validate Signature**: Toggle webhook signature validation (enabled by default)
- **Timestamp Tolerance**: Configure how many seconds tolerance for timestamp validation (default: 300 seconds)

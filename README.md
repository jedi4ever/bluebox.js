# bluebox

> A Node.js library to interact with the Bluebox Group API

## Installation

```bash
npm install bluebox --save
```

**Requirements:** Node.js >= 14.0.0

## Usage

```javascript
var Bluebox = require('bluebox');

var api = new Bluebox({
  customer_id: '<your-customer-id>',
  api_key: '<your-api-key>'
});

// List all blocks (virtual servers)
api.block_list({}, function(err, blocks) {
  console.log(blocks);
});

// Get block details
api.block_details({ uuid: 'abc1234...' }, function(err, block) {
  console.log(block);
});

// Create a new block
api.block_create({
  product: '<product-uuid>',
  template: '<template-uuid>',
  password: '<root-password>',
  location: '<location-uuid>'
}, function(err, block) {
  console.log(block);
});
```

## API Methods

All API calls follow the pattern: `api.method_name(options, callback)`

### Blocks (Virtual Servers)
- `block_list` - List all blocks
- `block_details` - Get details of a specific block
- `block_create` - Create a new block
- `block_reboot` - Reboot a block
- `block_destroy` - Destroy a block

### Templates
- `template_list` - List available templates
- `template_create` - Create a template from a block
- `template_details` - Get template details
- `template_destroy` - Destroy a template

### Resources
- `location_list` - List available data center locations
- `product_list` - List available products/plans

## Development

### Setup

```bash
npm install
```

### Running Tests

```bash
npm test
```

### Linting

```bash
npm run lint
npm run lint:fix  # Auto-fix issues
```

## Configuration

For local development, create a `config.js` file from the sample:

```bash
cp sample_config.js config.js
```

Then edit `config.js` with your credentials:

```javascript
module.exports = {
  customer_id: 'your-customer-id',
  api_key: 'your-api-key'
};
```

## License

MIT License - Copyright (c) 2010-2013 Patrick Debois

See [License](License) for details.

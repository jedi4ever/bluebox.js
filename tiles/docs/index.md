# Bluebox

Bluebox is a Node.js client library for interacting with the Bluebox Group cloud infrastructure API. It provides comprehensive methods for managing virtual machine blocks (servers), templates (snapshots), locations, and product configurations through a simple callback-based API.

## Package Information

- **Package Name**: bluebox
- **Package Type**: npm
- **Language**: JavaScript
- **Installation**: `npm install bluebox`

## Core Imports

```javascript
const Bluebox = require('bluebox');
```

## Basic Usage

```javascript
const Bluebox = require('bluebox');

// Initialize with credentials
const api = new Bluebox({
  customer_id: 'your-customer-id',
  api_key: 'your-api-key'
});

// List all blocks
api.block_list({}, function(err, blocks) {
  if (err) {
    console.error('Error:', err);
    return;
  }
  console.log('Blocks:', blocks);
});

// Get block details
api.block_details({ uuid: 'block-uuid' }, function(err, block) {
  if (err) {
    console.error('Error:', err);
    return;
  }
  console.log('Block details:', block);
});
```

## Architecture

The bluebox library is organized around the following key components:

- **Bluebox Client**: Main constructor class that handles authentication and request management
- **Request Methods**: Auto-loaded from `lib/requests/` directory, providing methods for each API endpoint
- **Callback Pattern**: All methods follow a standard `method(options, callback)` pattern
- **Error Handling**: Standardized error handling with HTTP status code mapping

## Capabilities

### Initialization

Creates a new Bluebox API client with authentication credentials.

```javascript { .api }
/**
 * Bluebox constructor
 * @param {Object} options - Configuration options
 * @param {string} options.customer_id - The Bluebox customer ID (required)
 * @param {string} options.api_key - The Bluebox API key (required)
 * @param {boolean} [options.strictSSL=true] - Enable/disable SSL certificate checking
 * @returns {Bluebox} Bluebox client instance
 */
const api = new Bluebox(options);
```

### Client Properties and Methods

Access to client configuration and credentials.

```javascript { .api }
/**
 * Get the current credentials
 * @returns {Object} Credential pair with customer_id and api_key
 */
api.credentials();

/**
 * Client settings (instance property)
 * @type {Object}
 */
api.settings;
```

### Block Management

Comprehensive virtual server (block) lifecycle management including creation, listing, details, reboot, and destruction. Blocks are virtual machines running in the Bluebox cloud infrastructure.

```javascript { .api }
/**
 * List all blocks
 * @param {Object} options - Options object (can be empty)
 * @param {Function} callback - Callback function (err, blocks)
 */
api.block_list(options, callback);

/**
 * Get block details
 * @param {Object} options
 * @param {string} options.uuid - UUID of the block
 * @param {Function} callback - Callback function (err, block)
 */
api.block_details(options, callback);

/**
 * Create a new block
 * @param {Object} options
 * @param {string} options.product - UUID of a product
 * @param {string} options.template - UUID of a template
 * @param {string} options.password - Login password (required if no ssh_public_key)
 * @param {string} options.ssh_public_key - SSH public key (required if no password)
 * @param {string} [options.hostname] - Short hostname
 * @param {string} [options.username] - Username (defaults to "deploy")
 * @param {string} [options.location] - UUID of a location
 * @param {string} [options.lb_applications] - Comma-separated UUIDs
 * @param {string} [options.lb_services] - Comma-separated UUIDs
 * @param {string} [options.lb_backends] - Comma-separated UUIDs
 * @param {Function} callback - Callback function (err, block)
 */
api.block_create(options, callback);

/**
 * Reboot a block
 * @param {Object} options
 * @param {string} options.uuid - UUID of the block
 * @param {Function} callback - Callback function (err, response)
 */
api.block_reboot(options, callback);

/**
 * Destroy a block
 * @param {Object} options
 * @param {string} options.uuid - UUID of the block
 * @param {Function} callback - Callback function (err, response)
 */
api.block_destroy(options, callback);
```

[Block Management](./blocks.md)

### Template Management

Template creation and management for capturing and reusing block configurations. Templates are snapshots of blocks that can be used to create new blocks with pre-configured software and settings.

```javascript { .api }
/**
 * List all templates
 * @param {Object} options - Options object (can be empty)
 * @param {Function} callback - Callback function (err, templates)
 */
api.template_list(options, callback);

/**
 * Get template details
 * @param {Object} options
 * @param {string} options.uuid - UUID of the template
 * @param {Function} callback - Callback function (err, template)
 */
api.template_details(options, callback);

/**
 * Create a template from a block
 * @param {Object} options
 * @param {string} options.id - UUID of the block to archive
 * @param {string} [options.description] - Description for the template
 * @param {Function} callback - Callback function (err, response)
 */
api.template_create(options, callback);

/**
 * Destroy a template
 * @param {Object} options
 * @param {string} options.id - UUID of the template
 * @param {Function} callback - Callback function (err, response)
 */
api.template_destroy(options, callback);
```

[Template Management](./templates.md)

### Location Discovery

Query available data center locations for block deployment.

```javascript { .api }
/**
 * List all available locations
 * @param {Object} options - Options object (can be empty)
 * @param {Function} callback - Callback function (err, locations)
 */
api.location_list(options, callback);
```

[Locations](./locations.md)

### Product Discovery

Query available server products (configurations with different memory, storage, and CPU allocations).

```javascript { .api }
/**
 * List all available products
 * @param {Object} options - Options object (can be empty)
 * @param {Function} callback - Callback function (err, products)
 */
api.product_list(options, callback);
```

[Products](./products.md)

## Constants

```javascript { .api }
/**
 * Base URL for all API requests
 * @constant {string}
 */
Bluebox.API_URL; // 'https://boxpanel.bluebox.net/api/'
```

## Common Types

```javascript { .api }
/**
 * Credential pair for API authentication
 * @typedef {Object} CredentialPair
 * @property {string} customer_id - Bluebox customer ID
 * @property {string} api_key - Bluebox API key
 */

/**
 * Standard callback function signature
 * @callback RequestCallback
 * @param {Error|null} error - Error object if error occurred, null otherwise
 * @param {Object} body - Response body
 * @param {string} [statusCode] - HTTP status code (only for internal _request method)
 */

/**
 * Block status values
 * @typedef {string} BlockStatus
 * - 'queued': Block has been queued and is awaiting pickup
 * - 'building': Block is building on a remote host
 * - 'running': Block is running and accessible via IP
 * - 'error': Deployment failure occurred
 */

/**
 * IP address object
 * @typedef {Object} IPAddress
 * @property {string} address - IPv4 or IPv6 address
 */

/**
 * Product information
 * @typedef {Object} Product
 * @property {string} id - Product UUID
 * @property {string} description - Product description
 * @property {string} cost - Hourly cost in dollars
 */

/**
 * Block object
 * @typedef {Object} Block
 * @property {string} id - Block UUID
 * @property {string} hostname - Full hostname
 * @property {string} description - Block description
 * @property {number} memory - Memory in bytes
 * @property {number} storage - Storage in bytes
 * @property {number} cpu - CPU allocation
 * @property {IPAddress[]} ips - Array of IP addresses
 * @property {Array} lb_applications - Load balanced applications
 * @property {BlockStatus} status - Block status
 * @property {string} location_id - Location UUID
 * @property {Product} [product] - Product details (in detail views)
 */

/**
 * Template object
 * @typedef {Object} Template
 * @property {string} id - Template UUID
 * @property {string} status - Template status (e.g., 'stored')
 * @property {string} description - Template description
 * @property {boolean} public - Whether template is public
 * @property {string[]} locations - Array of location UUIDs where template is available
 * @property {string} created - ISO 8601 timestamp of creation
 */

/**
 * Location object
 * @typedef {Object} Location
 * @property {string} id - Location UUID
 * @property {string} description - Location name (e.g., "Seattle, WA")
 */
```

## Error Handling

All API methods use standard callback error handling. Errors are returned as the first parameter of the callback function. Common errors include:

- **401 Unauthorized**: Invalid API key or customer ID
- **403 Forbidden**: API key doesn't have access from requesting IP
- **404 Not Found**: Resource not found
- **409 Conflict**: Resource conflict (e.g., duplicate operations, capacity issues)
- **500 Internal Server Error**: API error on Bluebox side

```javascript
api.block_details({ uuid: 'invalid-uuid' }, function(err, block) {
  if (err) {
    console.error('Error occurred:', err.message);
    // Error: Not Found - Block [invalid-uuid] was not found.
    return;
  }
  // Process block
});
```

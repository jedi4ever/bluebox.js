# Block Management

Comprehensive virtual server (block) lifecycle management for the Bluebox cloud infrastructure. Blocks are virtual machines that can be created, monitored, rebooted, and destroyed through the API.

## Capabilities

### List Blocks

Returns a collection of all existing blocks for the authenticated account.

```javascript { .api }
/**
 * List all blocks
 * @param {Object} options - Options object (currently accepts empty object)
 * @param {Function} callback - Callback function (err, blocks)
 * @returns {void}
 */
api.block_list(options, callback);
```

**Parameters:**
- `options` (Object): Configuration object (can be empty `{}`)
- `callback` (Function): Callback function with signature `(err, blocks)`
  - `err` (Error|null): Error object if error occurred, null otherwise
  - `blocks` (Block[]): Array of block objects

**Returns via callback:** Array of block objects, each containing:

```javascript { .api }
/**
 * Block object (in list view)
 * @typedef {Object} Block
 * @property {string} id - Block UUID
 * @property {string} hostname - Full hostname
 * @property {string} description - Block description (e.g., "1 GB RAM + 20 GB Disk")
 * @property {number} memory - Memory in bytes
 * @property {number} storage - Storage in bytes
 * @property {number} cpu - CPU allocation
 * @property {IPAddress[]} ips - Array of IP address objects
 * @property {Array} lb_applications - Load balanced applications
 * @property {string} status - Block status: 'queued', 'building', 'running', or 'error'
 * @property {string} location_id - Location UUID
 */
```

**Usage Example:**

```javascript
const Bluebox = require('bluebox');

const api = new Bluebox({
  customer_id: 'your-customer-id',
  api_key: 'your-api-key'
});

api.block_list({}, function(err, blocks) {
  if (err) {
    console.error('Error listing blocks:', err);
    return;
  }

  console.log(`Found ${blocks.length} blocks`);
  blocks.forEach(function(block) {
    console.log(`- ${block.hostname} (${block.status})`);
  });
});
```

### Get Block Details

Retrieves detailed information for a specific block.

```javascript { .api }
/**
 * Get block details
 * @param {Object} options
 * @param {string} options.uuid - UUID of the block to retrieve (required)
 * @param {Function} callback - Callback function (err, block)
 * @returns {void}
 */
api.block_details(options, callback);
```

**Parameters:**
- `options` (Object):
  - `uuid` (string, required): UUID of the block to retrieve
- `callback` (Function): Callback function with signature `(err, block)`
  - `err` (Error|null): Error object if error occurred, null otherwise
  - `block` (Block): Block object with full details

**Returns via callback:** Block object with complete details:

```javascript { .api }
/**
 * Block object (in detail view)
 * @typedef {Object} BlockDetails
 * @property {string} id - Block UUID
 * @property {string} hostname - Full hostname
 * @property {string} description - Block description
 * @property {number} memory - Memory in bytes
 * @property {number} storage - Storage in bytes
 * @property {number} cpu - CPU allocation
 * @property {IPAddress[]} ips - Array of IP address objects with IPv4 and IPv6
 * @property {Array} lb_applications - Load balanced applications
 * @property {string} status - Block status: 'queued', 'building', 'running', or 'error'
 * @property {string} location_id - Location UUID
 * @property {Product} product - Product details
 * @property {string} product.id - Product UUID
 * @property {string} product.description - Product description
 * @property {string} product.cost - Hourly cost in dollars
 */
```

**Status Field Values:**
- `queued`: Block has been queued and is awaiting pickup by a host
- `building`: Block has been picked up and is building on a remote host
- `running`: Block is now running and should be accessible via IP
- `error`: There was a failure with the deployment

**Errors:**
- 404: Not Found - Block was not found

**Usage Example:**

```javascript
api.block_details({ uuid: 'a124ca83-c026-402d-bec2-9ab2bcf8b9b7' }, function(err, block) {
  if (err) {
    console.error('Error getting block details:', err);
    return;
  }

  console.log('Block:', block.hostname);
  console.log('Status:', block.status);
  console.log('Memory:', block.memory / (1024 * 1024 * 1024), 'GB');
  console.log('IPs:', block.ips.map(function(ip) { return ip.address; }).join(', '));
});
```

### Create Block

Creates a new virtual server block with specified configuration.

```javascript { .api }
/**
 * Create a new block
 * @param {Object} options
 * @param {string} options.product - UUID of a product (from product_list)
 * @param {string} options.template - UUID of a template (from template_list)
 * @param {string} options.password - Login password (required if no ssh_public_key)
 * @param {string} options.ssh_public_key - SSH public key (required if no password)
 * @param {string} [options.hostname] - Short hostname (will be appended with .custXXXX)
 * @param {string} [options.username='deploy'] - Username for the new user
 * @param {string} [options.location] - UUID of a location (from location_list)
 * @param {string} [options.lb_applications] - Comma-separated UUIDs of load balanced applications
 * @param {string} [options.lb_services] - Comma-separated UUIDs of load balanced services
 * @param {string} [options.lb_backends] - Comma-separated UUIDs of load balanced backends
 * @param {Function} callback - Callback function (err, block)
 * @returns {void}
 */
api.block_create(options, callback);
```

**Parameters:**
- `options` (Object):
  - `product` (string, required): UUID of a product (obtain from `product_list`)
  - `template` (string, required): UUID of a template (obtain from `template_list`)
  - `password` (string, required*): Login password (*either password or ssh_public_key is required)
  - `ssh_public_key` (string, required*): SSH public key (*either password or ssh_public_key is required)
  - `hostname` (string, optional): Short hostname (automatically appended with `.custXXXX` where XXXX is customer ID)
  - `username` (string, optional): Username for new user (defaults to "deploy")
  - `location` (string, optional): UUID of a location (obtain from `location_list`)
  - `lb_applications` (string, optional): Comma-separated list of Load Balanced Application UUIDs (no whitespace)
  - `lb_services` (string, optional): Comma-separated list of Load Balanced Service UUIDs (no whitespace)
  - `lb_backends` (string, optional): Comma-separated list of Load Balanced Backend UUIDs (no whitespace)
- `callback` (Function): Callback function with signature `(err, block)`
  - `err` (Error|null): Error object if error occurred, null otherwise
  - `block` (Block): Newly created block object with full details

**Returns via callback:** Newly created block object with assigned IPs and initial status (typically 'queued').

**Errors:**
- 400 Bad Request: Posted data was incomplete
- 404 Not Found: The product or template specified could not be found
- 406 Not Acceptable: SSH key was not submitted and password did not pass libcrack test
- 409 Conflict: Out of capacity or API error occurred

**Usage Example:**

```javascript
api.block_create({
  product: '94fd37a7-2606-47f7-84d5-9000deda52ae',
  template: 'c3bd2420-a36b-4e4e-ae91-500e3275c10d',
  password: 'secure-password-123',
  ssh_public_key: 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC...',
  hostname: 'my-server',
  username: 'admin',
  location: '37c2bd9a-3e81-46c9-b6e2-db44a25cc675'
}, function(err, block) {
  if (err) {
    console.error('Error creating block:', err);
    return;
  }

  console.log('Block created:', block.id);
  console.log('Hostname:', block.hostname);
  console.log('Status:', block.status);
  console.log('IP addresses:');
  block.ips.forEach(function(ip) {
    console.log('  -', ip.address);
  });
});
```

### Reboot Block

Reboots an existing block.

```javascript { .api }
/**
 * Reboot a block
 * @param {Object} options
 * @param {string} options.uuid - UUID of the block to reboot (required)
 * @param {Function} callback - Callback function (err, response)
 * @returns {void}
 */
api.block_reboot(options, callback);
```

**Parameters:**
- `options` (Object):
  - `uuid` (string, required): UUID of the block to reboot
- `callback` (Function): Callback function with signature `(err, response)`
  - `err` (Error|null): Error object if error occurred, null otherwise
  - `response` (Object): Response object confirming the reboot

**Errors:**
- 404: Not Found - Block was not found

**Usage Example:**

```javascript
api.block_reboot({ uuid: 'a124ca83-c026-402d-bec2-9ab2bcf8b9b7' }, function(err, response) {
  if (err) {
    console.error('Error rebooting block:', err);
    return;
  }

  console.log('Block reboot initiated:', response);
});
```

### Destroy Block

Permanently destroys a block.

```javascript { .api }
/**
 * Destroy a block
 * @param {Object} options
 * @param {string} options.uuid - UUID of the block to destroy (required)
 * @param {Function} callback - Callback function (err, response)
 * @returns {void}
 */
api.block_destroy(options, callback);
```

**Parameters:**
- `options` (Object):
  - `uuid` (string, required): UUID of the block to destroy
- `callback` (Function): Callback function with signature `(err, response)`
  - `err` (Error|null): Error object if error occurred, null otherwise
  - `response` (Object): Response object with `text: 'Block destroyed.'`

**Returns via callback:** Object with confirmation message: `{ text: 'Block destroyed.' }`

**Errors:**
- 404: Not Found - Block was not found

**Usage Example:**

```javascript
api.block_destroy({ uuid: 'a124ca83-c026-402d-bec2-9ab2bcf8b9b7' }, function(err, response) {
  if (err) {
    console.error('Error destroying block:', err);
    return;
  }

  console.log('Block destroyed:', response.text);
});
```

## Types

```javascript { .api }
/**
 * IP address object
 * @typedef {Object} IPAddress
 * @property {string} address - IPv4 or IPv6 address
 */
```

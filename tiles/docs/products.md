# Products

Product discovery for querying available server configurations (products) with different memory, storage, and CPU allocations. Products define the hardware specifications and pricing for blocks.

## Capabilities

### List Products

Returns a collection of all available products (server configurations) that can be used when creating blocks.

```javascript { .api }
/**
 * List all available products
 * @param {Object} options - Options object (currently accepts empty object)
 * @param {Function} callback - Callback function (err, products)
 * @returns {void}
 */
api.product_list(options, callback);
```

**Parameters:**
- `options` (Object): Configuration object (can be empty `{}`)
- `callback` (Function): Callback function with signature `(err, products)`
  - `err` (Error|null): Error object if error occurred, null otherwise
  - `products` (Product[]): Array of product objects

**Returns via callback:** Array of product objects, each containing:

```javascript { .api }
/**
 * Product object
 * @typedef {Object} Product
 * @property {string} id - Product UUID
 * @property {string} description - Product description (e.g., "Block 1GB Virtual Server", "Block 2GB Virtual Server")
 * @property {string} cost - Hourly cost in dollars (e.g., "0.15", "0.25")
 */
```

**Usage Example:**

```javascript
const Bluebox = require('bluebox');

const api = new Bluebox({
  customer_id: 'your-customer-id',
  api_key: 'your-api-key'
});

api.product_list({}, function(err, products) {
  if (err) {
    console.error('Error listing products:', err);
    return;
  }

  console.log(`Found ${products.length} available products:`);
  products.forEach(function(product) {
    console.log(`- ${product.description}: $${product.cost}/hour (ID: ${product.id})`);
  });
});
```

## Using Products

Product UUIDs are required when creating new blocks to specify the server configuration. Use `product_list()` to discover available products and their pricing, then pass the desired product's UUID to `block_create()` via the `product` option.

```javascript
// Example: Create a block with 2GB RAM configuration
api.product_list({}, function(err, products) {
  if (err) {
    console.error('Error:', err);
    return;
  }

  // Find 2GB product
  var product2GB = products.find(function(prod) {
    return prod.description.indexOf('2GB') !== -1;
  });

  if (!product2GB) {
    console.error('2GB product not found');
    return;
  }

  console.log('Selected product:', product2GB.description);
  console.log('Cost: $' + product2GB.cost + '/hour');

  // Create block with 2GB product
  api.block_create({
    product: product2GB.id,  // Use 2GB product UUID
    template: 'template-uuid',
    password: 'secure-password',
    ssh_public_key: 'ssh-rsa ...'
  }, function(err, block) {
    if (err) {
      console.error('Error creating block:', err);
      return;
    }

    console.log('Block created:', block.id);
    console.log('Product:', block.product.description);
    console.log('Hourly cost: $' + block.product.cost);
  });
});
```

## Product Selection Guide

When selecting a product for your block, consider:

1. **Memory Requirements**: Choose based on your application's RAM needs (1GB, 2GB, 3GB, 4GB, 8GB, etc.)
2. **Cost**: Each product has a different hourly cost - balance performance needs with budget
3. **Workload Type**:
   - Lightweight applications: 1GB products
   - Web servers and small databases: 2-3GB products
   - Application servers and larger databases: 4GB+ products
   - Memory-intensive applications: 8GB+ products

```javascript
// Example: Helper function to select product by memory size
function selectProductByMemory(products, desiredGB) {
  return products.find(function(product) {
    var gbMatch = product.description.match(/(\d+)GB/);
    if (gbMatch) {
      var gb = parseInt(gbMatch[1]);
      return gb === desiredGB;
    }
    return false;
  });
}

api.product_list({}, function(err, products) {
  if (err) return;

  var product = selectProductByMemory(products, 4);
  if (product) {
    console.log('4GB Product found:', product.id);
    console.log('Description:', product.description);
    console.log('Cost: $' + product.cost + '/hour');
  }
});
```

## Product Information in Block Details

When retrieving block details with `block_details()`, the response includes full product information:

```javascript
api.block_details({ uuid: 'block-uuid' }, function(err, block) {
  if (err) return;

  console.log('Block Configuration:');
  console.log('- Memory:', block.memory / (1024 * 1024 * 1024), 'GB');
  console.log('- Storage:', block.storage / (1024 * 1024 * 1024), 'GB');
  console.log('- CPU:', block.cpu);
  console.log('\nProduct Details:');
  console.log('- Name:', block.product.description);
  console.log('- Cost: $' + block.product.cost + '/hour');
  console.log('- Product ID:', block.product.id);
});
```

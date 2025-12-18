# Template Management

Template management for capturing and reusing block configurations. Templates are snapshots of blocks that preserve the software configuration, allowing you to quickly create new blocks with identical setups. Templates can be created from existing blocks and then used when creating new blocks.

## Capabilities

### List Templates

Returns a collection of all existing templates available to the authenticated account.

```javascript { .api }
/**
 * List all templates
 * @param {Object} options - Options object (currently accepts empty object)
 * @param {Function} callback - Callback function (err, templates)
 * @returns {void}
 */
api.template_list(options, callback);
```

**Parameters:**
- `options` (Object): Configuration object (can be empty `{}`)
- `callback` (Function): Callback function with signature `(err, templates)`
  - `err` (Error|null): Error object if error occurred, null otherwise
  - `templates` (Template[]): Array of template objects

**Returns via callback:** Array of template objects, each containing:

```javascript { .api }
/**
 * Template object
 * @typedef {Object} Template
 * @property {string} id - Template UUID
 * @property {string} status - Template status (e.g., 'stored')
 * @property {string} description - Template description
 * @property {boolean} public - Whether template is publicly available
 * @property {string[]} locations - Array of location UUIDs where template is available
 * @property {string} created - ISO 8601 timestamp of creation
 */
```

**Usage Example:**

```javascript
const Bluebox = require('bluebox');

const api = new Bluebox({
  customer_id: 'your-customer-id',
  api_key: 'your-api-key'
});

api.template_list({}, function(err, templates) {
  if (err) {
    console.error('Error listing templates:', err);
    return;
  }

  console.log(`Found ${templates.length} templates`);
  templates.forEach(function(template) {
    console.log(`- ${template.description} (${template.id})`);
    console.log(`  Status: ${template.status}, Public: ${template.public}`);
    console.log(`  Available in ${template.locations.length} locations`);
  });
});
```

### Get Template Details

Retrieves detailed information for a specific template.

```javascript { .api }
/**
 * Get template details
 * @param {Object} options
 * @param {string} options.uuid - UUID of the template to retrieve (required)
 * @param {Function} callback - Callback function (err, template)
 * @returns {void}
 */
api.template_details(options, callback);
```

**Parameters:**
- `options` (Object):
  - `uuid` (string, required): UUID of the template to retrieve
- `callback` (Function): Callback function with signature `(err, template)`
  - `err` (Error|null): Error object if error occurred, null otherwise
  - `template` (Template): Template object with full details

**Returns via callback:** Template object with complete details (same structure as in list view).

**Errors:**
- 404: Not Found - Template was not found

**Usage Example:**

```javascript
api.template_details({ uuid: 'c3bd2420-a36b-4e4e-ae91-500e3275c10d' }, function(err, template) {
  if (err) {
    console.error('Error getting template details:', err);
    return;
  }

  console.log('Template:', template.description);
  console.log('Status:', template.status);
  console.log('Public:', template.public);
  console.log('Created:', template.created);
  console.log('Available locations:', template.locations.length);
});
```

### Create Template

Creates a new template from an existing block. This archives the current state of the block into a reusable template.

```javascript { .api }
/**
 * Create a template from a block
 * @param {Object} options
 * @param {string} options.id - UUID of the block to archive into a template (required)
 * @param {string} [options.description] - Description for the template
 * @param {Function} callback - Callback function (err, response)
 * @returns {void}
 */
api.template_create(options, callback);
```

**Parameters:**
- `options` (Object):
  - `id` (string, required): UUID of the block to archive into a template
  - `description` (string, optional): Description to record on the template for future reference
- `callback` (Function): Callback function with signature `(err, response)`
  - `err` (Error|null): Error object if error occurred, null otherwise
  - `response` (Object): Response object with status information

**Returns via callback:** Response with HTTP status 202 (Accepted), indicating the archive operation is in progress. The template will appear in the template list when the archiving process completes.

**Errors:**
- 404 Not Found: Block could not be found
- 409 Conflict: Either duplicate archive jobs on the same block (without the first finishing), or the description specified is not unique across the system

**Usage Example:**

```javascript
api.template_create({
  id: 'a124ca83-c026-402d-bec2-9ab2bcf8b9b7',
  description: 'My Ubuntu 20.04 with Node.js 18 setup'
}, function(err, response) {
  if (err) {
    console.error('Error creating template:', err);
    return;
  }

  console.log('Template creation initiated:', response);
  console.log('The template will appear in template list when archiving completes');
});
```

### Destroy Template

Permanently destroys a template.

```javascript { .api }
/**
 * Destroy a template
 * @param {Object} options
 * @param {string} options.id - UUID of the template to destroy (required)
 * @param {Function} callback - Callback function (err, response)
 * @returns {void}
 */
api.template_destroy(options, callback);
```

**Parameters:**
- `options` (Object):
  - `id` (string, required): UUID of the template to destroy
- `callback` (Function): Callback function with signature `(err, response)`
  - `err` (Error|null): Error object if error occurred, null otherwise
  - `response` (Object): Response object confirming destruction

**Errors:**
- 403 Forbidden: You don't have access to destroy this block template
- 404 Not Found: Template was not found

**Usage Example:**

```javascript
api.template_destroy({ id: 'c3bd2420-a36b-4e4e-ae91-500e3275c10d' }, function(err, response) {
  if (err) {
    console.error('Error destroying template:', err);
    return;
  }

  console.log('Template destroyed:', response);
});
```

## Template Workflow

A typical template workflow involves:

1. **Create a Block**: Set up a block with your desired software configuration
2. **Archive to Template**: Use `template_create()` to create a template from the configured block
3. **Wait for Completion**: Monitor `template_list()` until the new template appears (status: 'stored')
4. **Create New Blocks**: Use the template UUID when calling `block_create()` to create new blocks with the same configuration
5. **Clean Up**: Use `template_destroy()` when the template is no longer needed

```javascript
// Example workflow
const workflowExample = function() {
  // Step 1: Assume we have a configured block with ID 'block-uuid'

  // Step 2: Create template from the block
  api.template_create({
    id: 'block-uuid',
    description: 'Production web server template'
  }, function(err, response) {
    if (err) {
      console.error('Failed to create template:', err);
      return;
    }

    console.log('Template archiving started');

    // Step 3: Check template list periodically
    var checkTemplate = function() {
      api.template_list({}, function(err, templates) {
        if (err) return;

        var newTemplate = templates.find(function(t) {
          return t.description === 'Production web server template' && t.status === 'stored';
        });

        if (newTemplate) {
          console.log('Template ready:', newTemplate.id);

          // Step 4: Use template to create new blocks
          api.block_create({
            product: 'product-uuid',
            template: newTemplate.id,
            password: 'secure-pass',
            ssh_public_key: 'ssh-rsa ...'
          }, function(err, block) {
            if (err) {
              console.error('Failed to create block:', err);
              return;
            }
            console.log('New block created from template:', block.id);
          });
        }
      });
    };
  });
};
```

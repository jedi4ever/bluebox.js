# Locations

Location discovery for querying available data center locations where blocks can be deployed. Locations represent physical data centers in different geographic regions.

## Capabilities

### List Locations

Returns a collection of all available data center locations where blocks can be deployed.

```javascript { .api }
/**
 * List all available locations
 * @param {Object} options - Options object (currently accepts empty object)
 * @param {Function} callback - Callback function (err, locations)
 * @returns {void}
 */
api.location_list(options, callback);
```

**Parameters:**
- `options` (Object): Configuration object (can be empty `{}`)
- `callback` (Function): Callback function with signature `(err, locations)`
  - `err` (Error|null): Error object if error occurred, null otherwise
  - `locations` (Location[]): Array of location objects

**Returns via callback:** Array of location objects, each containing:

```javascript { .api }
/**
 * Location object
 * @typedef {Object} Location
 * @property {string} id - Location UUID
 * @property {string} description - Location name (e.g., "Seattle, WA", "Ashburn, VA", "Zurich, CH (Beta)")
 */
```

**Usage Example:**

```javascript
const Bluebox = require('bluebox');

const api = new Bluebox({
  customer_id: 'your-customer-id',
  api_key: 'your-api-key'
});

api.location_list({}, function(err, locations) {
  if (err) {
    console.error('Error listing locations:', err);
    return;
  }

  console.log(`Found ${locations.length} available locations:`);
  locations.forEach(function(location) {
    console.log(`- ${location.description} (ID: ${location.id})`);
  });
});
```

## Using Locations

Location UUIDs are used when creating new blocks to specify where the block should be deployed. Use `location_list()` to discover available locations, then pass the desired location's UUID to `block_create()` via the `location` option.

```javascript
// Example: Create a block in Seattle
api.location_list({}, function(err, locations) {
  if (err) {
    console.error('Error:', err);
    return;
  }

  // Find Seattle location
  var seattleLocation = locations.find(function(loc) {
    return loc.description.indexOf('Seattle') !== -1;
  });

  if (!seattleLocation) {
    console.error('Seattle location not found');
    return;
  }

  // Create block in Seattle
  api.block_create({
    product: 'product-uuid',
    template: 'template-uuid',
    password: 'secure-password',
    ssh_public_key: 'ssh-rsa ...',
    location: seattleLocation.id  // Use Seattle location UUID
  }, function(err, block) {
    if (err) {
      console.error('Error creating block:', err);
      return;
    }

    console.log('Block created in Seattle:', block.id);
    console.log('Location ID:', block.location_id);
  });
});
```

## Location and Template Availability

Templates may not be available in all locations. When listing templates with `template_list()`, each template includes a `locations` array that specifies which location UUIDs that template is available in. Ensure your selected location is compatible with your chosen template:

```javascript
api.template_list({}, function(err, templates) {
  if (err) return;

  api.location_list({}, function(err, locations) {
    if (err) return;

    var myTemplate = templates[0];
    console.log('Template:', myTemplate.description);
    console.log('Available in locations:');

    myTemplate.locations.forEach(function(locationId) {
      var location = locations.find(function(loc) {
        return loc.id === locationId;
      });
      if (location) {
        console.log(`- ${location.description}`);
      }
    });
  });
});
```

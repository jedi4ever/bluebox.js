'use strict';

var hashmerge = require('hashmerge');

/**
 * This method will take the UUID of a block and turn it into a new template.
 * @function template_create
 * @memberof Bluebox
 * @param {Hash} options
 * @param {String} options.id The UUID of the block you want to archive into a template
 * @param {String} [options.description] This will record a description on the template for future use
 * @param {function} callback
 * @instance
 */
var template_create = function(options, callback) {
  var self = this;

  var required = [ 'id' ];
  var optional = [ 'description' ];

  var defaults = {};
  var settings = hashmerge(defaults, options);

  self._request('post', '/block_templates.json', settings , function(err, body, statusCode) {

    if (err) {
      return callback(err) ;
    }

    if (statusCode === 404) {
      return callback(new Error('Not Found - Block could not be found'));
    }

    if (statusCode === 409) {
      // With custom text string
      // This can occur in two circumstances:
      // - First, when you've tried to run duplicate archive jobs on the same block (without the first finishing)
      // - Second, when the description you've specified is not unique across the system.'));
      return callback(new Error('Conflict - ' + body.text));
    }

    // Archive is in progress. Template will show up in template list when complete
    if (statusCode !== 202) {
      return callback(new Error('Unexpected Status Code[' + statusCode + '] : ' + body )) ;
    }


    return callback(null, body);
  });

};

module.exports = template_create;

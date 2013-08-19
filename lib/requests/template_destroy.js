'use strict';

var hashmerge = require('hashmerge');

/**
 * Destroys a template
 * @function template_destroy
 * @memberof Bluebox
 * @param {Hash} options
 * @param {String} options.uuid UUID of the block to destroy
 * @param {Function} options.callback
 * @param {function} callback
 * @instance
 */
var template_destroy = function(options, callback) {
  var self = this;

  var required = [ 'id' ];
  var optional = [ ];

  var defaults = {};
  var settings = hashmerge(defaults, options);
  var id = settings.id;

  self._request('del', '/block_templates/' + id +'.json', settings , function(err, body, statusCode) {

    if (err) {
      return callback(err) ;
    }

    if (statusCode === 404) {
      return callback(new Error('Not Found - Template [' + settings.id + '] was not found.'));
    }

    if (statusCode === 403) {
      return callback(new Error('Forbidden - You don\'t have access to destroy this block template. [' + settings.id + ']'));
    }

    if (statusCode !== 200) {
      return callback(new Error('Unexpected Status Code[' + statusCode + '] : ' + body )) ;
    }

    return callback(null, body);
  });

};

module.exports = template_destroy;

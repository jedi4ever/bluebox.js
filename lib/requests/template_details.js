'use strict';

var hashmerge = require('hashmerge');

/**
 * Retrieve template details
 *
 * @function template_details
 * @memberof Bluebox
 * @param {Hash} options
 * @param {String} options.uuid UUID of the template to retrieve
 * @param {Function} options.callback
 * @param {function} callback
 * @instance
 */
var template_details = function(options, callback) {
  var self = this;

  var required = [ 'uuid' ];
  var optional = [ ];

  var defaults = {};
  var settings = hashmerge(defaults, options);
  var uuid = settings.uuid;

  self._request('get', '/block_templates/' + uuid +'.json', settings , function(err, body, statusCode) {

    if (err) {
      return callback(err) ;
    }

    if (statusCode === 404) {
      return callback(new Error('Not Found - Block [' + settings.uuid + '] was not found.'));
    }

    if (statusCode !== 200) {
      return callback(new Error('Unexpected Status Code[' + statusCode + '] : ' + body )) ;
    }

    return callback(null, body);
  });

};

module.exports = template_details;

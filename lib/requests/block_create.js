'use strict';

var hashmerge = require('hashmerge');

/**
 * There is definitely more to this that block creation `lblala`
 * @function block_create
 * @memberof Bluebox
 * @param {Hash} options
 * @param {String} options.product
 * @param {String} options.password
 * @param {String} options.ssh_public_key
 * @param {String} [options.hostname] Hostname for the block
 * @param {String} [options.hostname] Username to login into the block
 * @param {function} callback
 * @instance
 */
var block_create = function(options, callback) {
  var self = this;

  var required = [ 'product', 'template', 'password' , 'ssh_public_key' ];
  var optional = [ 'hostname', 'username', 'location', 'lb_applications', 'lb_services', 'lb_backends' ];

  var defaults = {};
  var settings = hashmerge(defaults, options);

  self._request('post', '/blocks.json', settings , function(err, body, statusCode) {

    if (err) {
      return callback(err) ;
    }

    if (statusCode === 400) {
      return callback(new Error('Bad Request - Posted data was incomplete. Check text variable for specific error.'));
    }

    if (statusCode === 404) {
      return callback(new Error('Not Found - The product or template specified could not be found. Check text variable for specific error.'));
    }

    if (statusCode === 406) {
      return callback(new Error('Not Acceptable - SSH key was not submitted and password did not pass libcrack test.'));
    }

    if (statusCode === 409) {
      return callback(new Error('Conflict - Out of capacity / API error occurred.'));
    }

    if (statusCode !== 200) {
      return callback(new Error('Unexpected Status Code[' + statusCode + '] : ' + body )) ;
    }

    return callback(null, body);
  });

};

module.exports = block_create;

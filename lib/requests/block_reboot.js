'use strict';

var hashmerge = require('hashmerge');

/**
 * Reboots a block
 * @function block_reboot
 * @memberof Bluebox
 * @param {Hash} options
 * @param {String} options.uuid UUID of the block to destroy
 * @param {Function} options.callback
 * @param {function} callback
 * @instance
 */
var block_reboot = function(options, callback) {
  var self = this;

  var required = [ 'uuid' ];
  var optional = [ ];

  var defaults = {};
  var settings = hashmerge(defaults, options);
  var uuid = settings.uuid;

  self._request('put', '/blocks/' + uuid +'/reboot.json', settings , function(err, body, statusCode) {

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


module.exports = block_reboot;

'use strict';

var hashmerge = require('hashmerge');

/**
 * Retrieve block details
 *
 * Special Note - Status Field:
 * The status field shows the status of the block through its lifecycle. It can have the following values:
 *
 * queued - The block has been queued and is awaiting pickup by a host.
 * building - The block has been picked up and is building on a remote host.
 * running - The block is now running and should be accessible via IP.
 * error - There was a failure with the deployment. BBG will investigate, but this block should not be functional.
 *
 * @function block_details
 * @memberof Bluebox
 * @param {Hash} options
 * @param {String} options.uuid UUID of the block to retrieve
 * @param {Function} options.callback
 * @param {function} callback
 * @instance
 */
var block_details = function(options, callback) {
  var self = this;

  var required = [ 'uuid' ];
  var optional = [ ];

  var defaults = {};
  var settings = hashmerge(defaults, options);
  var uuid = settings.uuid;

  self._request('get', '/blocks/' + uuid +'.json', settings , function(err, body, statusCode) {

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

module.exports = block_details;

/*
 * { id: 'a124ca83-c026-402d-bec2-9ab2bcf8b9b7',
  hostname: 'block6115604-s5a.blueboxgrid.com',
  description: '1 GB RAM + 20 GB Disk',
  memory: 1073741824,
  storage: 21474836480,
  cpu: 0.5,
  ips:
   [ { address: '67.214.216.150' },
     { address: '2607:f700:1:cb:26a2:23e7:b787:de3e' } ],
  lb_applications: [],
  status: 'running',
  location_id: '37c2bd9a-3e81-46c9-b6e2-db44a25cc675',
  product:
   { id: '94fd37a7-2606-47f7-84d5-9000deda52ae',
     description: 'Block 1GB Virtual Server',
     cost: '0.15' } }
 */

'use strict';

var hashmerge = require('hashmerge');

/**
 * This command creates a new block.
 * @function block_create
 * @memberof Bluebox
 * @param {Hash} options
 * @param {String} options.product The UUID of a product. These are available with the /api/block_products call.
 * @param {String} options.template The UUID of a template. These are available with the /api/block_templates call.
 * @param {String} options.password password that be used to login (either specify password, ssh_public_key , or both)
 * @param {String} options.ssh_public_key ssh-public_key that can be used to login into the block (either specify password, ssh_public_key , or both)
 * @param {String} [options.hostname] Short hostname for your new block. It will be automatically appended with .custXXXX where XXXX is your customer ID
 * @param {String} [options.username] Username for your new user. Defaults to deploy.
 * @param {String} [options.location] The UUID of a location. These are available with the /api/locations call.
 * @param {String} [options.lb_applications] List of Load Balanced Application UUID's, separated by commas without whitespace
 * @param {String} [options.lb_services] List of Load Balanced Service UUID's, separated by commas without whitespace
 * @param {String} [options.lb_backends] List of Load Balanced Backend UUID's, separated by commas without whitespace
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

/*
 { id: 'ff8c4ad7-1418-4044-8661-0dada1be2fbc',
 hostname: 'block6106985-nqu.blueboxgrid.com',
 description: '1 GB RAM + 20 GB Disk',
 memory: 1073741824,
 storage: 21474836480,
 cpu: 0.5,
 ips:
  [ { address: '67.214.214.43' },
    { address: '2607:f700:1:bd:8b40:1aa4:42c0:c8fd' } ],
 lb_applications: [],
 status: 'queued',
 location_id: '37c2bd9a-3e81-46c9-b6e2-db44a25cc675',
 product:
  { id: '94fd37a7-2606-47f7-84d5-9000deda52ae',
    description: 'Block 1GB Virtual Server',
    cost: '0.15' },
 add_to_lb_application_results: { text: 'no load balanced application specified.' } }
*/

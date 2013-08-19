'use strict';

/**
 * Returns collection of existing products
 * @function product_list
 * @memberof Bluebox
 * @param {Hash} options
 * @param {function} callback
 * @instance
 */
var product_list = function(options, callback) {
  var self = this;

  self._request('get', '/block_products.json', {} , function(err, body, statusCode) {
    if (err) {
      return callback(err) ;
    }

    if (statusCode !== 200) {
      return callback(new Error('Unexpected Status Code['+statusCode+'] : ' + body )) ;
    }

    callback(null, body);
  });

};

module.exports = product_list;

/*
   [ { id: '94fd37a7-2606-47f7-84d5-9000deda52ae',
description: 'Block 1GB Virtual Server',
cost: '0.15' },
{ id: 'b412f354-5056-4bf0-a42f-6ddd998aa092',
description: 'Block 2GB Virtual Server',
cost: '0.25' },
{ id: '80be5b49-2d30-4188-bed8-38eebb21f5d1',
description: 'Block 3GB Virtual Server',
cost: '0.3' },
{ id: '0cd183d3-0287-4b1a-8288-b3ea8302ed58',
description: 'Block 4GB Virtual Server',
cost: '0.35' },
{ id: 'b9b87a5b-2885-4a2e-b434-44a163ca6251',
description: 'Block 8GB Virtual Server',
cost: '0.45' } ]
*/

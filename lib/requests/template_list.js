'use strict';

/**
 * Returns collection of existing templates
 * @function template_list
 * @memberof Bluebox
 * @param {Hash} options
 * @param {function} callback
 * @instance
 */
var template_list = function(options, callback) {
  var self = this;

  self._request('get', '/block_templates.json', {} , function(err, body, statusCode) {
    if (err) {
      return callback(err) ;
    }

    if (statusCode !== 200) {
      return callback(new Error('Unexpected Status Code['+statusCode+'] : ' + body )) ;
    }

    callback(null, body);
  });

};

module.exports = template_list;

/*

   { id: 'c3bd2420-a36b-4e4e-ae91-500e3275c10d',
status: 'stored',
description: 'Debian jessie/sid amd64 bare 20130807',
public: true,
locations:
[ '37c2bd9a-3e81-46c9-b6e2-db44a25cc675',
'016cdf0f-821b-4bed-8b9c-cd46f02c2363',
'7506e315-5b1d-4959-a876-0caef9ba8824' ],
created: '2013-08-07T02:46:48-07:00' } ]

*/

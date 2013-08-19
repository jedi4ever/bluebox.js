'use strict';

var location_list = function(options, callback) {
  var self = this;

  self._request('get', '/locations.json', {} , function(err, body, statusCode) {
    if (err) {
      return callback(err) ;
    }


   if (statusCode !== 200) {
     return callback(new Error('Unexpected Status Code['+statusCode+'] : ' + body )) ;
   }

    callback(null, body);
  });

};

module.exports = location_list;

/*
    [ { id: '37c2bd9a-3e81-46c9-b6e2-db44a25cc675'
    description: 'Seattle, WA' },
  { id: '016cdf0f-821b-4bed-8b9c-cd46f02c2363',
    description: 'Ashburn, VA' },
  { id: '7506e315-5b1d-4959-a876-0caef9ba8824',
    description: 'Zurich, CH (Beta)' } ]
 */

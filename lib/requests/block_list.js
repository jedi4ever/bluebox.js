'use strict';

var block_list = function(options, callback) {
  var self = this;

  self._request('get', '/blocks.json', {} , function(err, body, statusCode) {

    if (err) {
      return callback(err) ;
    }

    if (statusCode !== 200) {
      return callback(new Error('Unexpected Status Code['+statusCode+'] : ' + body )) ;
    }

    callback(null, body);
  });

};

module.exports = block_list;

/*
    [ { id: '767d24f2-59d1-4d39-9b03-140d6319be29',
    hostname: 'wonderme.c46062.blueboxgrid.com',
    description: '1 GB RAM + 20 GB Disk',
    memory: 1073741824,
    storage: 21474836480,
    cpu: 0.5,
    ips: [ [Object], [Object] ],
    lb_applications: [],
    status: 'queued',
    location_id: '37c2bd9a-3e81-46c9-b6e2-db44a25cc675' } ]
*/

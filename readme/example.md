    var Bluebox = require('bluebox');

    var credentials = {
      'customer_id': <insert yours>,
      'api_key': <insert your>
    };

    var api = new Bluebox(credentials);

    api.block_list({},function(err, blocks) {
      console.log(blocks);
    });

    api.block_details({uid: 'abc1234...' },function(err, block) {
      console.log(block);
    });

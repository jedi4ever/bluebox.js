//'use strict';
/* jshint -W030 */
// Disable Strings must use singlequote
/* jshint -W109 */


var expect = require('chai').expect;
var async = require('async');
var nock = require('nock');

//nock.recorder.rec();

var Bluebox = require('../lib/bluebox');
var fs = require('fs');
var path = require('path');

var credentials = require('../config.js');

var api = new Bluebox(credentials);

// For mocking we disable the ssl
api.settings.strictSSL = false;

var nodeBlueboxBlockId = null;

var ubuntuTemplate;
var cheapestProduct;
var createdBlockId;

var findUbuntu = function(callback) {

  api.template_list({}, function(err,list) {

    var found, index;

    for(index = 0 ; index < list.length ; ++index) {
      var template = list[index];
      if (template.description.indexOf('Ubuntu') >=0) {
        found = index;
        break;
      }
    }

    if (!found) {
      return callback(new Error('No ubuntu Template found'));
    } else {
      var foundTemplate = {
        location: list[found].locations[0],
        id: list[found].id
      };
      return callback(null, foundTemplate);
    }
  });
};

var findCheapestProduct = function(callback) {
  api.product_list({}, function(err,products) {
    var cheapProduct, index;

    for(index = 0 ; index < products.length ; ++index) {
      var product = products[index];
      if (!cheapProduct) {
        cheapProduct = product;
      } else {
        if (product.cost < cheapProduct.cost) {
          cheapProduct = product;
        }
      }
    }

    if (!cheapProduct) {
      return callback(new Error('Can\'t find cheap product as there are no products found'));
    } else {
      return callback(null,cheapProduct);
    }
  });
};

describe('Bluebox', function() {
  // Some tasks can take a long time
  this.timeout(1000);

  before(function(done) {
    async.parallel([ findUbuntu, findCheapestProduct],
                   function(err,results) {
                     ubuntuTemplate = results[0];
                     cheapestProduct = results[1];
                     done(err);
                   });
  });

  it('block_list should list the servers', function(done) {

    var block_list = nock('https://boxpanel.bluebox.net:443')
    .get('/api///blocks.json')
    .reply(200, "[]", { 'content-type': 'application/json; charset=utf-8',
           'content-length': '2',
           status: '200',
           'x-powered-by': 'Phusion Passenger (mod_rails/mod_rack) 3.0.19',
           'x-runtime': '22',
           etag: '"d751713988987e9331980363e24189ce"',
           'cache-control': 'private, max-age=0, must-revalidate',
           server: 'nginx/1.2.8 + Phusion Passenger 3.0.19'
    });

    api.block_list({},function(err, list) {
      done(err);
    });
  });

  it('template_list should list the templates', function(done) {

    var template_list = nock('https://boxpanel.bluebox.net:443')
    .get('/api///block_templates.json')
    .reply(200, "[{\"id\":\"a8f05200-7638-47d1-8282-2474ef57c4c3\",\"status\":\"stored\",\"description\":\"Scientific Linux 6 (Latest Release)\",\"public\":true,\"locations\":[\"37c2bd9a-3e81-46c9-b6e2-db44a25cc675\",\"7506e315-5b1d-4959-a876-0caef9ba8824\"],\"created\":\"2011-11-28T13:36:04-08:00\"},{\"id\":\"45deff2b-e2a6-480f-81c6-b42eafd1a097\",\"status\":\"stored\",\"description\":\"Ubuntu 12.04 LTS i386 bare 20130807\",\"public\":true,\"locations\":[\"37c2bd9a-3e81-46c9-b6e2-db44a25cc675\",\"016cdf0f-821b-4bed-8b9c-cd46f02c2363\",\"7506e315-5b1d-4959-a876-0caef9ba8824\"],\"created\":\"2013-08-06T23:26:36-07:00\"},{\"id\":\"fba94d97-bdfa-4d54-8a8c-692e321c2c08\",\"status\":\"stored\",\"description\":\"Scientific Linux release 6.4 (Carbon) x86_64 bare 20130807\",\"public\":true,\"locations\":[\"37c2bd9a-3e81-46c9-b6e2-db44a25cc675\",\"7506e315-5b1d-4959-a876-0caef9ba8824\",\"016cdf0f-821b-4bed-8b9c-cd46f02c2363\"],\"created\":\"2013-08-06T23:29:02-07:00\"},{\"id\":\"748e6049-179d-4913-8e97-0737a1783121\",\"status\":\"stored\",\"description\":\"Debian 7.1 i386 bare 20130807\",\"public\":true,\"locations\":[\"37c2bd9a-3e81-46c9-b6e2-db44a25cc675\",\"7506e315-5b1d-4959-a876-0caef9ba8824\",\"016cdf0f-821b-4bed-8b9c-cd46f02c2363\"],\"created\":\"2013-08-06T23:46:53-07:00\"},{\"id\":\"0698dc4b-499a-4a81-a4e2-ad381520f32f\",\"status\":\"stored\",\"description\":\"Scientific Linux release 6.4 (Carbon) i386 bare 20130807\",\"public\":true,\"locations\":[\"37c2bd9a-3e81-46c9-b6e2-db44a25cc675\",\"7506e315-5b1d-4959-a876-0caef9ba8824\",\"016cdf0f-821b-4bed-8b9c-cd46f02c2363\"],\"created\":\"2013-08-06T23:59:05-07:00\"},{\"id\":\"dba78252-df8c-4633-a3f0-40ec2442b8f1\",\"status\":\"stored\",\"description\":\"Ubuntu 12.04 LTS amd64 bare 20130807\",\"public\":true,\"locations\":[\"37c2bd9a-3e81-46c9-b6e2-db44a25cc675\",\"7506e315-5b1d-4959-a876-0caef9ba8824\",\"016cdf0f-821b-4bed-8b9c-cd46f02c2363\"],\"created\":\"2013-08-07T00:26:32-07:00\"},{\"id\":\"36c143e6-dcf8-47c1-9023-7cdc4649cbe2\",\"status\":\"stored\",\"description\":\"CentOS release 6.4 (Final) x86_64 bare 20130807\",\"public\":true,\"locations\":[\"37c2bd9a-3e81-46c9-b6e2-db44a25cc675\",\"7506e315-5b1d-4959-a876-0caef9ba8824\",\"016cdf0f-821b-4bed-8b9c-cd46f02c2363\"],\"created\":\"2013-08-07T00:29:23-07:00\"},{\"id\":\"d04be39a-2f89-4c2a-978a-bcd0e56f6ce6\",\"status\":\"stored\",\"description\":\"Debian 7.1 amd64 bare 20130807\",\"public\":true,\"locations\":[\"37c2bd9a-3e81-46c9-b6e2-db44a25cc675\",\"016cdf0f-821b-4bed-8b9c-cd46f02c2363\",\"7506e315-5b1d-4959-a876-0caef9ba8824\"],\"created\":\"2013-08-07T00:46:39-07:00\"},{\"id\":\"0614aa44-ab0d-483a-b159-0e33f3733ee2\",\"status\":\"stored\",\"description\":\"CentOS release 6.4 (Final) i386 bare 20130807\",\"public\":true,\"locations\":[\"37c2bd9a-3e81-46c9-b6e2-db44a25cc675\",\"016cdf0f-821b-4bed-8b9c-cd46f02c2363\",\"7506e315-5b1d-4959-a876-0caef9ba8824\"],\"created\":\"2013-08-07T00:59:43-07:00\"},{\"id\":\"a82dff5a-2366-4455-8acf-1b3708e5c4ef\",\"status\":\"stored\",\"description\":\"Debian jessie/sid i386 bare 20130807\",\"public\":true,\"locations\":[\"37c2bd9a-3e81-46c9-b6e2-db44a25cc675\",\"7506e315-5b1d-4959-a876-0caef9ba8824\",\"016cdf0f-821b-4bed-8b9c-cd46f02c2363\"],\"created\":\"2013-08-07T01:46:50-07:00\"},{\"id\":\"c3bd2420-a36b-4e4e-ae91-500e3275c10d\",\"status\":\"stored\",\"description\":\"Debian jessie/sid amd64 bare 20130807\",\"public\":true,\"locations\":[\"37c2bd9a-3e81-46c9-b6e2-db44a25cc675\",\"016cdf0f-821b-4bed-8b9c-cd46f02c2363\",\"7506e315-5b1d-4959-a876-0caef9ba8824\"],\"created\":\"2013-08-07T02:46:48-07:00\"}]", {
      'content-type': 'application/json; charset=utf-8',
      'content-length': '3310',
      status: '200',
      'x-powered-by': 'Phusion Passenger (mod_rails/mod_rack) 3.0.19',
      'x-runtime': '67',
      etag: '"ceeb5f651d7581e84bac26a06fe2f03a"',
      'cache-control': 'private, max-age=0, must-revalidate',
      server: 'nginx/1.2.8 + Phusion Passenger 3.0.19'
    });

    api.template_list({},function(err, templates) {
      done(err);
    });
});

it('location_list should list the locations', function(done) {

  var location_list = nock('https://boxpanel.bluebox.net:443')
  .get('/api///locations.json')
  .reply(200, "[{\"id\":\"37c2bd9a-3e81-46c9-b6e2-db44a25cc675\",\"description\":\"Seattle, WA\"},{\"id\":\"016cdf0f-821b-4bed-8b9c-cd46f02c2363\",\"description\":\"Ashburn, VA\"},{\"id\":\"7506e315-5b1d-4959-a876-0caef9ba8824\",\"description\":\"Zurich, CH (Beta)\"}]", {
    'content-type': 'application/json; charset=utf-8',
    'content-length': '229',
    status: '200',
    'x-powered-by': 'Phusion Passenger (mod_rails/mod_rack) 3.0.19',
    'x-runtime': '19',
    etag: '"2c9da83d32fb0d1f356f2982d20a6034"',
    'cache-control': 'private, max-age=0, must-revalidate',
    server: 'nginx/1.2.8 + Phusion Passenger 3.0.19'
  });

  api.location_list({},function(err, locations) {
    done(err);
  });
});

it('product_list should list the products', function(done) {

  var product_list = nock('https://boxpanel.bluebox.net:443')
  .get('/api///block_products.json')
  .reply(200, "[{\"id\":\"94fd37a7-2606-47f7-84d5-9000deda52ae\",\"description\":\"Block 1GB Virtual Server\",\"cost\":\"0.15\"},{\"id\":\"b412f354-5056-4bf0-a42f-6ddd998aa092\",\"description\":\"Block 2GB Virtual Server\",\"cost\":\"0.25\"},{\"id\":\"80be5b49-2d30-4188-bed8-38eebb21f5d1\",\"description\":\"Block 3GB Virtual Server\",\"cost\":\"0.3\"},{\"id\":\"0cd183d3-0287-4b1a-8288-b3ea8302ed58\",\"description\":\"Block 4GB Virtual Server\",\"cost\":\"0.35\"},{\"id\":\"b9b87a5b-2885-4a2e-b434-44a163ca6251\",\"description\":\"Block 8GB Virtual Server\",\"cost\":\"0.45\"}]", {
    'content-type': 'application/json; charset=utf-8',
    'content-length': '505',
    status: '200',
    'x-powered-by': 'Phusion Passenger (mod_rails/mod_rack) 3.0.19',
    'x-runtime': '20',
    etag: '"3b660ec61b4ef67d27c3b098df3c359f"',
    'cache-control': 'private, max-age=0, must-revalidate',
    server: 'nginx/1.2.8 + Phusion Passenger 3.0.19'
  });

  api.product_list({},function(err, products) {
    done(err);
  });
});

it('block_destroy should error on a non-existing block', function(done) {
  var options = { uuid: 'some-really-not-existing-block' } ;

  var block_destroy_non_existing = nock('https://boxpanel.bluebox.net:443')
  .delete('/api///blocks/some-really-not-existing-block.json', "uuid=some-really-not-existing-block")
  .reply(404, "{\"text\":\"Block could not be found with that UUID.\",\"error\":404}", {
    'content-type': 'application/json; charset=utf-8',
    'content-length': '63',
    status: '404',
    'x-powered-by': 'Phusion Passenger (mod_rails/mod_rack) 3.0.19',
    'cache-control': 'no-cache',
    'x-runtime': '23',
    server: 'nginx/1.2.8 + Phusion Passenger 3.0.19'
  });

  api.block_destroy(options,function(err, block) {
    expect(err).not.to.be.null;
    done();
  });
});

it('block_create should create a new block', function(done) {
  // Creation might take > 10sec
     var create_request = nock('https://boxpanel.bluebox.net:443')
     .post('/api///blocks.json', "product=94fd37a7-2606-47f7-84d5-9000deda52ae&template=45deff2b-e2a6-480f-81c6-b42eafd1a097&password=1LSFL43L2!!&location=37c2bd9a-3e81-46c9-b6e2-db44a25cc675")
     .reply(200, "{\"id\":\"1f843100-f46d-44d0-bf63-ecee37d78e3d\",\"hostname\":\"block6109823-se7.blueboxgrid.com\",\"description\":\"1 GB RAM + 20 GB Disk\",\"memory\":1073741824,\"storage\":21474836480,\"cpu\":0.5,\"ips\":[{\"address\":\"67.214.220.163\"},{\"address\":\"2607:f700:1:d1:9c0d:d37f:39de:97a9\"}],\"lb_applications\":[],\"status\":\"queued\",\"location_id\":\"37c2bd9a-3e81-46c9-b6e2-db44a25cc675\",\"product\":{\"id\":\"94fd37a7-2606-47f7-84d5-9000deda52ae\",\"description\":\"Block 1GB Virtual Server\",\"cost\":\"0.15\"},\"add_to_lb_application_results\":{\"text\":\"no load balanced application specified.\"}}", { 'content-type': 'application/json; charset=utf-8',
     'content-length': '553',
status: '200',
'x-powered-by': 'Phusion Passenger (mod_rails/mod_rack) 3.0.19',
'x-runtime': '9212',
etag: '"bb27673d47a9fefc62de024d66534fc4"',
'cache-control': 'private, max-age=0, must-revalidate',
'set-cookie': [ 'xquUsxWwxQMuBTdZqQTUM74xcctrM3uUcBUr=c7e1131cd5c91523eee9bae4c352e7f6; path=/; HttpOnly' ],
server: 'nginx/1.2.8 + Phusion Passenger 3.0.19' });

    this.timeout(15000);
    var options = {
product: cheapestProduct.id ,
template: ubuntuTemplate.id ,
password: '1LSFL43L2!!',
location: ubuntuTemplate.location
    } ;

  api.block_create(options,function(err, block) {
    //expect(create_request.isDone()).to.be.true;
    expect(err).to.be.null;
    if (!err) {
      createdBlockId = block.id;
    }
    done();
  });
});

it('block_detailsshould show the details of an exiting block', function(done) {

  if (!createdBlockId) {
    return done(new Error('no block was created in this test run'));
  }

  var block_details = nock('https://boxpanel.bluebox.net:443')
  .get('/api///blocks/' +  createdBlockId + '.json', "uuid="+createdBlockId)
  .reply(200, "{\"id\":\"a124ca83-c026-402d-bec2-9ab2bcf8b9b7\",\"hostname\":\"block6115604-s5a.blueboxgrid.com\",\"description\":\"1 GB RAM + 20 GB Disk\",\"memory\":1073741824,\"storage\":21474836480,\"cpu\":0.5,\"ips\":[{\"address\":\"67.214.216.150\"},{\"address\":\"2607:f700:1:cb:26a2:23e7:b787:de3e\"}],\"lb_applications\":[],\"status\":\"running\",\"location_id\":\"37c2bd9a-3e81-46c9-b6e2-db44a25cc675\",\"product\":{\"id\":\"" + createdBlockId + "\",\"description\":\"Block 1GB Virtual Server\",\"cost\":\"0.15\"}}", {
    'content-type': 'application/json; charset=utf-8',
    'content-length': '471',
    status: '200',
    'x-powered-by': 'Phusion Passenger (mod_rails/mod_rack) 3.0.19',
    'x-runtime': '33',
    etag: '"df1562f620bd2043f89937c047c540b0"',
    'cache-control': 'private, max-age=0, must-revalidate',
    server: 'nginx/1.2.8 + Phusion Passenger 3.0.19'
  });

  var options = { uuid: createdBlockId };

  api.block_details(options,function(err, block) {
    expect(err).to.be.null;
    done();
  });
});

it('block_destroy should destroy existing block', function(done) {

  if (!createdBlockId) {
    return done(new Error('no block was created in this test run'));
  }

  var destroy_request = nock('https://boxpanel.bluebox.net:443')
  .delete('/api///blocks/' +  createdBlockId +'.json', "uuid=" +  createdBlockId)
  .reply(200, "{\"text\":\"Block destroyed.\"}", {
    'content-type': 'application/json; charset=utf-8',
    'content-length': '27',
    status: '200',
    'x-powered-by': 'Phusion Passenger (mod_rails/mod_rack) 3.0.19',
    'x-runtime': '115',
    etag: '"1a69a961bf5ed03127169e3fdc8086cd"',
    'cache-control': 'private, max-age=0, must-revalidate',
    server: 'nginx/1.2.8 + Phusion Passenger 3.0.19'
  });

  var options = { uuid: createdBlockId };

  api.block_destroy(options,function(err, block) {
    expect(err).to.be.null;
    done();
  });
});


    });

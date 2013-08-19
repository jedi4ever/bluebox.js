//'use strict';

var expect = require('chai').expect;
var Bluebox = require('../lib/bluebox');
var fs = require('fs');
var path = require('path');

var credentials = require('../config.js');

var api = new Bluebox(credentials);

var nodeBlueboxBlockId = null;

var ubuntuTemplate = null;
var cheapProduct = null;

describe('Bluebox', function() {

  before(function(done) {
      api.template_list({}, function(err,list) {
        list.forEach(function(template) {
          if (ubuntuTemplate) { return; }
          if (template.description.indexOf('Ubuntu') >=0) {
            var found = {
              location: template.locations[0],
              id: template.id
            };
            ubuntuTemplate = found;
          }
        });
        api.product_list({}, function(err,list) {
          list.forEach(function(product) {
            if (!cheapProduct) {
              cheapProduct = product;
            } else {
              if (product.cost < cheapProduct.cost) {
                cheapProduct = product;
              }
            }
          });
          done();
        });
    });
  });

  // Some tasks can take a long time
  this.timeout(5000);

  it('block_list should list the servers', function(done) {
    api.block_list({},function(err, list) {
      done(err);
    });
  });

  it('template_list should list the templates', function(done) {
    api.template_list({},function(err, templates) {
      done(err);
    });
  });

  it('location_list should list the locations', function(done) {
    api.location_list({},function(err, locations) {
      done(err);
    });
  });

  it('product_list should list the products', function(done) {
    api.product_list({},function(err, products) {
      done(err);
    });
  });

  it('block_destroy should error on a non-existing block', function(done) {
    var options = { uuid: 'notexisting' } ;

    api.block_destroy(options,function(err, block) {
      expect(err).not.to.equal(null);
      done();
    });
  });

  it('block_create should create a new block', function(done) {
    var options = { product: cheapProduct.id , template: ubuntuTemplate.id , location: ubuntuTemplate.location } ;
    console.log(options);

    api.block_create(options,function(err, block) {
      console.log(err);
      expect(err).to.equal(null);
      done();
    });
  });


  it('block_destroy should destroy existing block', function(done) {
    var options = { uuid: '767d24f2-59d1-4d39-9b03-140d6319be29' } ;

    api.block_destroy(options,function(err, block) {
      expect(err).to.equal(null);
      done();
    });
  });


});

'use strict';

var hashmerge = require('hashmerge');
var request = require('request');

// @external Bluebox

/**
 * @author Patrick Debois
 * @constructor
 * @name Bluebox
 * @param {hash} options Specify customer_id and api_key
 */
var Bluebox = function(options) {

  var self = this;

  var defaults = {
    customer_id: null,
    api_key: null
  };

  self.settings = hashmerge( defaults , options);

};

module.exports = Bluebox;

Bluebox.prototype.credentials = function() {
  var self = this;

  var credentials = {
    customer_id: self.settings.customer_id,
    api_key: self.settings.api_key
  };
  return credentials;
};

var API_URL = 'https://boxpanel.bluebox.net/api/';

Bluebox.prototype._request = function(method, url, parameters, callback) {

  var methodParams = hashmerge(parameters,{}); // Add credentials to methodParams
  var getURL = API_URL + '/' + url ;

  var requestParams = {
    url: getURL,
    form: methodParams, // Pass things through application/x-www-form-urlencoded
    strictSSL: true,
    auth: {
      user: this.credentials().customer_id,
      password: this.credentials().api_key,
      sendImmediately: true,
    },
    json: true
  };

  request[method](requestParams, function(error, response, body) {
    if (response.statusCode === 401) {
      error = new Error('Unauthorized - Invalid API Key. Please confirm you have the proper key / customer ID pair');
      return callback(error, body);
    }

    if (response.statusCode === 403) {
      error = new Error('Forbidden - API Key does not have access from requesting IP. Please confirm your requesting IP is in the allowed list for that specific key.');
      return callback(error, body);
    }

    if (response.statusCode === 409) {
      error = new Error('Conflict - Error in API. BBG has been notified and will be in touch soon.');
      return callback(error, body);
    }

    if (response.statusCode === 500) {
      error = new Error('Internal Server Error - Error in API. BBG has been notified and will be in touch soon.');
      return callback(error, body);
    }

    // We pass ok, but some functions will have to check the statusCode
    return callback(null, body, response.statusCode);

  });

};

// Auto load functions
var fs = require('fs');
var path = require('path');
var requestsPath = path.join(__dirname,'requests');

var requests = fs.readdirSync(requestsPath);
requests.forEach(function(filename) {
  if (path.extname(filename) === '.js' ) {
    var requestName = path.basename(filename, '.js');
    Bluebox.prototype[requestName] = require(path.join(__dirname, './requests', requestName));
  }
});

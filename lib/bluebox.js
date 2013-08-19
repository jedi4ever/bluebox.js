'use strict';

var hashmerge = require('hashmerge');
var request = require('request');

// @external Bluebox

/**
 * @constructor
 * @name Bluebox
 * @param {hash} options
 * @param {hash} options.customer_id The Bluebox customer Id
 * @param {hash} options.api_key The Bluebox API key
 */
var Bluebox = function(options) {

  var self = this;

  var defaults = {
    customer_id: null,
    api_key: null
  };

  /**
   * Settings as used by the Bluebox object
   * @instance
   * @memberof Bluebox
   * @name settings
   * @type {hash}
   */
  this.settings = hashmerge( defaults , options);

};

module.exports = Bluebox;

/**
 * Credential Pair
 * @typedef {Hash} Credential-Pair
 * @property {string} customer_id
 * @property {string} api_key
 */

/**
 * Credentials to access Bluebox API
 * @public
 * @returns {Credential-Pair} The Bluebox credential pair in use
 */
Bluebox.prototype.credentials = function() {
  var self = this;

  var credentials = {
    customer_id: self.settings.customer_id,
    api_key: self.settings.api_key
  };
  return credentials;
};

/**
 * Base URL that is used to make requests
 * @const {String} API_URL
 * @memberof Bluebox
 * @static
 */
Bluebox.API_URL = 'https://boxpanel.bluebox.net/api/';

/**
 * Request Callback
 * @callback {Function} Request-Callback
 * @param {Error} error If an error occurs, else null
 * @param {Body} body Request body
 * @param {String} statusCode HTTP Status Code
 */

/**
 * @param {String} method to use for the request (get, post, put , del)
 * @param {String} url url to request
 * @param {String} parameters variable to post to the url
 * @param {Request-Callback} callback function to execute when request succeeds or fails
 * @private
 */
Bluebox.prototype._request = function(method, url, parameters, callback) {

  var methodParams = hashmerge(parameters,{}); // Add credentials to methodParams
  var getURL = Bluebox.API_URL + '/' + url ;

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

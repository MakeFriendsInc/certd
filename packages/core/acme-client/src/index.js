/**
 * acme-client
 */

exports.Client = require('./client');

/**
 * Directory URLs
 */

exports.directory = {
    buypass: {
        staging: 'https://api.test4.buypass.no/acme/directory',
        production: 'https://api.buypass.com/acme/directory',
    },
    google: {
        staging: 'https://dv.acme-v02.test-api.pki.goog/directory',
        production: 'https://dv.acme-v02.api.pki.goog/directory',
    },
    letsencrypt: {
        staging: 'https://acme-staging-v02.api.letsencrypt.org/directory',
        production: 'https://acme-v02.api.letsencrypt.org/directory',
    },
    zerossl: {
        staging: 'https://acme.zerossl.com/v2/DV90',
        production: 'https://acme.zerossl.com/v2/DV90',
    },
};

/**
 * Crypto
 */

exports.crypto = require('./crypto');
exports.forge = require('./crypto/forge');

/**
 * Axios
 */

exports.axios = require('./axios');
exports.agents = require('./agents');

/**
 * Logger
 */

exports.setLogger = require('./logger').setLogger;

exports.walkTxtRecord = require('./verify').walkTxtRecord;
exports.CancelError = require('./error').CancelError;

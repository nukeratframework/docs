const mod = require('@uri/decode');
const decode = typeof mod === 'function' ? mod : mod.default;

module.exports = decode;

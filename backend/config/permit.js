// backend/config/permit.js
const { Permit } = require("permitio");
console.log(process.env.PERMIT_PDP_URL)
console.log(process.env.PERMIT_API_KEY)
const permit = new Permit({
    pdp: process.env.PERMIT_PDP_URL || 'https://cloudpdp.api.permit.io',
    token: process.env.PERMIT_API_KEY || 'permit_key_WPOcRMgGA6ovKTxYPps0zDmxbF7S185KA8092IBcMt71JpKEt48khrngmWn1bW6kljlbOrMxtJjueSLVHIIYM9',
    debug: process.env.NODE_ENV !== 'production'
});

module.exports = permit;

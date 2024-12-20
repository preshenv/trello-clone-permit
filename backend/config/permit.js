// backend/config/permit.js
const { Permit } = require("permitio");
const permit = new Permit({
    pdp: process.env.PERMIT_PDP_URL',
    token: process.env.PERMIT_API_KEY,
    debug: process.env.NODE_ENV !== 'production'
});

module.exports = permit;

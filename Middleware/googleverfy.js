const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client("367393474458-fnu2spn2d35kjvldokv832gqh8n6vppm.apps.googleusercontent.com");


async function verfytoken(token)  {
    const ticket = await client.verifyIdToken({
        idToken:token,
        audience:"367393474458-fnu2spn2d35kjvldokv832gqh8n6vppm.apps.googleusercontent.com"
    })
    const payload = ticket.getPayload();
    return payload;
}

module.exports = verfytoken;
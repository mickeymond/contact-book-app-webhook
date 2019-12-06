// server.js
const express = require('express');
const jwt = require('express-jwt');
// const jwtAuthz = require('express-jwt-authz');
const jwksRsa = require('jwks-rsa');

const PORT = process.env.PORT || 4000;

const app = express();

// Authentication middleware. When used, the
// Access Token must exist and be verified against
// the Auth0 JSON Web Key Set
const checkJwt = jwt({
  // Dynamically provide a signing key
  // based on the kid in the header and 
  // the signing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://mikebuildingprojects.auth0.com/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer.
  audience: 'https://mikebuildingprojects.auth0.com/api/v2/',
  // issuer: `https://mikebuildingprojects.auth0.com`,
  algorithms: ['RS256']
});

app.get('/', checkJwt, (req, res) => {
  return res.json({
    "X-Hasura-User-Id": req.user.sub,
    "X-Hasura-Role": "user",
    "X-Hasura-Is-Owner": "true",
    "X-Hasura-Custom": "custom value"
  });
})

app.listen(PORT, () => {
  console.log("Server Running at port " + PORT);
});
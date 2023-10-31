const express = require('express');
const session = require('express-session');
const Keycloak = require('keycloak-connect');
const https = require('https');
const fs = require('fs');
const tls = require('tls');


if(!process.env.NODE_EXTRA_CA_CERTS) return;


const list = (process.env.NODE_EXTRA_CA_CERTS || '').split(',');
const additionalCerts = list.map(extraCert => fs.readFileSync(extraCert, 'utf8'));

let memoryStore = new session.MemoryStore();
let keycloak = new Keycloak({ store: memoryStore });

let app = express();

app.use(session({
  secret: 'sdfjk234232jJKDJFjdsfjd233',
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}));

app.use(keycloak.middleware());

app.get('/protected', keycloak.protect(), (req, res) => {
  res.send("This is a protected route!");
  console.log("User has accessed a protected resource!");

  
});

const httpsOptions = {
  key: fs.readFileSync('../x509/localhost.key'),
  cert: fs.readFileSync('../x509/localhost.crt'),

  ca: [fs.readFileSync('../x509/BAH-Root-CA.cer')]
};


https.createServer(httpsOptions, app).listen(3000, () => {
  console.log('Server started at https://localhost:3000/');
});

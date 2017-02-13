//Import node module
import express from 'express';
import config from './config';
//import accessToken from './accessToken';
const foursquare = require('node-foursquare')(config);

const web = express.Router();

web.get('/', (req, res) => {
    const token = req.query.token;
    const data = {
        token: token,
        data: null
    };
    res.render('home', { data: data });
});

web.get('/auth', (req, res) => {
    res.writeHead(303, { 'location': foursquare.getAuthClientRedirectUrl() });
    res.end();
});

web.get('/auth/callback', (req, res) => {
    foursquare.getAccessToken({
        code: req.query.code
    }, (error, token) => {
        if(error) {
            res.send(`An error was thrown: ${error.message}`);
        } else {
            // save token disni
            res.redirect(`/?token=${token}`);
        }
     });
});

// Exporting an object as the default import for this module
export default web;

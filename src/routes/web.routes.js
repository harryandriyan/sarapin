import express from 'express';
import config from './config';
const foursquare = require('node-foursquare')(config);

const web = express.Router();

web.get('/', (req, res) => {
    res.render('home', { data: null });
});

web.get('/explore', (req, res) => {
    const ll = req.query.ll;
    const q = req.query.q;

    Date.prototype.yyyymmdd = function() {
        const mm = this.getMonth() + 1;
        const dd = this.getDate();
        return [this.getFullYear(),
            (mm>9 ? '' : '0') + mm,
            (dd>9 ? '' : '0') + dd
        ].join('');
     };

    const date = new Date();
    const version = date.yyyymmdd();

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
            res.redirect(`/?token=${token}`);
        }
     });
});

web.get('/logout', (req, res) => {
    res.writeHead(303, { 'location': foursquare.getAuthClientRedirectUrl() });
    res.end();
});

export default web;

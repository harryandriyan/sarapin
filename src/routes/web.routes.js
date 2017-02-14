import express from 'express';
import config from './config';
const foursquare = require('node-foursquare')(config);
import Req from 'superagent';

const web = express.Router();

web.get('/', (req, res) => {
    res.render('home', { data: null });
});

web.get('/explore', (req, res) => {
    const ll = req.query.ll;
    const q = `Sarapan ${req.query.q}`;

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

    Req
        .get('https://api.foursquare.com/v2/venues/search')
        .query({
            ll: ll,
            q: q,
            v: version,
            client_id: config.secrets.clientId,
            client_secret: config.secrets.clientSecret,
        })
        .set('Accept', 'application/json')
        .end(function (error, result) {
            const response = JSON.parse(result.text);
            if (response.meta.code === 200) {
                res.render('explore', { data: response.response.venues });
            } else {
                res.render('error');
            }
        });
});

web.get('/venue/:venueId', (req, res) => {
    const venueId = req.params.venueId;

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

    Req
        .get(`https://api.foursquare.com/v2/venues/${venueId}`)
        .query({
            v: version,
            client_id: config.secrets.clientId,
            client_secret: config.secrets.clientSecret,
        })
        .set('Accept', 'application/json')
        .end(function (error, result) {
            const response = JSON.parse(result.text);
            if (response.meta.code === 200) {
                res.render('venue', { data: response.response.venue });
            } else {
                res.render('error');
            }
        });
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

import 'zone.js/dist/zone-node';
import { enableProdMode } from '@angular/core';
// Express Engine
import { ngExpressEngine } from '@nguniversal/express-engine';
// Import module map for lazy loading
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';

import * as express from 'express';
import { join } from 'path';

require('dotenv').config();

const PORT = process.env.PORT || 8080;
const DIST_FOLDER = join(process.cwd(), 'dist/browser');

const domino = require('domino');
const fs = require('fs');
const path = require('path');

const template = fs.readFileSync(path.join(DIST_FOLDER, 'index.html')).toString();
// for mock global window by domino
const win = domino.createWindow(template);
// mock
global['window'] = win;
// not implemented property and functions
Object.defineProperty(win.document.body.style, 'transform', {
  value: () => {
    return {
      enumerable: true,
      configurable: true,
    };
  },
});

// mock documnet
global['document'] = win.document;
// othres mock
global['CSS'] = null;
// global['XMLHttpRequest'] = require('xmlhttprequest').XMLHttpRequest;
global['Prism'] = null;

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// Express server
export const app = express();

var bodyParser = require('body-parser');
const axios = require('axios');

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('./dist/server/main');

app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));

// Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP)
  ]
}));

app.set('view engine', 'html');
app.set('views', DIST_FOLDER);

app.get('/api/v1/video', async (req, res) => {
  await axios.get(`${process.env.API_V1}${req.originalUrl.toString()}`, {
    headers: {
      Authorization: process.env.TOKEN
    }
  }).then(function (response) {
    if (response.data.next) {
      response.data.next = response.data.next.replace(`${process.env.API_V1}`, '');
    }
    if (response.data.previous) {
      response.data.previous = response.data.previous.replace(`${process.env.API_V1}`, '');
    }
    res.status(response.status).send(response.data);
  }).catch(function (error) {
    res.status(error.status).send(error.data);
  });
});

app.post('/api/v1/upload', async (req, res) => {
  await axios.post(`${process.env.API_V1}${req.originalUrl.toString()}`, req.body, {
    headers: {
      Authorization: process.env.TOKEN
    }
  }).then(function (response) {
    res.status(response.status).send(response.data);
  }).catch(function (error) {
    res.status(error.status).send(error.data);
  });
})

// Example Express Rest API endpoints
// app.get('/api/**', (req, res) => { });
// Serve static files from /browser
app.get('*.*', express.static(DIST_FOLDER, {
  maxAge: '1y'
}));

// All regular routes use the Universal engine
app.get('*', (req, res) => {
  res.render('index', { req });
});


const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('../routes/v1');

const app = express();

// request logging
app.use(morgan());

// parse body params
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// gzip compression
app.use(compress());

// use HTTP such as PUT or DELETE
app.use(methodOverride());

// secure apps by HTTP headers
app.use(helmet());

// enable cors
app.use(cors());

// api v1 routes
app.use('/v1', routes);

module.exports = app;

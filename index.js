

global.dir = __dirname;
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const log4js = require('log4js');

const logger = log4js.getLogger();
require('dotenv').config();

logger.level = process.env.LOG_LEVEL;
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const routes = require('./config/route');

routes(app);
app.set('port', process.env.PORT);
app.listen(process.env.PORT, () => {
    logger.debug(`Test Nodejs : Server listening on port ${process.env.PORT} successfully`);
});


module.exports = app;

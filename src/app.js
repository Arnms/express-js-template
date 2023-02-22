const { port, env } = require('./config/vars');
const app = require('./config/express');
const logger = require('./config/logger');

app.listen(port, () => logger.info(`server started on port ${port} (${env})`));

module.exports = app;

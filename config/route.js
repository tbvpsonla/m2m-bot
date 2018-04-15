

const bodyParser = require('body-parser');
const broadcast = require('../lib/api/broadcast');
const database = require('../lib/api/database');
// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false });
module.exports = (app) => {
    app.route('/rest/v1/broadcast')
        .post(broadcast.sendBroadCast);
    app.route('/rest/v1/subscribe')
        .post(database.information);
};

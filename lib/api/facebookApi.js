const request = require('request');

const constant = require('../../config/constant');
const log4js = require('log4js');
const async = require('async');

const logger = log4js.getLogger();
logger.level = process.env.LOG_LEVEL;
const sendFBMessage = (sender, messageData) => new Promise((resolve, reject) => {
    request({
        url: constant.FB_MESSAGE_URL,
        qs: { access_token: process.env.FB_PAGE_ACCESS_TOKEN },
        method: 'POST',
        json: {
            recipient: { id: sender },
            message: messageData
        }
    }, (error, response) => {
        if (error) {
            logger.debug('Error sending message: ', error);
            reject(error);
        } else if (response.body.error) {
            logger.debug('Error: ', response.body.error);
            reject(new Error(response.body.error));
        }
        resolve();
    });
});

exports.sendToFacebook = (sender, facebookResponseData) => {
    if (!Array.isArray(facebookResponseData)) {
        logger.debug('Response as formatted message');
        sendFBMessage(sender, facebookResponseData)
            .catch(err => logger.debug(err));
    } else {
        async.eachSeries(facebookResponseData, (facebookMessage, callback) => {
            logger.debug('Response as formatted message');
            sendFBMessage(sender, facebookMessage)
                .then(() => callback())
                .catch(err => callback(err));
        }, (err) => {
            if (err) {
                logger.debug(err);
            } else {
                logger.debug('Data response completed');
            }
        });
    }
};


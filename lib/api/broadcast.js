const dbConnect = require('../../db/dbConnect');
const request = require('request');
const reload = require('require-reload')(require);
const constant = require('../../config/constant');
const fbTemplate = require('../template/botBuilderTemplate');
const facebookApi = require('./facebookApi');
const log4js = require('log4js');

const logger = log4js.getLogger();
logger.level = process.env.LOG_LEVEL;
// https://developers.facebook.com/docs/graph-api/reference/v2.12/page/feed
const postToFanpage = (content) => {

    var message = {
        "message" : `M2M-FxSignals \n We've just closed a winning trade with a profit of ${content.profit} pips. \n Product: ${content.product} \n * Open Price @ ${content.open} \n * Take Profit @ ${content.tp3} \n * Analyzed Chart: ${content.evidence_link} \n \n Get more details about our signals, download it here: ${content.app_link}`
    }
    const urlGraph = `https://graph.facebook.com/v2.11/${process.env.PAGE_ID}/feed`;
    return new Promise((resolve, reject) => {
        request(
            {
                method: 'POST',
                uri: urlGraph,
                qs: {
                    access_token: process.env.FB_PAGE_ACCESS_TOKEN
                },
                json: message
            },
            (error, response) => {
                if (error) {
                    console.log("Error post to fanpage: " + error);
                    reject(error);
                } else {
                    console.log("Successfully post to fanpage: " + JSON.stringify(response.body));
                    resolve(response.body);
                }
            }
        );
    });
};

const getlinkPost = (postId) => {
    const urlGraph = `https://graph.facebook.com/v2.11/${postId}?fields=permalink_url&access_token=${process.env.FB_PAGE_ACCESS_TOKEN}`;
    return new Promise((resolve, reject) => {
        request(
            {
                method: 'GET',
                uri: urlGraph
            },
            (error, response) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(response.body);
                }
            }
        );
    });
};

const sendFBMessage = (senderId, link) => {
    const broadcastApi = `https://api.chatfuel.com/bots/${process.env.BOT_ID}/users/${senderId}/send?chatfuel_token=${process.env.BROADCAST_TOKEN}&chatfuel_block_name=Notification`;
    return new Promise((resolve, reject) => {
        request(
            {
                method: 'POST',
                uri: broadcastApi,
                qs: {
                    link: `${link}`
                }
            },
            (error, response) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(response.body);
                }
            }
        );
    });
}

const sendBroadCast = (req, res) => {
    const body = req.body;
    if (body) {
        console.log("Before post");
        postToFanpage(body)
            .then((json) => {
                console.log("After post" + json.id);
                if (json.id) {
                    getlinkPost(json.id)
                        .then((jsonBody) => {
                            const permalinkUrl = JSON.parse(jsonBody).permalink_url;
                            if (permalinkUrl) {
                                const customer = reload('../../config/db/customer.json');
                                dbConnect.find(customer).then((result) => {
                                    if (result && result.length > 0) {
                                        for (let i = 0; i < result.length; i++) {
                                            const senderId = result[i][constant.SENDER_ID];
                                            if (senderId) {
                                                sendFBMessage(senderId, permalinkUrl);
                                            }
                                        }
                                        res.send({});
                                    } else {
                                        res.send({});
                                    }
                                });
                            } else {
                                res.send({});
                            }
                        })
                        .catch((err) => {
                            logger.debug(err);
                            res.send({});
                        });
                }
            })
            .catch((err) => {
                logger.debug(err);
                res.sendStatus(200);
            });
    }
     // else {
    //     res.sendStatus(200);
    // }
};

module.exports.sendBroadCast = sendBroadCast;

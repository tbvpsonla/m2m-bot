const dbConnect = require('../../db/dbConnect');
const reload = require('require-reload')(require);
const constant = require('../../config/constant');

const information = (req, res) => {
    const senderId = req.body["senderId"]
    console.log("senderId: " + senderId);
    if (senderId) {
        const customer = reload('../../config/db/customer.json');
        customer.condition[constant.SENDER_ID] = senderId;
        customer.data[constant.SENDER_ID] = senderId;
        dbConnect.findOneAndUpdate(customer)
            .then(() => {
                var result = {
                  "redirect_to_blocks": ["Subscribe Finish"]
                }
                res.send(result);
            });
    }
};
module.exports.information = information;

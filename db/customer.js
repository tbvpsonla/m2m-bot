const mongoose = require('mongoose');
const _ = require('lodash');

const customerJson = {
    collection_name: 'customer',
    data:
  {
      senderId: 'String',
      subscribe: 'String'
  }
};

const typeMappings =
{
    String,
    Number,
    Boolean
};

function makeSchema() {
    const outputSchema = {};
    _.forEach(customerJson.data, (value, key) => {
        if (typeMappings[value]) {
            outputSchema[key] = typeMappings[value];
        } else {
            console.error('invalid type specified:', value);
        }
    });
    const Customer = mongoose.model(customerJson.collection_name, new mongoose.Schema(outputSchema));
    module.exports.Customer = Customer;
}
module.exports.makeSchema = makeSchema;

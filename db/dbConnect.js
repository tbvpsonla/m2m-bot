
const mongoose = require('mongoose');
const constant = require('../config/constant');
const _ = require('lodash');

mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://m2m-bot:m2m-bot@ds261828.mlab.com:61828/heroku_2g9kgcmm`);
const db = mongoose.connection;
const customer = require('./customer.js');

db.on('error', console.error);
db.once('open', () => {
    customer.makeSchema();
});

exports.insert = json => new Promise((resolve, reject) => {
    const schema = mongoose.model(json.collection_name).schema;
    const model = new (mongoose.model(json.collection_name, schema))();
    _.forEach(json.data, (value, key) => {
        model[key] = value;
    });
    model.save((err) => {
        if (err) reject(err);
        resolve();
    });
});

exports.findOneAndUpdate = json => new Promise((resolve, reject) => {
    const model = mongoose.model(json.collection_name);
    model.findOneAndUpdate(json.condition, { $set: json.data }, { upsert: true }, (err) => {
        if (err) {
            console.log(err);
            reject(err);
        }
        resolve();
    });
});

exports.findOneAndUpdatePromise = json => new Promise((resolve, reject) => {
    const model = mongoose.model(json.collection_name);
    model.findOneAndUpdate(json.condition, { $set: json.data }, { upsert: true }, (err) => {
        if (err) reject(err);
    });
});

exports.update = json => new Promise((resolve, reject) => {
    const model = mongoose.model(json.collection_name);
    model.update(json.condition, { $set: json.data }, (err) => {
        if (err) reject(err);
        resolve();
    });
});

exports.find = json => new Promise((resolve, reject) => {
    const model = mongoose.model(json.collection_name);
    model.find(json.condition).lean().exec((err, result) => {
        if (err) reject(err);
        resolve(result);
    });
});

exports.remove = json => new Promise((resolve, reject) => {
    const model = mongoose.model(json.collection_name);
    model.remove(json.condition, (err) => {
        if (err) reject(err);
        resolve();
    });
});

module.exports.mongoose = mongoose;

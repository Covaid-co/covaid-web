const mongoose = require('mongoose');

function connect() {
    // Set up mongoose connection
    let dev_db_url = 'mongodb+srv://debanik:Corona2020@coronacluster-9wiub.mongodb.net/DatabaseRedesign?retryWrites=true&w=majority';
    let mongoDB = process.env.MONGODB_URI || dev_db_url;
    return new Promise((resolve, reject) => {
        if (process.env.NODE_ENV === 'test') {
            const Mockgoose = require('mockgoose').Mockgoose;
            const mockgoose = new Mockgoose(mongoose);
            mockgoose.prepareStorage()
                .then(() => {
                    mongoose.connect(mongoDB, 
                        { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
                    .then((res, err) => {
                        if (err) return reject(err);
                        resolve();
                    })
                })
        } else {
            mongoose.connect(mongoDB, 
                { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
            .then((res, err) => {
                if (err) return reject(err);
                resolve();
            })
        }
    });
}

function close() {
    return mongoose.disconnect();
}

module.exports = {connect, close};
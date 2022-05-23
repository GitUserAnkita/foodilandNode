const mongooes = require("mongoose");
const URL = process.env.MONGO_URL;
const db = async () => {
    await mongooes.connect(URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log("db connect successfully ...");

};
module.exports = db;

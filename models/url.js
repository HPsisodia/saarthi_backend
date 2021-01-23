const mongoose = require('mongoose');
const schema = mongoose.Schema;

const URLSchema = new schema({
    url: {
        type: String,
    },
    url_content: {
        type: String,
    }
},{timestamps: true});


const URLModel = mongoose.model("url", URLSchema);

module.exports = URLModel;
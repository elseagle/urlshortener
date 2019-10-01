const mongoose = require('mongoose');
const Counter = require("./Counter")

// URL Collection Schema
var urlSchema = new mongoose.Schema({
    _id: {type: String,},
    url: '',
    created_at: '',

});

// URL Schema pre-save step
//
// This is run BEFORE a new document is persisted in the URL collection. All
// we are doing here is incrementing the Counter in the Counter collection which
// then becomes the unique ID for the new document to be inserted in the URL
// collection
urlSchema.pre('save', function(next) {
    console.log('APP: Running pre-save');
    let that = this;
    Counter.findByIdAndUpdate({ _id: 'url_count'}, { $inc: { count: 1 } }, {useFindAndModify: false},(err, counter) => {
        if(err) {
            console.error('APP: Error while finding and updating counter value');
            return next(err)
        };
        that._id = Counter.count;
        that.created_at = new Date();
        next();
    });
});

const Url= mongoose.model('url', urlSchema);
module.exports = Url;

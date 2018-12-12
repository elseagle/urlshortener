const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// URL Collection Schema
var urlSchema = new mongoose.Schema({
    _id: {type: Number, ref: "User"},
    url: '',
    created_at: '',

});

// URL Schema pre-save step
//
// This is run BEFORE a new document is persisted in the URL collection. All
// we are doing here is incrementing the counter in the Counter collection which
// then becomes the unique ID for the new document to be inserted in the URL
// collection
urlSchema.pre('save', function(next) {
    console.log('APP: Running pre-save');
    var that = this;
    Counter.findByIdAndUpdate({ _id: 'url_count' }, { $inc: { count: 1 } }, function(err, counter) {
        if(err) {
            console.error('APP: Error while finding and updating counter value');
            return next(err)
        };
        that._id = counter.count;
        that.created_at = new Date();
        next();
    });
});

module.exports = mongoose.model('URL', urlSchema);
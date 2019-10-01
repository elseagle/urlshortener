//Models Import

const URL = require('../models/Url');
const express = require("express")
const router = express.Router();
const base32 = require("base-32").default;


router.get('/', function(req, res){
    res.render('index')})

router.post('/', (req, res) =>{
    res.direct('/shorten')
})


// API for redirection
router.get('/:hash', async (req, res) => {
    var baseid = req.params.hash;
    if(baseid) {
        console.log('APP: Hash received: ' + baseid);
        var id =  await base32.decode(baseid);
        console.log('APP: Decoding Hash: ' + baseid);
        URL.findOne({ _id: id }, function(err, doc) {
            if(doc) {
                console.log('APP: Found ID in DB, redirecting to URL');
                res.redirect(doc.url);
            } else {
                console.log('APP: Could not find ID in DB, redirecting to home');
                res.redirect('/');
            }
        });
    }
});


// API for shortening
router.post('/shorten', (req, res, next) => {
    var urlData = req.body.url;
    URL.findOne({url: urlData}, (err, doc) => {
        if(doc) {
          console.log('APP: URL found in DB');
          res.send({
            url: urlData,
            hash: base32.encode(doc._id),
            status: 200,
            statusTxt: 'OK',
            });
        } else {
            console.log('APP: URL not found in DB, creating new document');
            var url = new URL({
                url: urlData
            });
            url.save(err => {
                if(err) {
                    return console.error(err);
                }
                res.send({
                    url: urlData,
                    hash: base32.encode(url._id),
                    status: 200,
                    statusTxt: 'OK'
                });
            });
        }
    });
});


module.exports = router;

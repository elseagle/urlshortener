//Models Import

const URL = require('../models/Url');
const express = require("express")

const router = express.Router();
// const bcrypt = require('bcryptjs');
// // const btoa = require('btoa');
// // const atob = require('atob');
base32 = require("base-32").default;
// const Buffer = require("buffer");


router.get('/', function(req, res){
    res.render('index')})

router.post('/', (req, res) =>{
    res.direct('/shorten')
})

    
// API for redirection
router.get('/:hash', function(req, res) {
    // var URL = new Url();
    var baseid = req.params.hash;
    if(baseid) {
        console.log('APP: Hash received: ' + baseid);
        var id = console.log(base32.decode(baseid));
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
router.post('/shorten', function(req, res, next) {
    // var URL = new Url();
    var urlData = req.body.url;
    // console.log(URL, urlData, Url())
    URL.findOne({url: urlData}, function(err, doc) {
        if(doc) {
            console.log('APP: URL found in DB');
            res.send({
                url: urlData,
                hash: base32.encode(doc._id),
                //Buffer.from("encoded","base64" ).toString(doc._id),
                status: 200,
                statusTxt: 'OK'
            });
        } else {
            console.log('APP: URL not found in DB, creating new document');
            var url = new URL({
                url: urlData
            });
            url.save(function(err) {
                if(err) {
                    return console.error(err);
                }
                res.send({
                    url: urlData,
                    hash: base32.encode(url._id),
                    //Buffer.from("encoded","base64" ).toString(url._id),
                    status: 200,
                    statusTxt: 'OK'
                });
            });
        }
    });
});


module.exports = router;
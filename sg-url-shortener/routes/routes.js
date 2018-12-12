//Models Import
const User = require('../models/User');
const Token = require('../models/Token');
const URL = require('../models/Url');
const express = require("express")

const router = express.Router();
const bcrypt = require('bcryptjs');
const btoa = require('btoa');
const atob = require('atob');



router.get('/', function(req, res){
    res.render('index')})

router.post('/', (req, res) =>{
    res.direct('/shorten')
})



    
// API for redirection
router.get('/hash/:hash', function(req, res) {
    // var URL = new Url();
    var baseid = req.params.hash;
    if(baseid) {
        console.log('APP: Hash received: ' + baseid);
        var id = atob(baseid);
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
                hash: btoa(doc._id),
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
                    hash: btoa(url._id),
                    status: 200,
                    statusTxt: 'OK'
                });
            });
        }
    });
});

router.get('/registration', (req, res)=>{

    res.render("registration");
})



router.post('/registration', (req, res)=> {
    const newUser = new User();
    newUser.email = req.body.email;
    newUser.password = req.body.password;

    Token.findOne({ email : req.body.email }, function (err, user) {
        if (!user) {

            bcrypt.genSalt(10, (err, salt) => {
                if (err) throw err;
                bcrypt.hash(newUser.password, salt, ( hash) => {
                    // if (err) throw err;
                    newUser.password = hash;
                    newUser.save(err, userSaved => {
                        if(err) throw err;
                        console.log(userSaved);
                        res.send("USER SAVED");
                        let token = new Token({_userId: newUser._id, token: crypto.randomBytes(16).toString('hex')});
            
                        console.log('token created: ' + token.token);
                        token.save(function (err) {
                            console.log("Token saved")
                            });
                       
                        });
                    })
                })
            

        }
        else{
            res.send("This user exists")
        }
})
})

router.get("/login", (req, res)=>{
    res.render("login")
})

router.post('/login', (req, res)=> {
    User.findOne({email: req.body.email}).then(user => {
        if (user) {
            bcrypt.compare(req.body.password, user.password, (err, matched) => {
                if (err) return err;
                else if (!user.isVerified) return res.status(401).send({
                    type: 'not-verified',
                    msg: 'Your account has not been verified.'
                });

                // Login successful, write token, and send back user

                if (matched) {
                    
                    // let session_token = crypto.randomBytes(16).toString('hex');
                    
                    res.redirect("/");
                }
                else {
                    res.send('Not able to Login')
                }
            })
        }
    })
});


module.exports = router;
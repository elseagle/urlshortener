
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({

        email:{
             type: String,
            unique: true,
            trim: true,
            minlength: 10,
            required: true

        },

        fullName:{
            type: String,
            minlength: 2,
            trim: true,
            required: true,

        },

        password:{
            type: String,
            required: true,
            minlength: 6

        },

    phone:{
            type: Number,
            required: true,
            minlength: 11,
            unique: true
    },
    date_added:{
            type: Date,
            default: Date.now
    },
    last_login:{
            type: Date,
            default: Date.now
    },

    isVerified:{
            type: Boolean,
            default: false
    }
})

module.exports = mongoose.model('users', UserSchema);

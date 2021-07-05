const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
//        required: true,
    },
    email: {
        type: String,
//        required: true,
        unique: true
    },
    images: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Image"
    }],
    admin: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

module.exports = User;
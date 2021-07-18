const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    elo: {
        type: Number,
        min: 0,
        max: 3000,
        default: 1000
    },
    img:
    {
        data: Buffer,
        contentType: String
    }
}, {
    timestamps: true
});

const Image = mongoose.model("Image", imageSchema);

module.exports = Image;
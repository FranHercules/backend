const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = Schema({
    Id: {
        type: Number,
        //unique:true
    },
    Subject: String,
    Description: String,
    StartTime: {
        type: String
    },
    EndTime: {
        type: String
    },
    RoomId: Number
}, {
    timestamps: true
});

module.exports = mongoose.model("User", UserSchema);


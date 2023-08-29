const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    notificationType: String, //sms,email,notification
    users: [{
        type: Schema.Types.ObjectId,
        ref: "user",
    }],
    message: String,
    title: String,
    CreatedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("notification", notificationSchema);

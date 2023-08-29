const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const querySchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "user",
    },
    query: String,
    reply: String,
    CreatedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("query", querySchema);

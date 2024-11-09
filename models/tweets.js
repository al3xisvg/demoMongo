const mongoose = require("mongoose");
const tweetsSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  user_id: {
    type: Number,
    required: true,
  },
  user_name: {
    type: String,
    required: true,
  },

  retweeted: {
    type: Boolean,
    required: true,
  },
});
module.exports = mongoose.model("tweets", tweetsSchema);

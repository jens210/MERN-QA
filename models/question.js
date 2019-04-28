var mongoose = require("mongoose");

let answerSchema = new mongoose.Schema({
    answer: String,
    votes: Number
});

let questionSchema = new mongoose.Schema({
    title: String,
    description: String,
    answers: [answerSchema]
});

module.exports = mongoose.model('Question', questionSchema);
/**** External libraries ****/
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

/**** Configuration ****/
const port = (process.env.PORT || 8080);
const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../build')));
/****** Configuration *****/

// Additional headers to avoid triggering CORS security errors in the browser
// Read more: https://en.wikipedia.org/wiki/Cross-origin_resource_sharing
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");

    // intercepts OPTIONS method
    if ('OPTIONS' === req.method) {
        // respond with 200
        console.log("Allowing OPTIONS");
        res.sendStatus(200);
    } else {
        // move on
        next();
    }
});

/****** Mongoose *****/
const mongoose = require('mongoose');
let dbUrl = process.env.mongoUrl;
//Schema = mongoose.Schema
mongoose.connect(`${dbUrl}`, { useNewUrlParser: true });

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("DB connection is open.");
});

let Question = require("../models/question.js")

/****** Routes *****/
// GET
app.get('/api/questions/', (req, res) => {
    Question.find({}, (err, questions) => {
        res.json(questions);
    }).sort({ title: 1 })
});

app.get('/api/questions/:id', (req, res) => {
    Question.findOne({ _id: req.params.id }, (err, questions) => {
        res.json(questions);
    })
});

// POST
// Post question
app.post('/api/questions', (req, res) => {
    let newQuestion = new Question({
        title: req.body.title,
        description: req.body.description

    });
    if (!newQuestion.title || !newQuestion.description || !newQuestion.answers) {
        return res.status(400).json({ msg: 'Information missing' });
    }

    newQuestion
        .save()
        .then(result => res.json({ msg: `Question posted: ${req.body.title}` }))
        .catch(err => console.log(err));
});


// Post
// Pushing new answer to answers on existing question
app.post('/api/questions/:id', (req, res) => {
    Question.findOneAndUpdate({ _id: req.params.id },
        { $push: { answers: { $each: [{ answer: req.body.answer, votes: 0 }] } } }, { upsert: true })

        .then(function (question) { res.send(question) })
        .then(console.log(`Question ${req.body.title} was updated`))
        .catch(err => console.log(err))
});

// PUT  
// Upvotes or downvotes depending on req.body.num value
app.put('/api/questions/:id', (req, res) => {
    Question.findOneAndUpdate({ "answers._id": req.body._id },
        { $inc: { "answers.$.votes": req.body.num } })

        .then(function (question) { res.send(question) })
        .then(console.log(`Question ${req.body.title} was updated`))
        .catch(err => console.log(err))
});

app.listen(port, () => console.log(`QA API running on port ${port}!`));


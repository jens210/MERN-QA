const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

const dbUrl = 'mongodb://localhost/test'; // change me
Schema = mongoose.Schema
mongoose.connect(`${dbUrl}`, { useNewUrlParser: true });

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("DB connection is open.");
});

let answerSchema = new mongoose.Schema({
    answer: String,
    votes: Number
});

let questionSchema = new mongoose.Schema({
    title: String,
    description: String,
    answers: [answerSchema]
});

let Question = mongoose.model('Question', questionSchema);
let Answer = mongoose.model("Answer", answerSchema);
/*
let questionSchema = new mongoose.Schema({
    title: String,
    description: String,
    answers: [
        {
            answer: String,
            votes: Number
        }
    ]
});
*/


const port = (process.env.PORT || 8080);

/****** Routes *****/
// GET
app.get('/questions/', (req, res) => {
    Question.find({}, (err, questions) => {
        res.json(questions);
    }).sort({ title: 1 })
});

app.get('/questions/:id', (req, res) => {
    Question.find({ _id: req.params.id }, (err, questions) => {
        res.json(questions);
    })
});

// POST
app.post('/questions', (req, res) => {
    let answer = new Answer()
    let newQuestion = new Question({
        title: req.body.title,
        description: req.body.description,

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
app.post('/questions/:id', (req, res) => {
    Question.findOneAndUpdate({ _id: req.params.id },
        // let answer = new Answer();
        { $push: { answers: { $each: [{ answer: req.body.answer, votes: 0 }] } } }, { upsert: true })
        //  Question.answers.push(answer); use this maybe?
        .then(function (question) { res.send(question) })
        .then(console.log(`Question ${req.body.title} was updated`))
        .catch(err => console.log(err))
});

// PUT
// upvotes or downvotes depending on req.body.num
app.put('/questions/:id', (req, res) => {
    Question.findOneAndUpdate({ "answers._id": req.body._id }, 
        { $inc: { "answers.$.votes": req.body.num } }
    )
        .then(function (question) { res.send(question) })
        .then(console.log(`Question ${req.body.title} was updated`))
        .catch(err => console.log(err))
});

app.listen(port, () => console.log(`Cooking API running on port ${port}!`));


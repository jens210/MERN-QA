import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import QuestionList from "./QuestionList";
import Question from "./Question";
import AddQuestion from "./AddQuestion";
import NotFound from "./NotFound";

class App extends Component {
    API_URL = process.env.apiUrl;

    constructor(props) {
        super(props);

        this.state = {
            questions: [],
            isLoading: true
        }
        this.addQuestion = this.addQuestion.bind(this);
        this.postAnswer = this.postAnswer.bind(this);
        this.onChange = this.onChange.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.vote = this.vote.bind(this);
    }

    componentDidMount() {
        console.log("App component has mounted");
        this.getData();
    }

    getData() {
        fetch(`${this.API_URL}/questions`)
            .then(response => response.json())
            .then(questions => this.setState({ questions: questions, isLoading: false }))
    }

    addQuestion(title, description) {
        // Posting JSON to API
        fetch(`${this.API_URL}/questions`, {
            method: 'POST',
            body: JSON.stringify({
                title: title,
                description: description
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then(response => response.json())
            .then(json => {
                console.log("Result of posting a new question:");
                console.log(json);
            });
    }

    // send new answers to questions
    postAnswer(answer) {
        // getting everything after last /
        let urlID = window.location.href.split("/").pop();
        // Put JSON to API
        fetch(`${this.API_URL}/questions/${urlID}`, {
            method: 'POST',
            body: JSON.stringify({
                answer: answer
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then(response => response.json())
            .then(json => {
                console.log("Result of posting an answer to a question:");
                console.log(json);
            });
    }

    // Upvote/downvote sends answers._id and num
    vote(a_id, num) {
        // getting everything after last /
        let urlID = window.location.href.split("/").pop();
        // Put JSON to API
        fetch(`${this.API_URL}/questions/${urlID}`, {
            method: 'PUT',
            body: JSON.stringify({
                _id: a_id,
                num: num
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then(response => response.json())
            .then(json => {
                console.log("Voting happend:");
                console.log(json);
            });
    }

    onChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleInput(event) {
        event.preventDefault();
        this.addQuestion(
            this.state.title,
            this.state.description
        );
    }
    getQuestionFromId(id) {
        return this.state.questions.find((elm) => elm._id === id);
    }

    render(){
        if (this.state.isLoading){
            return <div>Loading...</div>
        }     
     
        return (
            <Router>
                <div className="container">
                    <h1>Questions and answers</h1>
                    <Link to='/'>Home</Link>
                    <Switch>
                        <Route exact path={'/'}
                            render={(props) =>
                                <QuestionList {...props}
                                    questions={this.state.questions}
                                    header={'All questions'} />}
                        />

                        <Route exact path={'/questions/add'}
                            render={(props) => <AddQuestion {...props}
                                addQuestion={this.addQuestion}
                                onChange={this.onChange}
                                handleInput={this.handleInput}
                            />}
                        />

                        <Route exact path={'/questions/:id'}
                            render={(props) => <Question {...props}
                                question={this.getQuestionFromId(props.match.params.id)}
                                postAnswer={this.postAnswer}
                                vote={this.vote}
                            />}
                        />
                        <Route component={NotFound} />
                    </Switch>

                </div>
            </Router>
        );
    }
}

export default App;

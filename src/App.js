import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
//import UpdateAnswer from "./UpdateAnswer.js"
import QuestionList from "./QuestionList";
import Question from "./Question";
import AddQuestion from "./AddQuestion";
import NotFound from "./NotFound";

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            questions: []
        }
        this.addQuestion = this.addQuestion.bind(this);
        this.onChange = this.onChange.bind(this);
        this.handleInput = this.handleInput.bind(this);
    }

    componentDidMount() {
        console.log("App component has mounted");
        this.getData();
    }

    getData() {
        fetch('http://localhost:8080/questions')
            .then(response => response.json())
            .then(questions => this.setState({ questions: questions }))
    }

    addQuestion(title, description) {
        // Posting JSON to API
        //  fetch(`${this.API_URL}/questions`, {
        fetch('http://localhost:8080/questions', {
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

    render() {
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
                                addData={this.addQuestion}
                                onChange={this.onChange}
                                handleInput={this.handleInput}
                            />}
                        />

                        <Route exact path={'/questions/:id'}
                            render={(props) => <Question {...props}
                                question={this.getQuestionFromId(props.match.params.id)} />}
                        />

                        <Route component={NotFound} />
                    </Switch>

                </div>
            </Router>
        );
    }
}

export default App;

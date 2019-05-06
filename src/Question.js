import React, { Component } from 'react';
import PostAnswer from "./PostAnswer.js"

class Question extends Component {
    API_URL = process.env.REACT_APP_API_URL;
    constructor(props) {
        super(props);
        this.state = {
            questions: [],
            question: "" // maybe?
        };
    }

    render() {
        let question = this.props.question;
        let list = [];

        if (question !== undefined) {
        list = question.answers.map((a) => <div key={a._id}>


            <li className="list-group-item">
                <button className="btn btn-default" onClick={() => { this.props.vote(a._id, 1) }}>
                    <i className="fas fa-chevron-up"></i>
                </button>
                <span>{`${a.votes}`}</span>
                <button className="btn btn-default" onClick={() => { this.props.vote(a._id, -1) }}>
                    <i className="fas fa-chevron-down"></i>
                </button>
                <span>{`${a.answer} `}</span>
            </li>

        </div>)
        }
        return (
            <div>
                <h3>{question.title}</h3>
                <p>{question.description}</p>
                Answers:
                    {list}
                <PostAnswer postAnswer={this.props.postAnswer} />
            </div>
        );
    }
}

export default Question;

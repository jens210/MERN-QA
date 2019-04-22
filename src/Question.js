import React, { Component } from 'react';
import UpdateAnswer from "./UpdateAnswer.js"

class Question extends Component {
    API_URL = process.env.REACT_APP_API_URL;
    constructor(props) {
        super(props);
        this.state = {
            questions: []
        };
    }

    // new answers to questions could be used for votes changeing 
    updateAnswer(answer) {
        // getting everything after last /
        let urlID = window.location.href.split("/").pop();
        // Put JSON to API
        fetch('http://localhost:8080/questions/' + urlID, {
            method: 'PUT',
            body: JSON.stringify({
                answer: answer
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then(response => response.json())
            .then(json => {
                console.log("Result of putting an answer to a question:");
                console.log(json);
            });
    }

    render() {
        let question = this.props.question;
        let list = [];
        list = question.answers.map((a) => <div key={a._id}>
            <li className="list-group-item">
                <button className="btn btn-default"> <i className="fas fa-chevron-up"></i></button>
                <span>{`${a.votes}`}</span>
                <button className="btn btn-default"> <i className="fas fa-chevron-down"></i></button>
                <span>{`${a.answer} `}</span>
            </li>

        </div>)
        return (
            <div>
                <h3>{question.title}</h3>
                <p>{question.description}</p>
                Answers:
                    {list}
                <UpdateAnswer updateAnswer={this.updateAnswer} />
            </div>
        );
    }
}

export default Question;

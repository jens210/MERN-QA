import React, {Component} from 'react';
import { Link } from "react-router-dom";


class QuestionList extends Component {

    render() {
        let list = [];

        this.props.questions.forEach((elm) => {
            list.push(<div key={elm._id}>
                <Link className="link" to={`/questions/${elm._id}`}>{elm.title}</Link>
            </div>)
        });

        return (
            <div>
                <h3 className="header text">{this.props.header}</h3>
               
                    {list}

                <Link className="btn btn-primary" id="add" to={'/questions/add'}>Add Question</Link>
            </div>
        );
    }
}

export default QuestionList;

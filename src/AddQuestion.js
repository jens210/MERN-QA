import React, { Component } from 'react';

class AddQuestion extends Component {
    constructor(props) {
        super(props);

        this.state = {
            //input: ""
            title: "",
            description: "",
        };

    }

    render() {
        return (
            <div className="card">
                <div className="card-body">
                    <form>
                        <div className="form-group">
                            <label htmlFor="itemText">New Question</label>
                            <input type="text" name="title" className="form-control" id="itemText"
                                placeholder="Title"
                                onChange={this.props.onChange}
                            />
                            <textarea type="text" rows="5" name="description" className="form-control" id="itemText"
                                placeholder="Description"
                                onChange={this.props.onChange}
                            />
                            <small className="form-text text-muted">Write something for your Question list
                            </small>
                        </div>
                        <button onClick={this.props.handleInput}
                            type="submit" id="submitItemBtn" className="btn btn-primary">Add Question
                        </button>
                    </form>
                </div>
            </div>
        );
    }
}



export default AddQuestion;
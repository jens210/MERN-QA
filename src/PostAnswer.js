import React, { Component } from 'react';

export default class PostAnswer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            answer: ""
        };

        this.onChange = this.onChange.bind(this);
        this.handleInput = this.handleInput.bind(this);
    }

    onChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
            id: event.id

        });
    }

    handleInput(event) {
        event.preventDefault();
        this.props.postAnswer(
            this.state.answer
        );
    }

    render(){
        if (this.state.isLoading){
            return <div>Loading...</div>
        }  
        return (
            <div className="card">
                <div className="card-body">
                    <form>
                        <div className="form-group">
                            <label htmlFor="itemText">Post answer</label>
                            <textarea rows="5" type="text" name="answer" className="form-control" id="itemText"
                                placeholder="answer"
                                onChange={this.onChange}
                            />

                            <small className="form-text text-muted">Write something
                            </small>
                        </div>
                        <button onClick={this.handleInput}
                            type="submit" id="submitItemBtn" className="btn btn-primary">Send answer
                        </button>
                    </form>
                </div>
            </div>
        );
    }
}


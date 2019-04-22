import React, {Component} from 'react';
import {Link} from "react-router-dom";

class App extends Component {

    render() {
        return (
            <div>
                <h3>404 Not Found</h3>

                <Link to={'/'}>Go back to the front page...</Link>
            </div>
        );
    }
}

export default App;

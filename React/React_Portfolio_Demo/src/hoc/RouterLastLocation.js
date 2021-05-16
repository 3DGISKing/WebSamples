import {withRouter} from 'react-router-dom';
import {Component} from 'react';

let lastLocationPath = null;

class RouterLastLocation extends Component {
    
    componentDidUpdate(prevProps) {
        if(prevProps.location.pathname !== this.props.history.location.pathname) {
            lastLocationPath = prevProps.location.pathname;
        }
    }

    render() {
        return this.props.children;
    }
}

export const getLastLocationPath = () => lastLocationPath;
export default withRouter(RouterLastLocation);
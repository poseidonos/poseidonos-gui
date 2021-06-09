import React, { Component } from 'react';
import log from '../../utils/log/log';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false
        };
    }

    static getDerivedStateFromError() {
        return {hasError: true}
    }

    componentDidCatch(error) {
        log.info(error.message);
    }

    render() {
        if (this.state.hasError) {
            return <h1>UI crashed... Please reload the page</h1>
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
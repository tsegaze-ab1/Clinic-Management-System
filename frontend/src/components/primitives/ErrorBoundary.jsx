import PropTypes from 'prop-types';
import { Component } from 'react';

export default class ErrorBoundary extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired
  };

  constructor(props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || 'Unexpected error' };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="page-card">
          <h4>Something went wrong</h4>
          <p>{this.state.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

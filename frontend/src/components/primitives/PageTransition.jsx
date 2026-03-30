import PropTypes from 'prop-types';

export default function PageTransition({ children }) {
  return <div className="fade-slide">{children}</div>;
}

PageTransition.propTypes = {
  children: PropTypes.node.isRequired
};

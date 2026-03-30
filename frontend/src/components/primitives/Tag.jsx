import PropTypes from 'prop-types';

export default function Tag({ tone = 'info', children }) {
  return <span className={`tag tag-${tone}`}>{children}</span>;
}

Tag.propTypes = {
  tone: PropTypes.oneOf(['info', 'success', 'warn', 'error']),
  children: PropTypes.node.isRequired
};

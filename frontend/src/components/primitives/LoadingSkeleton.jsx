import PropTypes from 'prop-types';

export default function LoadingSkeleton({ height = 56 }) {
  return <div className="skeleton" style={{ height, width: '100%' }} aria-label="loading" />;
}

LoadingSkeleton.propTypes = {
  height: PropTypes.number
};

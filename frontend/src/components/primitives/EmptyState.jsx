import PropTypes from 'prop-types';

export default function EmptyState({ title, subtitle, action }) {
  return (
    <output className="page-card" style={{ display: 'block', width: '100%' }}>
      <h5>{title}</h5>
      <p>{subtitle}</p>
      {action}
    </output>
  );
}

EmptyState.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  action: PropTypes.node
};

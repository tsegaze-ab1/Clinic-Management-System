import PropTypes from 'prop-types';

export default function Timeline({ items }) {
  return (
    <div className="page-card">
      <h5>Timeline</h5>
      {items.map((item, index) => (
        <div key={`${item.at}-${index}`} style={{ borderLeft: '2px solid #ddd2bf', paddingLeft: 12, marginBottom: 12 }}>
          <strong>{item.title}</strong>
          <div>{item.detail}</div>
          <small style={{ color: '#64707e' }}>{item.at}</small>
        </div>
      ))}
    </div>
  );
}

Timeline.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({ title: PropTypes.string, detail: PropTypes.string, at: PropTypes.string })).isRequired
};

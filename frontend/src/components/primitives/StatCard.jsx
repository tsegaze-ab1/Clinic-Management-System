import PropTypes from 'prop-types';
import Tag from './Tag';

export default function StatCard({ title, value, trend }) {
  let tone = 'info';
  if (trend > 0) tone = 'success';
  if (trend < 0) tone = 'error';
  return (
    <div className="page-card">
      <h6>{title}</h6>
      <h3>{value}</h3>
      <Tag tone={tone}>{trend > 0 ? `+${trend}%` : `${trend}%`} vs last period</Tag>
    </div>
  );
}

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  trend: PropTypes.number
};

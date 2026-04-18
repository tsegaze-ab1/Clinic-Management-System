import PropTypes from 'prop-types';
//h
export default function FormSection({ title, children, hint }) {
  return (
    <section className="page-card">
      <h5>{title}</h5>
      {hint ? <p>{hint}</p> : null}
      <div className="grid">{children}</div>
    </section>
  );
}

FormSection.propTypes = {
  title: PropTypes.string.isRequired,
  hint: PropTypes.string,
  children: PropTypes.node.isRequired
};

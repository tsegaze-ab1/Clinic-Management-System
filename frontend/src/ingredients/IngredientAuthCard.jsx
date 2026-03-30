import PropTypes from 'prop-types';
import authFallbackImage from '../../ingrident/backg.png';

export default function IngredientAuthCard({
  title,
  subtitle,
  fields,
  submitLabel,
  loading,
  error,
  info,
  onSubmit,
  footer
}) {
  return (
    <section className="ingredient-auth-shell fade-slide">
      <div className="ingredient-auth-media" aria-hidden="true">
        <img src={authFallbackImage} alt="" className="ingredient-auth-image" />
        <video className="ingredient-auth-video" autoPlay muted loop playsInline poster={authFallbackImage}>
          <source src="/ingrident/homepage.mp4" type="video/mp4" />
          <source src="/ingrident/dashboard.mp4" type="video/mp4" />
          <source src="/ingrident/background.mp4" type="video/mp4" />
        </video>
        <div className="ingredient-auth-overlay" />
      </div>
      <div className="ingredient-auth-orb" />
      <div className="ingredient-auth-card">
        <h2>{title}</h2>
        {subtitle ? <p>{subtitle}</p> : null}
        <form className="ingredient-auth-form" onSubmit={onSubmit}>
          {fields.map((field) => (
            <label key={field.name} className="ingredient-input-group">
              <span>{field.label}</span>
              {field.type === 'select' ? (
                <select
                  className="form-select"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  required={field.required}
                >
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              ) : (
                <input
                  className="form-control"
                  type={field.type}
                  placeholder={field.placeholder}
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  required={field.required}
                />
              )}
            </label>
          ))}
          {info ? <small className="auth-info">{info}</small> : null}
          {error ? <small className="auth-error">{error}</small> : null}
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Please wait...' : submitLabel}
          </button>
        </form>
        {footer ? <div className="ingredient-auth-footer">{footer}</div> : null}
      </div>
    </section>
  );
}

IngredientAuthCard.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  fields: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    required: PropTypes.bool,
    options: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })),
    onChange: PropTypes.func.isRequired
  })).isRequired,
  submitLabel: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
  info: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  footer: PropTypes.node
};

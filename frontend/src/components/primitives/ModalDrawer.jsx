import PropTypes from 'prop-types';

export default function ModalDrawer({ open, title, children, onClose }) {
  if (!open) return null;
  return (
    <dialog open style={{ position: 'fixed', inset: 0, background: 'rgba(7,12,20,0.35)', zIndex: 1500, border: 'none', padding: 0, maxWidth: 'none', maxHeight: 'none' }}>
      <aside className="page-card" style={{ maxWidth: 540, marginLeft: 'auto', height: '100%', borderRadius: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h5>{title}</h5>
          <button onClick={onClose} aria-label="close drawer" className="btn btn-sm btn-outline-secondary">Close</button>
        </div>
        <div>{children}</div>
      </aside>
    </dialog>
  );
}

ModalDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired
};

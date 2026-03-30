import PropTypes from 'prop-types';
import { createContext, useContext, useMemo, useState } from 'react';

const ToastContext = createContext({
  pushToast: () => {}
});

function dismissToastById(id, setToasts) {
  setToasts((prev) => prev.filter((item) => item.id !== id));
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const pushToast = (toast) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, tone: 'info', ...toast }]);
    setTimeout(() => {
      dismissToastById(id, setToasts);
    }, 3500);
  };

  const value = useMemo(() => ({ pushToast }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-host" aria-live="polite" aria-label="notifications">
        {toasts.map((item) => (
          <div key={item.id} className={`toast-item toast-${item.tone}`}>
            <strong>{item.title}</strong>
            <p>{item.message}</p>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

ToastProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export function useToast() {
  return useContext(ToastContext);
}

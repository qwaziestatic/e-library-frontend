import { X, LoaderCircle } from 'lucide-react';

export function PageHeader({ eyebrow, title, description, action }) {
  return <div className="page-header"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1>{description && <p className="page-description">{description}</p>}</div>{action}</div>;
}

export function Modal({ title, onClose, children, wide = false }) {
  return <div className="modal-backdrop"><div className={`modal-card ${wide ? 'modal-wide' : ''}`}><button className="modal-close" onClick={onClose} aria-label="Close"><X size={20} /></button><h2>{title}</h2>{children}</div></div>;
}

export function Field({ label, ...props }) {
  return <label className="field"><span>{label}</span><input {...props} /></label>;
}

export function SelectField({ label, children, ...props }) {
  return <label className="field"><span>{label}</span><select {...props}>{children}</select></label>;
}

export function Button({ children, variant = 'primary', loading = false, ...props }) {
  return <button className={`button button-${variant}`} disabled={loading || props.disabled} {...props}>{loading && <LoaderCircle size={16} className="spin" />}{children}</button>;
}

export function EmptyState({ children }) { return <div className="empty-state">{children}</div>; }

export function ErrorMessage({ message }) { return message ? <p role="alert" className="alert-error">{message}</p> : null; }

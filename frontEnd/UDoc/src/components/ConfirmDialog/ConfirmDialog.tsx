import { FaExclamationCircle } from 'react-icons/fa';
import './index.css';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="confirm-overlay">
      <div className="confirm-dialog">
        <div className="confirm-header">
          <FaExclamationCircle className="confirm-icon" />
          <h3>{title}</h3>
        </div>

        <p className="confirm-message">{message}</p>

        <div className="confirm-actions">
          <button
            type="button"
            className="confirm-cancel"
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </button>

          <button
            type="button"
            className="confirm-remove"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Removendo...' : 'Remover'}
          </button>
        </div>
      </div>
    </div>
  );
}
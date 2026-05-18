// ============================================================================
// ARQUIVO: src/components/PromptDialog/PromptDialog.tsx
// ============================================================================

import { useEffect, useState } from "react";
import { FaPen } from "react-icons/fa";
import "./index.css";

interface PromptDialogProps {
  open: boolean;
  title: string;
  message: string;
  placeholder?: string;
  initialValue?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onConfirm: (value: string) => void;
  onCancel: () => void;
}

export default function PromptDialog({
  open,
  title,
  message,
  placeholder = "",
  initialValue = "",
  confirmText = "Inserir",
  cancelText = "Cancelar",
  loading = false,
  onConfirm,
  onCancel,
}: PromptDialogProps) {
  const [value, setValue] = useState("");

  useEffect(() => {
    if (open) {
      setValue(initialValue);
    } else {
      setValue("");
    }
  }, [open, initialValue]);

  if (!open) {
    return null;
  }

  function handleConfirm() {
    const trimmedValue = value.trim();

    if (!trimmedValue || loading) {
      return;
    }

    onConfirm(trimmedValue);
  }

  function handleCancel() {
    setValue("");
    onCancel();
  }

  return (
    <div className="prompt-overlay">
      <div className="prompt-dialog">
        <div className="prompt-header">
          <FaPen className="prompt-icon" />
          <h3>{title}</h3>
        </div>

        <p className="prompt-message">{message}</p>

        <div className="prompt-body">
          <input
            type="text"
            className="prompt-input"
            value={value}
            placeholder={placeholder}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleConfirm();
              }

              if (e.key === "Escape") {
                e.preventDefault();
                handleCancel();
              }
            }}
            autoFocus
          />
        </div>

        <div className="prompt-actions">
          <button
            type="button"
            className="prompt-cancel"
            onClick={handleCancel}
            disabled={loading}
          >
            {cancelText}
          </button>

          <button
            type="button"
            className="prompt-confirm"
            onClick={handleConfirm}
            disabled={loading || !value.trim()}
          >
            {loading ? "Processando..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
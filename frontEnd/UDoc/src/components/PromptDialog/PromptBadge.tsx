import { useEffect, useState } from "react";
import { FaPen } from "react-icons/fa";
import { HexColorPicker } from "react-colorful";
import "./index.css";

interface PromptBadgeProps {
  open: boolean;
  title: string;
  message: string;
  placeholder?: string;
  initialValue?: string;
  initialColor?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onConfirm: (value: string, color: string) => void;
  onCancel: () => void;
}

export default function PromptBadge({
  open,
  title,
  message,
  placeholder = "",
  initialValue = "1",
  initialColor = "#2563eb",
  confirmText = "Inserir",
  cancelText = "Cancelar",
  loading = false,
  onConfirm,
  onCancel,
}: PromptBadgeProps) {
  const [value, setValue] = useState("");
  const [color, setColor] = useState(initialColor);

  useEffect(() => {
    if (open) {
      setValue(initialValue ?? "");
      setColor(initialColor ?? "#2563eb");
    } else {
      setValue("");
      setColor("#2563eb");
    }
  }, [open, initialValue, initialColor]);

  if (!open) {
    return null;
  }

  function handleConfirm() {
    const trimmedValue = value.trim();

    if (!trimmedValue || loading) {
      return;
    }

    onConfirm(trimmedValue, color);
  }

  function handleCancel() {
    setValue("");
    setColor(initialColor ?? "#2563eb");
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

          <div style={{ marginTop: "24px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "12px",
                fontWeight: 600,
              }}
            >
              Cor do badge
            </label>

            <HexColorPicker color={color} onChange={setColor} />

            <input
              type="text"
              className="prompt-input"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              style={{ marginTop: "12px" }}
            />
          </div>

          <div
            style={{
              marginTop: "24px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <span style={{ fontWeight: 600 }}>Pré-visualização:</span>

            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: "36px",
                height: "36px",
                padding: "0 8px",
                borderRadius: "9999px",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "16px",
                lineHeight: 1,
                backgroundColor: color,
                boxSizing: "border-box",
              }}
            >
              {value.trim() || "1"}
            </span>
          </div>
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
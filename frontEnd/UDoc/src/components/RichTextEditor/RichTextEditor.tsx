import { useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Callout from "./extensions/Callout";
import Badge from "./extensions/Badge/Badge";
import ResizableImage from "./extensions/ResizableImage";
import ResizableVideo from "./extensions/ResizableVideo";

import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaHeading,
  FaListUl,
  FaListOl,
  FaQuoteLeft,
  FaCode,
  FaCircle,
  FaMinus,
  FaLink,
  FaImage,
  FaVideo,
  FaUndo,
  FaRedo,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaAlignJustify,
  FaInfoCircle,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaSearchMinus,
  FaSearchPlus,
} from "react-icons/fa";

import PromptDialog from "../PromptDialog/PromptDialog";
import PromptBadge from "../PromptDialog/PromptBadge";
import "./index.css";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RichTextEditor({
  value,
  onChange,
}: RichTextEditorProps) {
  const [zoom, setZoom] = useState(100);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogValue, setDialogValue] = useState("");
  const [dialogType, setDialogType] = useState<
    "link" | "image" | "video" | null
  >(null);

  // Estados do Badge
  const [badgeText, setBadgeText] = useState("1");
  const [badgeColor, setBadgeColor] = useState("#2563eb");
  const [badgeDialogOpen, setBadgeDialogOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: "Digite seu conteúdo aqui...",
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Callout,
      Badge,
      ResizableImage,
      ResizableVideo,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },

    /* ==========================================================
       🚀 INTERCEPTADOR DE CONTROL + V (PASTE)
    ========================================================== */
    editorProps: {
      handlePaste: (view, event) => {
        const text = event.clipboardData?.getData("text/plain") || "";

        // 1. Verifica se o texto colado é uma URL de Imagem válida
        const isImageUrl = text.match(
          /\.(jpeg|jpg|gif|png|webp|svg)(?:\?.*)?$/i
        );

        if (isImageUrl) {
          view.dispatch(
            view.state.tr.replaceSelectionWith(
              view.state.schema.nodes.resizableImage.create({ src: text })
            )
          );
          return true;
        }

        // 2. Verifica se o texto colado é um link do YouTube ou Vimeo
        const isVideoUrl =
          text.includes("youtube.com") ||
          text.includes("youtu.be") ||
          text.includes("vimeo.com");

        if (isVideoUrl) {
          view.dispatch(
            view.state.tr.replaceSelectionWith(
              view.state.schema.nodes.resizableVideo.create({
                src: text,
                align: "center",
              })
            )
          );
          return true;
        }

        return false;
      },
    },
  });

  const changeZoom = (amount: number) => {
    setZoom((prev) => Math.min(150, Math.max(50, prev + amount)));
  };

  const openDialog = (type: "link" | "image" | "video") => {
    setDialogType(type);
    setDialogValue("");

    if (type === "link") {
      setDialogTitle("Inserir Link");
      setDialogMessage("Digite ou cole a URL do link:");
    } else if (type === "image") {
      setDialogTitle("Inserir Imagem");
      setDialogMessage("Digite ou cole a URL da imagem:");
    } else if (type === "video") {
      setDialogTitle("Inserir Vídeo");
      setDialogMessage("Digite ou cole a URL do vídeo (YouTube ou Vimeo):");
    }

    setDialogOpen(true);
  };

  /* ==========================================================
     AÇÃO DE CONFIRMAÇÃO DO MODAL (ESTRUTURADA E SEGURA)
  ========================================================== */
  const handleDialogConfirm = () => {
    const input = dialogValue.trim();

    if (!editor || !input || !dialogType) {
      setDialogOpen(false);
      return;
    }

    try {
      if (dialogType === "image") {
        editor.chain().focus().setResizableImage({ src: input }).run();
      } else if (dialogType === "video") {
        // Mantida exatamente a lógica original do vídeo
        editor
          .chain()
          .focus()
          .setResizableVideo({
            src: input,
            width: 560,
            align: "center",
          })
          .run();
      } else if (dialogType === "link") {
        editor.chain().focus().setLink({ href: input }).run();
      }
    } catch (error) {
      console.error("Erro ao executar comando do Tiptap pelo modal:", error);
    }

    setDialogOpen(false);
    setDialogValue("");
    setDialogType(null);
  };

  const insertCallout = (
    type: "info" | "warning" | "success" | "error"
  ) => {
    if (!editor) return;

    editor
      .chain()
      .focus()
      .insertContent({
        type: "callout",
        attrs: { type },
        content: [
          {
            type: "paragraph",
            text: `Este é um alerta de ${type}...`,
          },
        ],
      })
      .run();
  };

  // ==========================================================
  // BADGE - AGORA USANDO PromptBadge (SEM window.prompt)
  // ==========================================================
  const insertBadge = () => {
    if (!editor) {
      return;
    }

    setBadgeText("1");
    setBadgeColor("#2563eb");
    setBadgeDialogOpen(true);
  };

  const handleConfirmBadge = (value: string, color: string) => {
    if (!editor) {
      return;
    }

    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return;
    }

    editor.chain().focus().insertBadge(trimmedValue, color).run();

    setBadgeText(trimmedValue);
    setBadgeColor(color);
    setBadgeDialogOpen(false);
  };

  const handleCancelBadge = () => {
    setBadgeDialogOpen(false);
  };

  if (!editor) return null;

  const ToolbarButton = ({
    title,
    onClick,
    active = false,
    children,
  }: any) => (
    <button
      type="button"
      className={`editor-toolbar-button ${active ? "is-active" : ""}`}
      title={title}
      onClick={onClick}
    >
      {children}
    </button>
  );

  return (
    <div className="editor-container-fullscreen">
      <div className="editor-wrapper">
        <div className="editor-toolbar">
          {/* FORMATADORES DE TEXTO */}
          <ToolbarButton
            title="Negrito"
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive("bold")}
          >
            <FaBold />
          </ToolbarButton>

          <ToolbarButton
            title="Itálico"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive("italic")}
          >
            <FaItalic />
          </ToolbarButton>

          <ToolbarButton
            title="Sublinhado"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            active={editor.isActive("underline")}
          >
            <FaUnderline />
          </ToolbarButton>

          <div className="editor-toolbar-separator" />

          {/* ALINHAMENTOS DE TEXTO */}
          <ToolbarButton
            title="Alinhar à esquerda"
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            active={editor.isActive({ textAlign: "left" })}
          >
            <FaAlignLeft />
          </ToolbarButton>

          <ToolbarButton
            title="Centralizar"
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            active={editor.isActive({ textAlign: "center" })}
          >
            <FaAlignCenter />
          </ToolbarButton>

          <ToolbarButton
            title="Alinhar à direita"
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            active={editor.isActive({ textAlign: "right" })}
          >
            <FaAlignRight />
          </ToolbarButton>

          <div className="editor-toolbar-separator" />

          {/* LISTAS E BLOCOS */}
          <ToolbarButton
            title="Lista com marcadores"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive("bulletList")}
          >
            <FaListUl />
          </ToolbarButton>

          <ToolbarButton
            title="Lista numerada"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive("orderedList")}
          >
            <FaListOl />
          </ToolbarButton>

          <ToolbarButton
            title="Citação"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            active={editor.isActive("blockquote")}
          >
            <FaQuoteLeft />
          </ToolbarButton>

          <ToolbarButton
            title="Código Inline"
            onClick={() => editor.chain().focus().toggleCode().run()}
            active={editor.isActive("code")}
          >
            <FaCode />
          </ToolbarButton>

          <ToolbarButton title="Inserir Badge" onClick={insertBadge}>
            <FaCircle />
          </ToolbarButton>

          <div className="editor-toolbar-separator" />

          {/* MÍDIAS (MODAL) */}
          <ToolbarButton
            title="Inserir Link"
            onClick={() => openDialog("link")}
            active={editor.isActive("link")}
          >
            <FaLink />
          </ToolbarButton>

          <ToolbarButton
            title="Inserir Imagem"
            onClick={() => openDialog("image")}
          >
            <FaImage />
          </ToolbarButton>

          <ToolbarButton
            title="Inserir Vídeo"
            onClick={() => openDialog("video")}
          >
            <FaVideo />
          </ToolbarButton>

          <div className="editor-toolbar-separator" />

          {/* ALERTAS */}
          <ToolbarButton
            title="Info"
            onClick={() => insertCallout("info")}
          >
            <FaInfoCircle />
          </ToolbarButton>

          <ToolbarButton
            title="Warning"
            onClick={() => insertCallout("warning")}
          >
            <FaExclamationTriangle />
          </ToolbarButton>

          <ToolbarButton
            title="Success"
            onClick={() => insertCallout("success")}
          >
            <FaCheckCircle />
          </ToolbarButton>

          <ToolbarButton
            title="Error"
            onClick={() => insertCallout("error")}
          >
            <FaTimesCircle />
          </ToolbarButton>

          {/* HISTÓRICO */}
          <ToolbarButton
            title="Desfazer"
            onClick={() => editor.chain().focus().undo().run()}
          >
            <FaUndo />
          </ToolbarButton>

          <ToolbarButton
            title="Refazer"
            onClick={() => editor.chain().focus().redo().run()}
          >
            <FaRedo />
          </ToolbarButton>

          {/* ZOOM */}
          <ToolbarButton
            title="Reduzir zoom"
            onClick={() => changeZoom(-10)}
          >
            <FaSearchMinus />
          </ToolbarButton>

          <span className="editor-zoom-label">{zoom}%</span>

          <ToolbarButton
            title="Aumentar zoom"
            onClick={() => changeZoom(10)}
          >
            <FaSearchPlus />
          </ToolbarButton>
        </div>

        <div
          className="editor-content-wrapper"
          style={{ zoom: `${zoom}%` }}
        >
          <EditorContent
            editor={editor}
            className="editor-content"
          />
        </div>
      </div>

      <PromptDialog
        open={dialogOpen}
        title={dialogTitle}
        message={dialogMessage}
        placeholder="Cole aqui a URL"
        initialValue={dialogValue}
        confirmText="Inserir"
        cancelText="Cancelar"
        onConfirm={(value: string) => {
          if (!editor || !dialogType) {
            setDialogOpen(false);
            return;
          }

          const input = value.trim();

          if (!input) {
            setDialogOpen(false);
            return;
          }

          try {
            if (dialogType === "image") {
              editor
                .chain()
                .focus()
                .setResizableImage({
                  src: input,
                })
                .run();
            } else if (dialogType === "video") {
              editor
                .chain()
                .focus()
                .setResizableVideo({
                  src: input,
                  width: 560,
                  align: "center",
                })
                .run();
            } else if (dialogType === "link") {
              editor
                .chain()
                .focus()
                .setLink({
                  href: input,
                })
                .run();
            }
          } catch (error) {
            console.error("Erro ao inserir conteúdo:", error);
          }

          setDialogOpen(false);
          setDialogValue("");
          setDialogType(null);
        }}
        onCancel={() => {
          setDialogOpen(false);
          setDialogValue("");
          setDialogType(null);
        }}
      />

      <PromptBadge
        open={badgeDialogOpen}
        title="Inserir Badge"
        message="Digite o texto e escolha a cor do badge."
        placeholder="Ex.: 1"
        initialValue={badgeText}
        initialColor={badgeColor}
        confirmText="Inserir"
        cancelText="Cancelar"
        onConfirm={handleConfirmBadge}
        onCancel={handleCancelBadge}
      />
    </div>
  );
}
import { Node, mergeAttributes } from "@tiptap/core";
import "./Badge.css";

const Badge = Node.create({
  name: "badge",

  group: "inline",
  inline: true,
  atom: true,

  addAttributes() {
    return {
      text: {
        default: "1",
      },
      color: {
        default: "#2563eb",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "span[data-badge]",
        getAttrs: (element) => {
          const el = element as HTMLElement;
          return {
            // Tenta ler data-text primeiro (formato novo).
            // Fallback para textContent (formato antigo salvo com texto filho).
            text: el.getAttribute("data-text") || el.textContent || "1",
            color: el.getAttribute("data-color") || "#2563eb",
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    // Não passa texto como terceiro elemento (causava o RangeError).
    // O texto é exibido via CSS ::before usando attr(data-text).
    return [
      "span",
      mergeAttributes(HTMLAttributes, {
        "data-badge": "",
        "data-text": HTMLAttributes.text,
        "data-color": HTMLAttributes.color,
        class: "udoc-badge",
        style: `background-color: ${HTMLAttributes.color};`,
      }),
    ];
  },

  addCommands() {
    return {
      insertBadge:
        (text: string = "1", color: string = "#2563eb") =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: { text, color },
          });
        },
    };
  },
});

export default Badge;

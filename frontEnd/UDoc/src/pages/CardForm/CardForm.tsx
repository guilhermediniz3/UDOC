import { useState } from "react";
import Tabs from "../../components/Tabs/Tabs";
import RichTextEditor from "../../components/RichTextEditor/RichTextEditor";

export default function CardForm() {
  // Campo que será enviado ao backend como "content"
  const [content, setContent] = useState("");

  // Array de abas utilizado pelo seu componente Tabs
  const tabs = [
    {
      id: "card",
      label: "Card",
      content: (
        <>
          <h1>Cadastro de Card</h1>
          <p>Preencha as informações básicas do card.</p>
        </>
      ),
    },
    {
      id: "media",
      label: "Mídias",
      content: (
        <>
          <h1>Mídias</h1>
          <p>
            Aqui você poderá criar o conteúdo completo do card com texto,
            imagens, vídeos e embeds.
          </p>

          <div style={{ marginTop: "24px" }}>
            <RichTextEditor
              value={content}
              onChange={setContent}
            />
          </div>
        </>
      ),
    },
    {
      id: "settings",
      label: "Configurações",
      content: (
        <>
          <h1>Configurações</h1>
          <p>Configurações adicionais do card.</p>
        </>
      ),
    },
  ];

  return <Tabs tabs={tabs} />;
}
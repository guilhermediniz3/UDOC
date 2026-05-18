import { useEffect, useState } from "react";
import type { Card as CardType } from "../../types/Card";
import { getCards } from "../../services/cardService";
import Card from "../../components/Card/Card";

export default function Home() {
  const [cards, setCards] = useState<CardType[]>([]);

  useEffect(() => {
    async function carregarCards() {
      const dados = await getCards();
      setCards(dados);
    }

    carregarCards();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        gap: "24px",
        flexWrap: "wrap",
        padding: "30px",
      }}
    >
      {cards.map((card) => (
        <Card
          key={card.id}
          titulo={card.titulo}
          descricao={card.descricao}
          icone={card.icone}
        />
      ))}
    </div>
  );
}
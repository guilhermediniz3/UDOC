import api from "./api";
import type { Card } from "../types/Card";

export async function getCards(): Promise<Card[]> {
  const response = await api.get<Card[]>("/cards");
  return response.data;
}

export async function createCard(card: Card): Promise<Card> {
  const response = await api.post<Card>('/cards', card);
  return response.data;
}

export async function updateCard(card: Card): Promise<Card> {
  const response = await api.put<Card>(`/cards/${card.id}`, card);
  return response.data;
}

export async function saveCard(card: Card): Promise<Card> {
  if (card.id) {
    return updateCard(card);
  }

  return createCard(card);
}

export async function deleteCard(id: number): Promise<void> {
  await api.delete(`/cards/${id}`);
}
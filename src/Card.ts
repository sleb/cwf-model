export interface Card {
  id: string;
  contributor: string;
  nounPhrase: string;
  used: boolean;
}

export type CardData = Omit<Card, "id">;

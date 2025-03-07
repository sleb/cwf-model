export type Rating = "sad" | "sick" | "funny" | "angry";
export const RATINGS: Rating[] = ["sad", "sick", "funny", "angry"] as const;

export interface Round {
  id: string;
  judge: string;
  cards: Record<string, string>;
  reactions?: Record<string, Record<string, Rating>>;
  adjective?: string;
  winner?: string;
}

export type RoundData = Omit<Round, "id">;

export const playerForCard = ({ cards }: RoundData, cardId: string): string => {
  const playerId = Object.entries(cards).find(([, id]) => id === cardId)?.[0];
  if (!playerId) {
    throw new Error(`no playerId found for cardId: ${cardId}`);
  }

  return playerId;
};

export const cardRatingCounts = (
  round: Round,
): { [key: string]: { [key in Rating]: number } } => {
  if (!round?.reactions) {
    return {};
  }

  return Object.entries(round.reactions).reduce(
    (cardReactionCounts, [cardId, playerReactions]) => {
      const reactionCounts = Object.entries(playerReactions).reduce(
        (reactionCounts, [, reaction]) => {
          reactionCounts[reaction] = (reactionCounts[reaction] || 0) + 1;
          return reactionCounts;
        },
        {} as { [key in Rating]: number },
      );

      const cardCounts = cardReactionCounts[cardId] || {};
      for (const [reaction, count] of Object.entries(reactionCounts)) {
        cardCounts[reaction as Rating] =
          (cardCounts[reaction as Rating] || 0) + count;
      }
      cardReactionCounts[cardId] = cardCounts;

      return cardReactionCounts;
    },
    {} as { [key: string]: { [key in Rating]: number } },
  );
};

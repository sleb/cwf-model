import { describe, expect, it } from "@jest/globals";
import { cardRatingCounts, playerForCard, type Round } from "../Round";
import { mocker } from "./mocker";

const mockRound = mocker<Round>({
  cards: {},
  id: "any-id",
  judge: "any-judge",
});

describe("Round", () => {
  describe("playerForCard", () => {
    it("should return the player who played a given card", () => {
      const cardId = "card#1";
      const playerId = "player#1";
      expect(
        playerForCard(
          mockRound({
            cards: {
              [playerId]: cardId,
              "player#2": "card#3",
              "player#3": "card#8",
            },
          }),
          cardId,
        ),
      ).toEqual(playerId);
    });
  });

  describe("cardRatingCounts", () => {
    it("should return cardId -> rating -> count", () => {
      const cardId1 = "card#1";
      const cardId2 = "card#2";

      expect(
        cardRatingCounts(
          mockRound({
            reactions: {
              [cardId1]: {
                "uid#1": "angry",
                "uid#2": "angry",
                "uid#3": "sad",
              },
              [cardId2]: {
                "uid#1": "funny",
                "uid#2": "sick",
                "uid#3": "sad",
              },
            },
          }),
        ),
      ).toEqual({
        [cardId1]: { angry: 2, sad: 1 },
        [cardId2]: { funny: 1, sick: 1, sad: 1 },
      });
    });
  });
});

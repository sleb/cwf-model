import { describe, expect, it } from "@jest/globals";
import {
  type Game,
  playerCardCounts,
  playerCount,
  playerIds,
  winners,
} from "../Game";
import type { Player } from "../Player";
import { mocker } from "./mocker";

const mockGame = mocker<Game>({
  id: "any-id",
  cardCounts: {},
  creator: "any-creator",
  phase: "cards",
  players: {},
  title: "any-title",
});

const mockPlayer = mocker<Player>({ hand: [], name: "any-name", score: 0 });

describe("playerIds", () => {
  describe("when empty", () => {
    it("should return []", () => {
      expect(playerIds(mockGame())).toHaveLength(0);
    });
  });

  describe("when non-empty", () => {
    it("should return IDs", () => {
      const ids = ["abc", "def"];
      expect(
        new Set(
          playerIds(
            mockGame({
              players: ids.reduce(
                (acc, id) => {
                  acc[id] = mockPlayer({ name: id });
                  return acc;
                },
                {} as Record<string, Player>,
              ),
            }),
          ),
        ),
      ).toEqual(new Set(ids));
    });
  });
});

describe("winners", () => {
  describe("when one player has highest score", () => {
    it("should find a single winner", () => {
      const winner = mockPlayer({ name: "player#2", score: 15 });
      const game = mockGame({
        players: {
          "id#1": mockPlayer({ name: "player#1", score: 11 }),
          "id#2": winner,
          "id#3": mockPlayer({ name: "player#3", score: 10 }),
          "id#4": mockPlayer({ name: "player#4", score: 1 }),
          "id#5": mockPlayer({ name: "player#5", score: 3 }),
          "id#6": mockPlayer({ name: "player#6", score: 0 }),
        },
      });

      expect(winners(game)).toEqual([winner]);
    });
  });

  describe("when multiple players have the highest score", () => {
    it("should find all winners", () => {
      const winner1 = mockPlayer({ name: "player#2", score: 15 });
      const winner2 = mockPlayer({ name: "player#3", score: 15 });
      const game = mockGame({
        players: {
          "id#1": mockPlayer({ name: "player#1", score: 11 }),
          "id#2": winner1,
          "id#3": winner2,
          "id#4": mockPlayer({ name: "player#4", score: 1 }),
          "id#5": mockPlayer({ name: "player#5", score: 3 }),
          "id#6": mockPlayer({ name: "player#6", score: 0 }),
        },
      });

      expect(new Set(winners(game))).toEqual(new Set([winner1, winner2]));
    });
  });
});

describe("playerCount", () => {
  it("should return number of players", () => {
    const playerIds = ["123", "456"];
    const players = playerIds.reduce(
      (acc, id) => {
        acc[id] = mockPlayer({ name: id });
        return acc;
      },
      {} as Record<string, Player>,
    );
    expect(playerCount(mockGame({ players }))).toBe(playerIds.length);
  });
});

describe("playerCardCounts", () => {
  it("should return card count for each player", () => {
    const game = mockGame({
      players: {
        "id#1": mockPlayer({ hand: ["card#1", "card#2"] }),
        "id#2": mockPlayer({ hand: ["card#4", "card#5"] }),
        "id#3": mockPlayer({ hand: ["card#6", "card#7", "card#8"] }),
      },
    });

    expect(playerCardCounts(game)).toEqual({
      "id#1": 2,
      "id#2": 2,
      "id#3": 3,
    });
  });
});

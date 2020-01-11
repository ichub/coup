interface GameState {
  players: Player[];
  turnIndex: number;
}

interface Player {
  name: string;
  cards: CardType[];
}

class Game {
  private state: GameState;

  public acceptAction<T>(action: Action<T>): void {}

  private executeAction<T>(
    state: GameState,
    action: StealAction | IncomeAction
  ): GameState {
    switch (action.type) {
      case ActionType.Steal:
        return Game.executeSteal(action, state);
      case ActionType.Income:
        return Game.executeIncome(action, state);
      default:
        console.warn("executing unknown action");
        return state;
    }
  }

  private static executeIncome(
    action: IncomeAction,
    state: GameState
  ): GameState {
    return state;
  }

  private static executeSteal(
    action: StealAction,
    state: GameState
  ): GameState {
    return state;
  }

  private static newGame(): GameState {
    return {
      turnIndex: 0,
      players: [
        {
          name: "Ivan",
          cards: [CardType.Ambassador, CardType.Assasin]
        }
      ]
    };
  }
}

class Deck {
  private cards: CardType[];

  private constructor(cards: CardType[]) {
    this.cards = cards;
  }

  private static newDeck(): Deck {
    const cards: CardType[] = [];

    for (let cardType of AllCardTypes) {
      for (let i = 0; i < 3; i++) {
        cards.push(cardType);
      }
    }

    return new Deck(cards);
  }
}

interface Action<T> {
  options: T;
}

class IncomeAction implements Action<never> {
  type: ActionType.Income = ActionType.Income;
  options: never;
}

class StealAction implements Action<StealOptions> {
  type: ActionType.Steal = ActionType.Steal;
  options: StealOptions;

  public make(options: StealOptions) {
    this.options = options;
  }
}

interface StealOptions {}

enum CardType {
  Duke,
  Contessa,
  Assasin,
  Ambassador,
  Captain
}

const AllCardTypes = Object.freeze([
  CardType.Duke,
  CardType.Contessa,
  CardType.Ambassador,
  CardType.Assasin,
  CardType.Captain
]);

enum ActionType {
  Challenge,
  Coup,
  Income,
  Tax,
  ForeignAid,
  Steal,
  Assasinate,
  Contessa,
  Exchange
}

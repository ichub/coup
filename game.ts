export interface GameState {
  players: Player[];
  deck: Deck;
  turnIndex: number;
  proposedAction: SomeAction | null;
}

export interface Player {
  name: string;
  gold: number;
  cards: CardType[];
}

export type SomeAction = StealAction | IncomeAction | CounterAction;

export class Game {
  private state: GameState;

  public constructor() {
    this.state = Game.newGameState();
  }

  public getStateSnapsnot(): GameState {
    return Game.cloneState(this.state);
  }

  public acceptAction(action: SomeAction): GameState {
    this.state = this.executeAction(this.state, action);

    return this.state;
  }

  public getAvailableActions() {
    return Game.getAvailableActions(this.state);
  }

  public static getAvailableActions(state: GameState): SomeAction[] {
    const currentPlayer = state.players[state.turnIndex];
    const otherPlayers = state.players.filter(p => p !== currentPlayer);

    let availableActions = [];

    for (const player of state.players) {
      availableActions = availableActions.concat(
        Game.getActionsForPlayer(
          player,
          otherPlayers,
          player === currentPlayer,
          state.proposedAction
        )
      );
    }

    return availableActions;
  }

  private static getActionsForPlayer(
    player: Player,
    otherPlayers: Player[],
    isTheirTurn: boolean,
    proposedAction: SomeAction
  ): SomeAction[] {
    let result: SomeAction[] = [];

    if (isTheirTurn) {
      let cardActions: SomeAction[] = [];

      for (let card of player.cards) {
        cardActions = cardActions.concat(
          Game.getActionsForType(card, player, proposedAction, otherPlayers)
        );
      }

      result = result.concat(cardActions);
      result = result.concat(Game.getIntrinsicActions(player));
    } else {
    }

    return [...result];
  }

  private static getIntrinsicActions(owner: Player): SomeAction[] {
    return [new IncomeAction(owner)];
  }

  private static getActionsForType(
    type: CardType,
    owner: Player,
    proposedAction: SomeAction,
    otherPlayers: Player[]
  ): SomeAction[] {
    let playerActions = [];

    switch (
      type
      // this is where we would calculate per user actions
    ) {
    }

    return playerActions;
  }

  private executeAction(state: GameState, action: SomeAction): GameState {
    switch (action.type) {
      case ActionType.Steal:
        return Game.executeSteal(action, state);
      case ActionType.Income:
        return Game.executeIncome(action, state);
      case ActionType.Counter:
        return Game.executeCounter(action, state);
      default:
        console.warn("executing unknown action");
        return state;
    }
  }

  private static executeCounter(
    action: CounterAction,
    state: GameState
  ): GameState {
    const newState = Game.cloneState(state);

    newState.proposedAction = null;

    return Game.advanceToNextPlayer(newState);
  }

  private static advanceToNextPlayer(state: GameState): GameState {
    const newState = Game.cloneState(state);

    // easy way of wrapping back to zero
    newState.turnIndex =
      (state.players.length + newState.turnIndex + 1) % state.players.length;

    return newState;
  }

  private static cloneState(state: GameState): GameState {
    return JSON.parse(JSON.stringify(state));
  }

  private static executeIncome(
    action: IncomeAction,
    state: GameState
  ): GameState {
    let newState = Game.cloneState(state);

    newState.players = newState.players.map(p => {
      if (p === action.owner) {
        p.gold++;
      }

      return p;
    });

    return Game.advanceToNextPlayer(state);
  }

  private static executeSteal(
    action: StealAction,
    state: GameState
  ): GameState {
    return state;
  }

  private static newGameState(): GameState {
    return {
      turnIndex: 0,
      proposedAction: null,
      deck: Deck.newDeck(),
      players: [
        {
          gold: 0,
          name: "Ivan",
          cards: [CardType.Ambassador, CardType.Assasin]
        },
        {
          gold: 0,
          name: "David",
          cards: [CardType.Captain, CardType.Duke]
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

  public static newDeck(): Deck {
    const cards: CardType[] = [];

    for (let cardType of AllCardTypes) {
      for (let i = 0; i < 3; i++) {
        cards.push(cardType);
      }
    }

    return new Deck(cards);
  }
}

class Action {
  owner: Player;

  public constructor(owner: Player) {
    this.owner = owner;
  }

  public toString() {
    return `${this.owner.name}. `;
  }
}

class IncomeAction extends Action {
  type: ActionType.Income = ActionType.Income;
  options: never;

  public toString() {
    return super.toString() + `income`;
  }
}

class StealAction extends Action {
  type: ActionType.Steal = ActionType.Steal;
  target: Player;

  public constructor(owner: Player, target: Player) {
    super(owner);
    this.target = target;
  }

  public toString() {
    return super.toString() + ` steal from ${this.target.name}`;
  }
}

class CounterAction extends Action {
  type: ActionType.Counter = ActionType.Counter;
  target: SomeAction;

  public constructor(owner: Player, target: SomeAction) {
    super(owner);
    this.target = target;
  }

  public toString() {
    return (
      super.toString() +
      ` counter ${this.target.owner.name}'s (${this.target.toString()})`
    );
  }
}

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
  Challenge = "Challenge",
  Counter = "Counter",
  Coup = "Coup",
  Income = "Income",
  Tax = "Tax",
  ForeignAid = "ForeignAid",
  Steal = "Steal",
  Assasinate = "Assasinate",
  Contessa = "Contessa",
  Exchange = "Exchange"
}

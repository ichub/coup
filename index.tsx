import * as React from "react";
import * as ReactDOM from "react-dom";
import styled from "styled-components";
import { Game, SomeAction, GameState } from "./game";

const App = () => {
  return (
    <div>
      <GameRenderer></GameRenderer>
    </div>
  );
};

interface GameRendererState {
  gameState: GameState;
  playerName: string;
}

class GameRenderer extends React.Component<{}, GameRendererState> {
  private game = new Game();

  public constructor(props: {}) {
    super(props);

    this.state = {
      gameState: this.game.getStateSnapsnot(),
      playerName: "Ivan"
    };
  }

  handleActionClick = (move: SomeAction) => {
    console.log(move.toString());

    this.setState({
      gameState: this.game.acceptAction(move)
    });
  };

  render() {
    const moves = this.game
      .getAvailableActions()
      .filter(move => move.owner.name === this.state.playerName);

    console.log("state", this.game.getStateSnapsnot());
    console.log("moves", moves);

    const me = this.state.gameState.players.find(
      p => p.name == this.state.playerName
    );

    return (
      <div>
        you are: {me.name}
        {moves.map((move, i) => (
          <Move key={i} onClick={() => this.handleActionClick(move)}>
            {i}) {move.toString()}
          </Move>
        ))}
      </div>
    );
  }
}

const Move = styled.div`
  background-color: lightgray;
  padding: 2px 8px;
  border-radius: 10px;
  color: green;
  border: 1px solid transparent;
  margin: 4px;
  cursor: pointer;

  &:hover {
    border: 1px solid purple;
  }

  &:hover:active {
    color: white;
    background-color: black;
  }
`;

const div = document.createElement("div");
document.body.appendChild(div);

console.log(React);

ReactDOM.render(<App></App>, div);

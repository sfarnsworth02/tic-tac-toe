import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    // constructor was removed from here because it is no longer 
    // keeping track of the squares state
    return (
       <button 
      className="square" 
      // "Since the Square components no longer maintain state,  
       //   the Square components receive values from the Board component 
       //   and inform the Board component when they’re clicked. 
       // In React terms, the Square components are now controlled components."
       onClick={props.onClick}>
        {props.value}
       </button>
    );
  }
  
  // This is only when we are concerened with the current state of the board.
  // When we want to keep a history of the moves then we move the state into the Game component so we can log out all the moves
  // "When the Board’s state changes, the Square components re-render automatically.
  // Keeping the state of all squares in the Board component will allow it to determine the winner in the future" --React Tutorial
  class Board extends React.Component {

    // handleClick(i) {
    //   // index 3 is clicked
    //   console.log('original state: ', this.state.squares);
    //   // here is the original state that looks like this [null, null, null...]
    //   // "we call .slice() to create a copy of the squares array to modify instead of modifying the existing array"
    //   // to change state directly is to MUTATE the data
    //   // to replace the data with a new copy is IMMUTABILITY and there are multiple benefits to this method
    //   // see https://reactjs.org/tutorial/tutorial.html Data Change without Mutation
    //   const squares = this.state.squares.slice();
    //   if (calculateWinner(squares) || squares[i]) {
    //     return;
    //   }

    //   console.log('new state: ', squares);
    //   // here is the new state that looks like this [null, null, null, X, null...]

    //   squares[i] = this.state.xIsNext? 'X' : 'O';
    //   this.setState({
    //     squares: squares,
    //     xIsNext: !this.state.xIsNext, //only 2 options w/ boolean values, this sets the state opposite to what it was 
    //   });
    // }

    renderSquare(i) {
      return <Square 
                // value & handleClick is managing the state of the square value
                // and will pass it in as a prop to the Square component
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
                />;
    }
  
    render() {
      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    // constructor was added here because it is now in charge of 
    // the squares state. The squares have all been added to a 
    // squares array
    constructor(props){
      super(props);
      this.state = {
        history: [{
          squares: Array(9).fill(null),
        }],
        stepNumber: 0,
        xIsNext: true,
      }
    }

    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      
      if (calculateWinner(squares) || squares[i]) {
        //  ?? what does the or statment do here?  squares[i] ????
        return;
      }
      squares[i] = this.state.xIsNext? 'X' : 'O';
      this.setState({
        // concat method does not mutate the original array, unlike the push method
        history: history.concat([{
          squares: squares,
        }]),
        xIsNext: !this.state.xIsNext, //only 2 options w/ boolean values, this sets the state opposite to what it was 
        stepNumber: history.length,
      });
    }

    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
      })
    }

    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);

      const moves = history.map((step, move) => {
        const desc = move ? `Go to move # ${move}` : `Go to game start`;
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        )
      })

      let status;
      if (winner) {
        status = `Winner: ${winner}`;
      } else {
        status = `Next player: ${(this.state.xIsNext ? 'X' : 'O')}`;
      }

      return (
        <div className="game">
          <div className="game-board">
            <Board 
              squares={current.squares}
              onClick ={(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }
  
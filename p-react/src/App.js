import { useState } from 'react'; // Importamos el hook useState para manejar el estado del juego.
import './App.css'; // Importamos los estilos CSS.


// 🔹 Componente Square: Representa una casilla del tablero.
function Square({ value, onSquareClick, isWinningSquare }) {
  return (
    // Botón que representa una casilla con clases dinámicas:
    // - 'x' si el valor es 'X' (para cambiar color).
    // - 'o' si el valor es 'O' (para cambiar color).
    // - 'winning-square' si la casilla es parte de la línea ganadora.
    <button className={`square ${value === 'X' ? 'x' : value === 'O' ? 'o' : ''} ${isWinningSquare ? 'winning-square' : ''}`} onClick={onSquareClick}>
      {value} {/* Muestra "X", "O" o nada en la casilla */}
    </button>
  );
}


// 🔹 Componente Board: Representa el tablero con 9 casillas.
function Board({ xIsNext, squares, onPlay }) {
  // Función que maneja el clic en una casilla.
  function handleClick(i) {
    // Si ya hay un ganador o la casilla está ocupada, no hace nada.
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    // Creamos una copia del array de casillas y asignamos "X" o "O".
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';

    // Llamamos a la función que actualiza el estado del juego.
    onPlay(nextSquares);
  }

  // Obtenemos información sobre el ganador (si hay uno).
  const winnerInfo = calculateWinner(squares);
  const winner = winnerInfo ? winnerInfo.winner : null;
  const winningSquares = winnerInfo ? winnerInfo.line : [];

  // Mensaje de estado (indica quién ganó o quién juega).
  let status;
  if (winner) {
    status = 'Ganador: ' + winner;
  } else {
    status = 'Siguiente jugador: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div> {/* Muestra el estado del juego */}
      
      {/* Renderiza las filas del tablero, usando el componente Square */}
      <div className="board-row">
        {[0, 1, 2].map((i) => (
          <Square key={i} value={squares[i]} onSquareClick={() => handleClick(i)} isWinningSquare={winningSquares.includes(i)} />
        ))}
      </div>
      <div className="board-row">
        {[3, 4, 5].map((i) => (
          <Square key={i} value={squares[i]} onSquareClick={() => handleClick(i)} isWinningSquare={winningSquares.includes(i)} />
        ))}
      </div>
      <div className="board-row">
        {[6, 7, 8].map((i) => (
          <Square key={i} value={squares[i]} onSquareClick={() => handleClick(i)} isWinningSquare={winningSquares.includes(i)} />
        ))}
      </div>
    </>
  );
}


// 🔹 Componente principal: Controla el estado del juego.
export default function App() {
  // Guardamos el historial de movimientos del juego.
  const [history, setHistory] = useState([Array(9).fill(null)]);

  // Estado para rastrear el movimiento actual.
  const [currentMove, setCurrentMove] = useState(0);

  // Determina si es turno de "X" o "O".
  const xIsNext = currentMove % 2 === 0;

  // Obtiene el tablero actual basado en el historial.
  const currentSquares = history[currentMove];

  // Función que maneja cada jugada y actualiza el historial.
  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  // Función que permite retroceder a un movimiento anterior.
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  // Función que reinicia el juego.
  function restartGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  // Mapeamos el historial para mostrar los botones de retroceso.
  const moves = history.map((squares, move) => {
    let description = move > 0 ? `Ir al movimiento #${move}` : 'Ir al inicio del juego';
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      {/* Tablero de juego */}
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>

      {/* Información del juego y botones de historial */}
      <div className="game-info">
        <ol>{moves}</ol>
        <button className="restart-button" onClick={restartGame}>
          Reiniciar Juego
        </button>
      </div>
    </div>
  );
}


// 🔹 Función para determinar si hay un ganador.
function calculateWinner(squares) {
  // Combinaciones ganadoras del Tic-Tac-Toe.
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Filas
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columnas
    [0, 4, 8], [2, 4, 6]             // Diagonales
  ];

  // Recorremos todas las combinaciones ganadoras.
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];

    // Si las tres casillas son iguales y no son null, hay un ganador.
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: lines[i] }; // Retorna el ganador y la línea ganadora.
    }
  }

  return null; // No hay ganador.
}

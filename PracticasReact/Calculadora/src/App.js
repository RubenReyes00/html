import { useState } from "react";
import './App.css';

function App() {
  const [valor, setValor] = useState("0");

  const onClickFunction = (event) => {
    const input = event.target.value;

    if (valor === "Error") {
      setValor(input);
      return;
    }

    if (valor === "0") {
      if (input === ".") {
        setValor("0.");
      } else {
        setValor(input);
      }
      return;
    }

    setValor(valor + input);
  };

  const esExpresionValida = (exp) => {
    if (/[+*/-]{2,}/.test(exp)) return false;
    if (/[+*/-]$/.test(exp)) return false;

    let balance = 0;
    for (let char of exp) {
      if (char === "(") balance++;
      if (char === ")") balance--;
      if (balance < 0) return false;
    }
    return balance === 0;
  };

  const calcularResultado = () => {
    if (!esExpresionValida(valor)) {
      setValor("Error");
      return;
    }

    try {
      const expresionConMultiplicacionImplicita = valor
        .replace(/(\d|\))(?=\()/g, "$1*")
        .replace(/\)(?=\d)/g, ")*");
      const resultado = Function(`"use strict"; return (${expresionConMultiplicacionImplicita})`)();
      setValor(resultado.toString());
    } catch (error) {
      setValor("Error");
    }
  };

  const limpiarPantalla = () => {
    setValor("0");
  };

  return (
    <div className="calculator">
      <div id="display" className="display">{valor}</div>
      <div className="buttons">
        <button className="btn clear" onClick={limpiarPantalla}>C</button>
        <button className="btn" value="(" onClick={onClickFunction}>(</button>
        <button className="btn" value=")" onClick={onClickFunction}>)</button>
        <button className="btn" value="/" onClick={onClickFunction}>/</button>

        <button className="btn" value="7" onClick={onClickFunction}>7</button>
        <button className="btn" value="8" onClick={onClickFunction}>8</button>
        <button className="btn" value="9" onClick={onClickFunction}>9</button>
        <button className="btn" value="*" onClick={onClickFunction}>*</button>

        <button className="btn" value="4" onClick={onClickFunction}>4</button>
        <button className="btn" value="5" onClick={onClickFunction}>5</button>
        <button className="btn" value="6" onClick={onClickFunction}>6</button>
        <button className="btn" value="-" onClick={onClickFunction}>-</button>

        <button className="btn" value="1" onClick={onClickFunction}>1</button>
        <button className="btn" value="2" onClick={onClickFunction}>2</button>
        <button className="btn" value="3" onClick={onClickFunction}>3</button>
        <button className="btn" value="+" onClick={onClickFunction}>+</button>

        <button className="btn zero" value="0" onClick={onClickFunction}>0</button>
        <button className="btn" value="." onClick={onClickFunction}>.</button>
        <button className="btn equal" onClick={calcularResultado}>=</button>
      </div>
    </div>
  );
}

export default App;
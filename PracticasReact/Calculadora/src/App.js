import { useState } from "react";
import './App.css';

function App() {
  // Estado para almacenar el valor mostrado en la calculadora
  const [valor, setValor] = useState("0");

  /**
   * Maneja los clics en los botones de la calculadora
   * @param {Event} event - Evento del botón presionado
   */
  const onClickFunction = (event) => {
    const input = event.target.value;

    // Si el valor actual es "Error", reinicia con el nuevo valor
    if (valor === "Error") {
      setValor(input);
      return;
    }

    // Si el valor actual es "0", evita concatenar ceros innecesarios
    if (valor === "0") {
      if (input === ".") {
        setValor("0."); // Permitir "0." como inicio de decimal
      } else {
        setValor(input);
      }
      return;
    }

    // Agregar el nuevo valor a la expresión existente
    setValor(valor + input);
  };

  /**
   * Valida si una expresión matemática es correcta antes de evaluarla
   * @param {string} exp - Expresión matemática a validar
   * @returns {boolean} - True si la expresión es válida, False si no lo es
   */
  const esExpresionValida = (exp) => {
    // Evitar operadores repetidos como "++" o "--"
    if (/[+*/-]{2,}/.test(exp)) return false;
    // Evitar operadores al final de la expresión
    if (/[+*/-]$/.test(exp)) return false;
    
    // Validar el balance de paréntesis
    let balance = 0;
    for (let char of exp) {
      if (char === "(") balance++;
      if (char === ")") balance--;
      if (balance < 0) return false;
    }
    return balance === 0;
  };

  /**
   * Evalúa la expresión matemática ingresada por el usuario
   */
  const calcularResultado = () => {
    if (!esExpresionValida(valor)) {
      setValor("Error"); // Si la expresión es inválida, mostrar "Error"
      return;
    }

    try {
      // Manejo de multiplicación implícita, por ejemplo: "2(3+4)" => "2*(3+4)"
      const expresionConMultiplicacionImplicita = valor
        .replace(/(\d|\))(?=\()/g, "$1*")
        .replace(/\)(?=\d)/g, ")*");
      
      // Evaluar la expresión de manera segura
      const resultado = Function(`"use strict"; return (${expresionConMultiplicacionImplicita})`)();
      setValor(resultado.toString());
    } catch (error) {
      setValor("Error"); // Capturar errores en la evaluación de la expresión
    }
  };

  /**
   * Reinicia la calculadora estableciendo el valor en "0"
   */
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

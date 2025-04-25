import React, { useState } from "react"; 
import validator from 'validator';

const App = () => { 

    const [errorMessage, setErrorMessage] = useState(''); 
    const [messageColor, setMessageColor] = useState(''); 

    const validate = (value) => { 

        if (validator.isStrongPassword(value, { 
            minLength: 8, minLowercase: 1, 
            minUppercase: 1, minNumbers: 1, minSymbols: 1 
        })) { 
            setErrorMessage('Is Strong Password'); 
            setMessageColor('green'); // Establecer el color verde
        } else { 
            setErrorMessage('Is Not Strong Password'); 
            setMessageColor('red'); // Establecer el color rojo
        } 
    } 

    return ( 
        <div style={{ 
            marginLeft: '200px', 
        }}> 
            <pre> 
                <h2>Checking Password Strength in ReactJS</h2> 
                <span>Enter Password: </span><input type="text"
                    onChange={(e) => validate(e.target.value)}></input> <br /> 
                {errorMessage === '' ? null : 
                    <span style={{ 
                        fontWeight: 'bold', 
                        color: messageColor, // Usar el color dinámico
                    }}>{errorMessage}</span>} 
            </pre> 
        </div> 
    ); 
} 

export default App;

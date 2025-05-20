import React, { useState, createContext } from 'react';
import App from './App';

// Create the context
export const multiStepContext = createContext();

function StepContext() {
  const [authEmail, setauthEmail] = useState("hassan@avcomm.ca");
  const [currentEmail,setcurrentEmail]=useState("")

  return (
    <multiStepContext.Provider value={{ 
        authEmail, setauthEmail,
        currentEmail,setcurrentEmail
         }}>
      <App />
    </multiStepContext.Provider>
  );
}

export default StepContext;

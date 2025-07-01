import React, { createContext, useState } from "react";

export const DarkModeProvider = createContext();

const DarkModeContext = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <DarkModeProvider.Provider value={{ isDarkMode, setIsDarkMode }}>
      {children}
    </DarkModeProvider.Provider>
  );
};

export default DarkModeContext;

import React, { createContext, useEffect, useState } from "react";

export const DarkModeProvider = createContext();

const DarkModeContext = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  return (
    <DarkModeProvider.Provider value={{ isDarkMode, setIsDarkMode }}>
      {children}
    </DarkModeProvider.Provider>
  );
};

export default DarkModeContext;

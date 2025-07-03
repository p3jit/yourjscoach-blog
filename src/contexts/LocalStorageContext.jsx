import React, { createContext, useState, useEffect } from "react";

export const LocalStorageProvider = createContext();

const LocalStorageContext = ({ children }) => {
  const [localUser, setLocalUser] = useState({});
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [progressMap, setProgressMap] = useState({});

  const updateLocalStorage = (data) => {
    localStorage.setItem('yjsUser', JSON.stringify(data));
  }

  
  useEffect(() => {
    let storedData = localStorage.getItem("yjsUser");
    if (storedData) {
      storedData = JSON.parse(storedData);
      setSolvedProblems(storedData.solvedProblems || []);
      setProgressMap(storedData.progressMap || {});
      setLocalUser(storedData);
    }
  }, []);

  return (
    <LocalStorageProvider.Provider value={{ localUser, setLocalUser, solvedProblems, setSolvedProblems, progressMap, setProgressMap, updateLocalStorage }}>
      {children}
    </LocalStorageProvider.Provider>
  );
};

export default LocalStorageContext;

import React, { createContext, useState } from "react";

export const ModalProvider = createContext();

const ModalContext = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <ModalProvider.Provider value={{ isModalOpen, setIsModalOpen }}>
      {children}
    </ModalProvider.Provider>
  );
};

export default ModalContext;

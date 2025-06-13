import React, { createContext, useState } from "react";

export const SidebarProvider = createContext();

const SidebarContext = ({ children }) => {
  // State to track if sidebar is open or closed
  const [isOpen, setIsOpen] = useState(false);

  // Toggle sidebar open/closed
  const toggleSidebar = () => {
    setIsOpen(prevState => !prevState);
  };

  // Open sidebar
  const openSidebar = () => {
    setIsOpen(true);
  };

  // Close sidebar
  const closeSidebar = () => {
    setIsOpen(false);
  };

  // Context value with all data and functions
  const contextValue = {
    isOpen,
    toggleSidebar,
    openSidebar,
    closeSidebar
  };

  return (
    <SidebarProvider.Provider value={contextValue}>
      {children}
    </SidebarProvider.Provider>
  );
};

export default SidebarContext;
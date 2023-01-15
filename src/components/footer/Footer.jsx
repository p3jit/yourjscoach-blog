import React from "react";
import { IconInfoCircle } from "@tabler/icons";

const Footer = ({ setIsModalOpen }) => {
  const toggleModalOpen = () => {
    setIsModalOpen(true);
  };
  return (
    <footer className="flex justify-between items-center w-full">
      <h1 className="text-slate-400 text-sm">Made with ❤️ in India</h1>
      <button
        className="bg-slate-300 hover:bg-slate-400 md:px-3 p-2 md:py-2 text-sm font-medium rounded text-gray-900 flex items-center gap-2"
        onClick={toggleModalOpen}
      >
        <IconInfoCircle
          size={"1.3em"}
          className="font-medium  text-slate-700"
        />
        About
      </button>
    </footer>
  );
};

export default Footer;

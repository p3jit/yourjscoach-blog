import { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import { Header } from "./components/header/header.jsx";
import Modal from "./components/modal/Modal.jsx";
import { DarkModeProvider } from "./contexts/DarkModeContext.jsx";
import { ModalProvider } from "./contexts/ModalContext.jsx";
import Error from "./pages/Error.jsx";
import Home from "./pages/Home.jsx";
import SinglePost from "./pages/SinglePost.jsx";
import { exampleFetch } from "./data/postData.js";
import { Post } from "./components/post/Post.jsx";
import { MdInfo } from "react-icons/md";

function App() {
  const { isModalOpen, setIsModalOpen } = useContext(ModalProvider);
  const { isDarkMode } = useContext(DarkModeProvider);

  const toggleModalOpen = () => {
    setIsModalOpen(true);
  };

  return (
    <div
      className={`font-roboto min-h-screen px-5 py-5 md:px-24 xl:px-40 2xl:px-[30em] flex flex-col gap-10 relative ${
        isDarkMode ? "bg-white" : "bg-slate-900"
      }`}
    >
      <Header setIsModalOpen={setIsModalOpen} />
      <Routes>
        <Route path="/404" element={<Error />}></Route>
        <Route path="/" element={<Home />}></Route>
        <Route path="/home" element={<Home />}></Route>
        <Route path="/test" element={<Post data={exampleFetch[0]} />}></Route>
        <Route path="/:id" element={<SinglePost />}></Route>
      </Routes>
      {isModalOpen ? <Modal setIsModalOpen={setIsModalOpen} /> : ""}
      <div className="flex justify-between items-center w-full">
        <h1 className="text-slate-400 text-sm">Made with ❤️ in India</h1>
        <button
          className="bg-slate-300 hover:bg-slate-400 md:px-3 p-2 md:py-2 text-sm font-medium rounded text-gray-900 flex items-center gap-2"
          onClick={toggleModalOpen}
        >
          <MdInfo className="text-sm font-medium  text-slate-700" />
          About
        </button>
      </div>
    </div>
  );
}

export default App;

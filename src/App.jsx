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

function App() {
  const { isModalOpen, setIsModalOpen } = useContext(ModalProvider);
  const { isDarkMode } = useContext(DarkModeProvider);

  return (
    <div
      className={`font-roboto min-h-screen px-5 py-5 md:px-20 xl:px-60 2xl:px-[23em] flex flex-col gap-10 relative ${
        isDarkMode ? "bg-white" : "bg-slate-800"
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
    </div>
  );
}

export default App;

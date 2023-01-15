import { useContext, lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { Header } from "./components/header/header.jsx";
import Modal from "./components/modal/Modal.jsx";
import { DarkModeProvider } from "./contexts/DarkModeContext.jsx";
import { ModalProvider } from "./contexts/ModalContext.jsx";
import { MdInfo } from "react-icons/md";
import { BiLoaderAlt } from "react-icons/bi";

const LazyError = lazy(() => import("./pages/Error"));
const LazyHome = lazy(() => import("./pages/Home.jsx"));
const LazySinglePost = lazy(() => import("./pages/SinglePost.jsx"));

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
      <Suspense
        fallback={
          <div className="flex flex-col h-screen justify-center items-center">
            <BiLoaderAlt className="animate-spin text-4xl" />
          </div>
        }
      >
        <Routes>
          <Route path="/404" element={<LazyError />}></Route>
          <Route path="/" element={<LazyHome />}></Route>
          <Route path="/home" element={<LazyHome />}></Route>
          <Route path="/:id" element={<LazySinglePost />}></Route>
        </Routes>
      </Suspense>

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

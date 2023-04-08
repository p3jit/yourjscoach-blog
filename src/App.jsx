import { useContext, Suspense, lazy } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Header } from "./components/header/header.jsx";
import { DarkModeProvider } from "./contexts/DarkModeContext.jsx";
import { ModalProvider } from "./contexts/ModalContext.jsx";
import Loader from "./components/loader/Loader.jsx";
import Footer from "./components/footer/Footer.jsx";
import Modal from "./components/modal/Modal.jsx";

const LazyError = lazy(() => import("./pages/Error"));
const LazyBLog = lazy(() => import("./pages/Blog.jsx"));
const LazySinglePost = lazy(() => import("./pages/SinglePost.jsx"));
const LazyDSASheet = lazy(() => import("./pages/DSASheet"));
const LazyHome = lazy(() => import("./pages/Home"));

function App() {
  const { isModalOpen, setIsModalOpen } = useContext(ModalProvider);
  const { isDarkMode } = useContext(DarkModeProvider);
  const location = useLocation();

  return (
    <div
      className={`w-full flex flex-col justify-center 2xl:items-center ${
        isDarkMode ? "bg-white" : "bg-slate-900"
      }`}
    >
      <div
        className={`font-sofia min-h-screen flex flex-col gap-10 relative tracking-tight py-[2vh] px-[6vw] 2xl:w-[65vw] min-w-[60vw] ${
          isDarkMode ? "bg-white" : "bg-slate-900"
        }`}
      >
        {location.pathname !== "/" ? <Header /> : ""}
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/404" element={<LazyError />}></Route>
            <Route path="/" element={<LazyHome />}></Route>
            <Route path="/blog" element={<LazyBLog />}></Route>
            <Route path="/:id" element={<LazySinglePost />}></Route>
            <Route path="/dsa" element={<LazyDSASheet />}></Route>
          </Routes>
        </Suspense>

        {isModalOpen ? (
          <Suspense fallback={<Loader />}>
            <Modal setIsModalOpen={setIsModalOpen} />
          </Suspense>
        ) : (
          ""
        )}
        {location.pathname !== "/" ? (
          <Footer setIsModalOpen={setIsModalOpen} />
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default App;

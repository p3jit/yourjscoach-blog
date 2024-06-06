import { useContext, Suspense, lazy } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Header } from "./components/header/header.jsx";
import { DarkModeProvider } from "./contexts/DarkModeContext.jsx";
import { ModalProvider } from "./contexts/ModalContext.jsx";
import Loader from "./components/loader/Loader.jsx";
import Footer from "./components/footer/Footer.jsx";
import Modal from "./components/modal/Modal.jsx";

const LazyError = lazy(() => import("./pages/Error"));
const LazyBlog = lazy(() => import("./pages/Blog.jsx"));
const LazySinglePost = lazy(() => import("./pages/SinglePost.jsx"));
const LazyEditor = lazy(() => import("./pages/Editor.jsx"));
const LazyPractice = lazy(() => import("./pages/Practice.jsx"));
// const LazyDSASheet = lazy(() => import("./pages/DSASheet"));
// const LazyHome = lazy(() => import("./pages/Home"));

function App() {
  const { isModalOpen, setIsModalOpen } = useContext(ModalProvider);
  const { isDarkMode } = useContext(DarkModeProvider);
  // const location = useLocation();

  return (
    <div
      className={`w-full flex flex-col justify-center 2xl:items-center ${
        isDarkMode ? "bg-white" : "bg-zinc-900"
      }`}
    >
      <div
        className={`font-sofia min-h-screen flex flex-col gap-10 relative tracking-tight py-[2vh] px-[6vw] 2xl:w-[90vw] min-w-[60vw] ${
          isDarkMode ? "bg-white" : "bg-zinc-900"
        }`}
      >
        {/* {location.pathname !== "/" ? <Header /> : ""} */}
        <Header />
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/404" element={<LazyError />}></Route>
            <Route path="/" element={<LazyBlog />}></Route>
            <Route path="/:id" element={<LazySinglePost />}></Route>
            <Route path="/editor" element={<LazyEditor />}></Route>
            <Route path="/practice" element={<LazyPractice />}></Route>
            {/* <Route path="/dsa" element={<LazyDSASheet />}></Route> */}
            {/* <Route path="/" element={<LazyHome />}></Route> */}
          </Routes>
        </Suspense>

        {isModalOpen ? (
          <Suspense fallback={<Loader />}>
            <Modal setIsModalOpen={setIsModalOpen} />
          </Suspense>
        ) : (
          ""
        )}
        <Footer setIsModalOpen={setIsModalOpen} />
      </div>
    </div>
  );
}

export default App;

import { useContext, Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { Header } from "./components/header/header.jsx";
import { DarkModeProvider } from "./contexts/DarkModeContext.jsx";
import { ModalProvider } from "./contexts/ModalContext.jsx";
import Loader from "./components/loader/Loader.jsx";
import Footer from "./components/footer/Footer.jsx";
import Modal from "./components/modal/Modal.jsx";

const LazyError = lazy(() => import("./pages/Error"));
const LazyHome = lazy(() => import("./pages/Home.jsx"));
const LazySinglePost = lazy(() => import("./pages/SinglePost.jsx"));

function App() {
  const { isModalOpen, setIsModalOpen } = useContext(ModalProvider);
  const { isDarkMode } = useContext(DarkModeProvider);

  return (
    <div
      className={`font-roboto min-h-screen px-5 py-5 md:px-16 lg:px-[8rem] xl:px-40 2xl:px-[26em] flex flex-col gap-10 relative ${
        isDarkMode ? "bg-white" : "bg-slate-900"
      }`}
    >
      <Header />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/404" element={<LazyError />}></Route>
          <Route path="/" element={<LazyHome />}></Route>
          <Route path="/home" element={<LazyHome />}></Route>
          <Route path="/:id" element={<LazySinglePost />}></Route>
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
  );
}

export default App;

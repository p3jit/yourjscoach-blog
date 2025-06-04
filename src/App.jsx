import { useContext, Suspense, lazy, Fragment } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Header } from "./components/header/header.jsx";
import { DarkModeProvider } from "./contexts/DarkModeContext.jsx";
import { ModalProvider } from "./contexts/ModalContext.jsx";
import Loader from "./components/loader/Loader.jsx";
import Modal from "./components/modal/Modal.jsx";

const LazyPages = {
  Error: lazy(() => import("./pages/Error")),
  Blog: lazy(() => import("./pages/Blog.jsx")),
  SinglePost: lazy(() => import("./pages/SinglePost.jsx")),
  Editor: lazy(() => import("./pages/Editor.jsx")),
  Practice: lazy(() => import("./pages/Practice.jsx")),
  DSASheet: lazy(() => import("./pages/DSASheet")),
};

const AppLayout = ({ children, isDarkMode, pathname }) => {
  const isPracticePage = pathname === "/practice";
  const containerClasses = isPracticePage
    ? "gap-5 min-w-[950px] overflow-hidden justify-center 2xl:items-center"
    : "gap-10 py-[3vh] 2xl:px-[20vw] lg:px-[10vw] px-[7vw] min-w-[56vw]";

  const themeClasses = isDarkMode ? "bg-white" : "bg-zinc-900";

  return (
    <div className={`w-full flex flex-col ${themeClasses} flex-1`}>
      <div
        className={`font-roboto h-full flex flex-col relative tracking-tight w-full ${containerClasses} ${themeClasses}`}
      >
        {children}
      </div>
    </div>
  );
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/blog" />} />
    <Route path="/blog" element={<LazyPages.Blog />} />
    <Route path="/blog/:id" element={<LazyPages.SinglePost />} />
    <Route path="/editor" element={<LazyPages.Editor />} />
    <Route path="/practice" element={<LazyPages.Practice />} />
    <Route path="/questions" element={<LazyPages.DSASheet />} />
    <Route path="/404" element={<LazyPages.Error />} />
    <Route path="*" element={<LazyPages.Error />} />
  </Routes>
);

const ModalContainer = ({ setIsModalOpen }) => (
  <Suspense fallback={<Loader />}>
    <Modal setIsModalOpen={setIsModalOpen} />
  </Suspense>
);

function App() {
  const { isModalOpen, setIsModalOpen } = useContext(ModalProvider);
  const { isDarkMode } = useContext(DarkModeProvider);
  const location = useLocation();

  return (
    <div className="w-full flex flex-col h-[100vh]">
      <Header />
      <AppLayout isDarkMode={isDarkMode} pathname={location.pathname}>
        <Suspense fallback={<Loader />}>
          <AppRoutes />
        </Suspense>

        {isModalOpen && <ModalContainer setIsModalOpen={setIsModalOpen} />}
      </AppLayout>
    </div>
  );
}

export default App;

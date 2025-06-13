import { useContext, Suspense, lazy } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Header } from "./components/header/header.jsx";
import Loader from "./components/loader/Loader.jsx";
import Modal from "./components/modal/Modal.jsx";
import { DarkModeProvider } from "./contexts/DarkModeContext.jsx";
import { ModalProvider } from "./contexts/ModalContext.jsx";
import { SidebarProvider } from "./contexts/SidebarContext.jsx";

const LazyPages = {
  Error: lazy(() => import("./pages/Error")),
  Blog: lazy(() => import("./pages/Blog.jsx")),
  SinglePost: lazy(() => import("./pages/SinglePost.jsx")),
  Editor: lazy(() => import("./pages/Editor.jsx")),
  Practice: lazy(() => import("./pages/Practice.jsx")),
  DSASheet: lazy(() => import("./pages/DSASheet")),
};

const AppLayout = ({ children, isDarkMode, pathname }) => {
  const isPracticePage = (() => location.pathname.includes("/practice/"))();
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
    <Route path="/" element={<Navigate to="/questions" />} />
    <Route path="/blog" element={<LazyPages.Blog />} />
    <Route path="/blog/:id" element={<LazyPages.SinglePost />} />
    <Route path="/editor" element={<LazyPages.Editor />} />
    <Route path="/practice/:id" element={<LazyPages.Practice />} />
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

const App = () => {
  const { isModalOpen, setIsModalOpen } = useContext(ModalProvider);
  const { isDarkMode } = useContext(DarkModeProvider);
  const { isOpen: isSidebarOpen, toggleSidebar } = useContext(SidebarProvider);
  const location = useLocation();

  return (
    <div className="w-full flex h-[100vh] relative">
      {isSidebarOpen && (
        <div className="flex w-full absolute z-50 h-full">
          <div className="bg-zinc-800 h-full w-3/12">sidebar</div>
          <div onClick={toggleSidebar} className="h-full w-9/12 relative right-0.5">
            backdrop
          </div>
        </div>
      )}
      <div className="flex flex-col z-0 w-full">
        <Header />
        <AppLayout isDarkMode={isDarkMode} pathname={location.pathname}>
          <Suspense fallback={<Loader />}>
            <AppRoutes />
          </Suspense>

          {isModalOpen && <ModalContainer setIsModalOpen={setIsModalOpen} />}
        </AppLayout>
      </div>
    </div>
  );
};

export default App;

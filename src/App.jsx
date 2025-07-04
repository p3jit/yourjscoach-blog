import { useContext, Suspense, lazy } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Header } from "./components/header/header.jsx";
import Loader from "./components/loader/Loader.jsx";
import Modal from "./components/modal/Modal.jsx";
import Sidebar from "./components/sidebar/Sidebar.jsx";
import { DarkModeProvider } from "./contexts/DarkModeContext.jsx";
import { ModalProvider } from "./contexts/ModalContext.jsx";
import { SidebarProvider } from "./contexts/SidebarContext.jsx";
import Footer from "./components/footer/Footer.jsx";
import Hero from "./components/hero/Hero.jsx";

const LazyPages = {
  Error: lazy(() => import("./pages/Error")),
  Blog: lazy(() => import("./pages/Blog.jsx")),
  SinglePost: lazy(() => import("./pages/SinglePost.jsx")),
  Editor: lazy(() => import("./pages/Editor.jsx")),
  Practice: lazy(() => import("./pages/Practice.jsx")),
  DSASheet: lazy(() => import("./pages/DSASheet")),
};

const AppLayout = ({ children, isDarkMode, pathname }) => {
  const isPracticePage = (() => pathname.includes("/practice/"))();
  const isPostPage = (() => pathname.includes("/blog") || pathname.includes("/sd"))();
  const containerClasses = returnContainerClasses();

  function returnContainerClasses() {
    if (isPracticePage) {
      return "gap-5 min-w-[1000px] overflow-hidden justify-center 2xl:items-center";
    }
    if (isPostPage) {
      return "gap-10 py-[5vh] 2xl:px-[23vw] lg:px-[20vw] px-[7vw] min-w-[56vw]";
    }
    return "gap-10 2xl:px-[19vw] lg:px-[10vw] px-[7vw] min-w-[56vw]";
  }

  const themeClasses = isDarkMode ? "bg-white" : "bg-zinc-900";

  return (
    <div className={`w-full flex flex-col ${themeClasses} flex-1 h-full`}>
      <div className={`font-roboto h-full flex flex-col relative tracking-tight ${containerClasses} ${themeClasses}`}>
        {children}
      </div>
    </div>
  );
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/problems" />} />
    <Route path="/blog" element={<LazyPages.Blog />} />
    <Route path="/blog/:id" element={<LazyPages.SinglePost />} />
    <Route path="/editor" element={<LazyPages.Editor />} />
    <Route path="/practice/:id" element={<LazyPages.Practice />} />
    <Route path="/problems" element={<LazyPages.DSASheet />} />
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
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
      <div className="flex flex-col z-0 w-full overflow-hidden">
        <Header />
        <div className="relative overflow-y-auto min-w-[400px] bg-zinc-900 flex-grow scrollbar scrollbar-thumb-zinc-800 scrollbar-track-zinc-900">
          {location.pathname == "/problems" && <Hero />}
          <AppLayout isDarkMode={isDarkMode} pathname={location.pathname}>
            <Suspense fallback={<Loader />}>
              <AppRoutes />
            </Suspense>
            {isModalOpen && <ModalContainer setIsModalOpen={setIsModalOpen} />}
          </AppLayout>
        </div>
      </div>
    </div>
  );
};

export default App;

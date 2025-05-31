import { useContext, Suspense, lazy } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Header } from "./components/header/header.jsx";
import { DarkModeProvider } from "./contexts/DarkModeContext.jsx";
import { ModalProvider } from "./contexts/ModalContext.jsx";
import Loader from "./components/loader/Loader.jsx";
import Modal from "./components/modal/Modal.jsx";

/**
 * Lazy-loaded page components to improve initial load performance
 */
const LazyPages = {
  Error: lazy(() => import("./pages/Error")),
  Blog: lazy(() => import("./pages/Blog.jsx")),
  SinglePost: lazy(() => import("./pages/SinglePost.jsx")),
  Editor: lazy(() => import("./pages/Editor.jsx")),
  Practice: lazy(() => import("./pages/Practice.jsx")),
  DSASheet: lazy(() => import("./pages/DSASheet")),
};

/**
 * AppLayout component that handles the main application layout and styling
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 * @param {boolean} props.isDarkMode - Current theme mode
 * @param {string} props.pathname - Current route path
 * @returns {JSX.Element} The AppLayout component
 */
const AppLayout = ({ children, isDarkMode, pathname }) => {
  // Determine layout classes based on current route
  const isPracticePage = pathname === "/practice";
  const containerClasses = isPracticePage
    ? "py-5 px-7 gap-5 min-w-[950px]"
    : "gap-10 py-[3vh] 2xl:px-[20vw] lg:px-[10vw] px-[7vw] min-w-[56vw]";

  const themeClasses = isDarkMode ? "bg-white" : "bg-zinc-900";

  return (
    <div className={`w-full flex flex-col justify-center 2xl:items-center ${themeClasses}`}>
      <div className={`font-roboto min-h-screen flex flex-col relative tracking-tight w-full ${containerClasses} ${themeClasses}`}>
        {children}
      </div>
    </div>
  );
};

/**
 * AppRoutes component that handles all application routing
 * @returns {JSX.Element} The AppRoutes component with all route definitions
 */
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

/**
 * ModalContainer component that handles modal rendering with suspense
 * @param {Object} props - Component props
 * @param {Function} props.setIsModalOpen - Function to control modal visibility
 * @returns {JSX.Element} The ModalContainer component
 */
const ModalContainer = ({ setIsModalOpen }) => (
  <Suspense fallback={<Loader />}>
    <Modal setIsModalOpen={setIsModalOpen} />
  </Suspense>
);

/**
 * Main App component that serves as the application entry point
 * @returns {JSX.Element} The App component
 */
function App() {
  const { isModalOpen, setIsModalOpen } = useContext(ModalProvider);
  const { isDarkMode } = useContext(DarkModeProvider);
  const location = useLocation();

  return (
    <AppLayout isDarkMode={isDarkMode} pathname={location.pathname}>
      <Header />
      <Suspense fallback={<Loader />}>
        <AppRoutes />
      </Suspense>
      
      {isModalOpen && <ModalContainer setIsModalOpen={setIsModalOpen} />}
    </AppLayout>
  );
}

export default App;

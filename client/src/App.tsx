import { Routes, Route, Link } from "react-router-dom";
import ArticleListPage from "./pages/ArticleListPage";
import ArticleDetailPage from "./pages/ArticleDetailPage";
import CreateArticlePage from "./pages/CreateArticlePage";
import EditArticlePage from "./pages/EditArticlePage";
import Status from "./components/Status";

export default function App() {
  return (
    <>
      <header className="site-header">
        <Link to="/" className="brand">Articles</Link>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<ArticleListPage />} />
          <Route path="/articles/new" element={<CreateArticlePage />} />
          <Route path="/articles/:articleId" element={<ArticleDetailPage />} />
          <Route path="/articles/:articleId/edit" element={<EditArticlePage />} />
          <Route path="*" element={<Status kind="empty">Page not found.</Status>} />
        </Routes>
      </main>
    </>
  );
}

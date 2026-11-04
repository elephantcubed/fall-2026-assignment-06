import { useNavigate } from "react-router-dom";
import * as api from "../api";
import ArticleForm from "../components/ArticleForm";

export default function CreateArticlePage() {
  const navigate = useNavigate();
  return (
    <section>
      <h1>New article</h1>
      <ArticleForm
        submitLabel="Publish article"
        onCancel={() => navigate("/")}
        onSubmit={async (data) => {
          const created = await api.createArticle(data);
          navigate(`/articles/${created.articleId}`);
        }}
      />
    </section>
  );
}

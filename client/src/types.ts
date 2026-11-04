export type Id = string | number;

export interface Article {
  articleId: number;
  title: string;
  contents: string;
}

export interface ArticleInput {
  title: string;
  contents: string;
}

export interface Comment {
  commentId: number;
  articleId: number;
  body: string;
}

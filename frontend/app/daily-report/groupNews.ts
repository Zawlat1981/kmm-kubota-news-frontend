interface CategorizedArticle {
  categoryText?: string;
  categoryTitle?: string;
}

const GROUPS = [
  "Kubota News",
  "Other Brand News",
  "Myanmar News",
  "General Price List",
  "Flood News",
] as const;

function getGroup(article: CategorizedArticle): (typeof GROUPS)[number] {
  const category = (article.categoryText || article.categoryTitle || "")
    .toLowerCase()
    .replace(/[-_]+/g, " ");

  if (category.includes("kubota")) return "Kubota News";
  if (category.includes("myanmar")) return "Myanmar News";
  if (category.includes("crop") || category.includes("fuel") || category.includes("exchange")) {
    return "General Price List";
  }
  if (category.includes("flood")) return "Flood News";
  return "Other Brand News";
}

export function groupNewsArticles<T extends CategorizedArticle>(articles: T[]) {
  return GROUPS.map((title) => ({
    title,
    articles: articles.filter((article) => getGroup(article) === title),
  })).filter((group) => group.articles.length > 0);
}

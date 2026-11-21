import assert from "node:assert/strict";
import test from "node:test";
import { groupNewsArticles } from "./groupNews.ts";

test("groups categories in report order while preserving article order", () => {
  const articles = [
    { id: 1, categoryText: "new-holland-news" },
    { id: 2, categoryText: "kubota-second-news" },
    { id: 3, categoryText: "Myanmar News" },
    { id: 4, categoryText: "crop-prices" },
    { id: 5, categoryText: "Kubota ZT News" },
    { id: 6, categoryText: "Fuel Price & News" },
    { id: 7, categoryText: "exchange-rates" },
    { id: 8, categoryText: "yammar-news" },
    { id: 9, categoryText: "flood-news" },
    { id: 10, categoryTitle: "Kubota News" },
  ];

  assert.deepEqual(
    groupNewsArticles(articles).map(({ title, articles: items }) => [
      title,
      items.map((item) => item.id),
    ]),
    [
      ["Kubota News", [2, 5, 10]],
      ["Other Brand News", [1, 8]],
      ["Myanmar News", [3]],
      ["General Prices & News", [4, 6, 7]],
      ["Flood News", [9]],
    ],
  );
});

test("omits empty groups and keeps uncategorized articles visible", () => {
  assert.deepEqual(groupNewsArticles([]), []);
  assert.deepEqual(groupNewsArticles([{ id: 1 }]), [
    { title: "Other Brand News", articles: [{ id: 1 }] },
  ]);
});

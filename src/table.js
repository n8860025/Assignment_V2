import { useState, useEffect } from "react";

export function useNewsArticles() {
  // TODO: implement this hook
  const [loading, setLoading] = useState(true);
  const [headlines, setHeadlines] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    getHeadlines()
      .then(headlines => {
        console.log(headlines);
        setHeadlines(headlines);
        setLoading(false);
      })
      .catch(e => {
        setError(e);
        setLoading(false);
      });
  }, []);

  /*
  const headlines = [
    { title: "Penguins take over", url: "http:news.com/penguins" },
    { title: "Fern is a good girl", url: "http:news.com/fern-good-girl" },
    {
      title: "Sock chewed: is Fern to blame?",
      url: "http:news.com/sock-chewed"
    },
    { title: "Woof woof and other news", url: "http:news.com/woof" }
  ];
  */

  return {
    loading,
    headlines,
    error: null
  };
}

function getHeadlines() {
  const url =
    "https://newsapi.org/v2/top-headlines?country=au&apiKey=" + API_KEY;

  return fetch(url)
    .then(res => res.json())
    .then(res => res.articles)
    .then(articles =>
      articles.map(article => ({
        title: article.title,
        url: article.url
      }))
    );
}

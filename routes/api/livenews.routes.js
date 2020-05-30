const express = require("express");
const router = express.Router();
const NewsAPI = require("newsapi");

const newsapi = new NewsAPI("e40f5912fc614c52af948466ad095ae0");

const Pusher = require("pusher");

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_APP_KEY,
  secret: process.env.PUSHER_APP_SECRET,
  cluster: process.env.PUSHER_APP_CLUSTER,
  useTLS: true,
});

function updateFeed(topic) {
  let counter = 2;
  if (counter < 10) {
    setInterval(() => {
      fetchNews(topic, counter)
        .then((response) => {
          pusher.trigger("news-channel", "update-news", {
            articles: response.articles,
          });
          counter += 1;
        })
        .catch((error) => console.log(error));
    }, 1000 * 60 * 3);
  }
}

const fetchNews = (searchTerm, pageNum) =>
  newsapi.v2.everything({
    q: searchTerm,
    language: "en",
    page: pageNum,
    pageSize: 5,
  });

router.get("/live", (req, res) => {
  const topic = "coronavirus";
  fetchNews(topic, 1)
    .then((response) => {
      res.json(response.articles);
      updateFeed(topic);
    })
    .catch((error) => console.log(error));
});

module.exports = router;

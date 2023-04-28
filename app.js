const express = require("express");
const RSSParser = require("rss-parser");
const mongoose = require("mongoose");
const parser = new RSSParser();
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));


// connect to the database
mongoose.connect('mongodb://127.0.0.1:27017',{useNewUrlParser: true,useUnifiedTopology: true})
    .then(() => console.log('Connected to MongoDB database'))
    .catch((error) => console.error('Error connecting to MongoDB database', error));
// define the news item model
    const newsItemSchema = new mongoose.Schema({
      title: String,
      link: String,
      pubDate: Date,
      description: String
    });
    const NewsItem = mongoose.model("NewsItem", newsItemSchema);
// method to save the news list to the database
async function saveNewsListToDB(newsList) {
  try {
    // loop through the news items and save them to the database
    for (let newsItem of newsList) {
      // check if the news item already exists in the database based on the link
      let existingNewsItem = await NewsItem.findOne({ link: newsItem.link });
      if (!existingNewsItem) {
        // if the news item does not exist, create a new document and save it to the database
        let newNewsItem = new NewsItem({
          title: newsItem.title,
          link: newsItem.link,
          pubDate: new Date(newsItem.pubDate),
          description: newsItem.description
        });
        await newNewsItem.save();
      }
    }
    console.log("News list saved to database.");
  } catch (error) {
    console.error(error);
  }
}



// Returning the production version
function getProductionVersion(versions) {
  let productionVersion = null;
  for (let i = 0; i < versions.length; i++) {
      let parts = versions[i].split("-");
      if (parts.length === 1) {
          productionVersion = parts[0];
      } else if (parts[parts.length - 1].match(/^\d+$/)) {
          productionVersion = parts.join("-");
          break;
      }
  }
  return "product version : " + productionVersion;
}


// RSS PARSE/SORT
app.get("/news", async (req, res) => {
  try {
    const sort = req.query.sort || "date-asc"; // default sorting by publication date ascending
    const feed = await parser.parseURL("https://rss.nytimes.com/services/xml/rss/nyt/World.xml");
    const newsList = feed.items;
    await saveNewsListToDB(newsList);
    const search = req.query.search;

    let items = feed.items;

    // filter by search keyword
    if (search) {
      items = items.filter(item => {
        return item.title.toLowerCase().includes(search.toLowerCase());
      });
    }

    // sorting by pubDate
    if (sort === "date-asc") {
      items.sort((a, b) => new Date(a.pubDate) - new Date(b.pubDate));
    } else if (sort === "date-desc") {
      items.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
    }

    // sorting by title
    if (sort === "title-asc") {
      items.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === "title-desc") {
      items.sort((a, b) => b.title.localeCompare(a.title));
    }

    res.render("index", { items, search });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while processing your request.");
  }
});
app.get("*", function (req,res){
  res.send("That route doesn't exist.")
})
app.listen(3000, () => {
  console.log("Server is listening on port 3000. Enter this URL in your browser : localhost:3000/news");
  console.log(getProductionVersion(["2.5.0-dev.1", "2.4.2-5354", "2.4.2-test.675", "2.4.1-integration.1"]))
});

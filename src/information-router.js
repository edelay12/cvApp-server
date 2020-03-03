const express = require("express");
const InformationRouter = express.Router();
const request = require("request");
const cheerio = require("cheerio");

InformationRouter.route("/").get((req, res, next) => {
  request(
    "https://www.cdc.gov/media/dpk/diseases-and-conditions/coronavirus/coronavirus-2020.html",
    (error, response, html) => {
      if (!error && response.statusCode == 200) {
        let data = [];
        const $ = cheerio.load(html);
        $("#Ul1 li")
          .find("a")
          .each((i, el) => {
            let link = $(el).attr("href");
            const title = $(el).html();
            let date = $(el)
              .next("span.item-pubdate")
              .html();
            if (link.startsWith("/media")) {
              link = "https://www.cdc.gov/" + link;
            }
            data = [
              ...data,
              { title: title, link: link, date: date, id: data.length }
            ];

            console.log(data.id);
          });

        res.send(data).status(200);
      } else {
      }
    }
  );
});

module.exports = InformationRouter;

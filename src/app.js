require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const InformationRouter = require("./information-router");
const request = require("request");
const cheerio = require("cheerio");

const app = express();

const morganOption = NODE_ENV === "production" ? "tiny" : "common";

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api/info", InformationRouter);

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

app.get("/api/data", (req, res, next) => {
  request(
    "https://www.worldometers.info/coronavirus/",
    (error, response, html) => {
      if (!error && response.statusCode == 200) {
        const $ = cheerio.load(html);

        let totalCases = $(".maincounter-number").text();
        console.log(totalCases);

        let values = totalCases.trim().split(" ");
        values = values.filter(el => {
          return el != "";
        });
        const cases = values[0];
        const deaths = values[1];
        const recovered = values[2];

        let sub = [];
        $(".number-table").each((i, el) => {
          const item = $(el)
            .text()
            .trim();
          sub = [...sub, item];
        });

        let main = [];
        $(".number-table-main").each((i, el) => {
          const item = $(el)
            .text()
            .trim();
          main = [...main, item];
        });

        const data = {
          cases: cases,
          deaths: deaths,
          recovered: recovered,
          a: main[0],
          c: main[1],
          aMild: sub[0],
          aSerious: sub[1],
          cMild: sub[2],
          cSerious: sub[3]
        };

        return res.json(data);
      }
    }
  );
});

module.exports = app;

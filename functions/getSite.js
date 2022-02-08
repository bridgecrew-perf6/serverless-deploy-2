const axios = require("axios");
const cheerio = require("cheerio");
require("dotenv").config();

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
};

exports.handler = async function (event, context) {
  let { ticker } = event.queryStringParameters;
  let tickerData = {
    price: "",
    percentage: "",
    ratings: { total: "", consensus: "" },
    ticker: ticker.toUpperCase(),
    dataAvailable: false,
    createdOn: new Date().toISOString(),
  };

  try {
    await axios
      .get(`https://www.tipranks.com/stocks/${ticker}/forecast`)
      .then((res) => {
        const html = res.data;
        const $ = cheerio.load(html);
        let potential = $("div.displayflex.fontSize10", html);
        if (potential.text()) {
          tickerData.ratings.consensus = $(
            "span.colorpale.fonth4_bold.aligncenter.w12"
          ).text();
          tickerData.ratings.total = $("g.override.fontSize6")
            .children()
            .first()
            .text();
          tickerData.dataAvailable = true;
          tickerData.price = potential
            .parent()
            .text()
            .split(`${potential.text()}`)[0];
          tickerData.percentage = potential.text().split("(")[1].split(")")[0];
        } else {
          tickerData.dataAvailable = false;
        }
      })
      .catch((err) => console.log(err));
  } catch (error) {
    return error;
  } finally {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(tickerData),
    };
  }
};

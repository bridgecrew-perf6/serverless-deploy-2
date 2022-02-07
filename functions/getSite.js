const axios = require("axios");
const cheerio = require("cheerio");
require("dotenv").config();

exports.handler = async function (event, context) {
  let title = "No Title Grabbed";
  try {
    await axios
      .get(`https://www.tipranks.com/stocks/sbux/forecast`)
      .then((res) => {
        const html = res.data;
        const $ = cheerio.load(html);
        title = $("h1", html).text();
      })
      .catch((err) => console.log(err));
  } catch (error) {
    return error;
  } finally {
    return { statusCode: 200, body: JSON.stringify({ title }) };
  }
};

const axios = require("axios");
const cheerio = require("cheerio");
require("dotenv").config();
const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
};
exports.handler = async function (event, context) {
  const { ticker } = JSON.parse(event.body);
  // if (event.httpMethod === "OPTIONS") {
  //   return {
  //     statusCode: 200,
  //     headers,
  //   };
  // }
  let title = "No Title Grabbed";
  try {
    await axios
      .get(`https://www.tipranks.com/stocks/${ticker}/forecast`)
      .then((res) => {
        const html = res.data;
        const $ = cheerio.load(html);
        title = $("h1", html).text();
      })
      .catch((err) => console.log(err));
  } catch (error) {
    return error;
  } finally {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ title }),
    };
  }
};

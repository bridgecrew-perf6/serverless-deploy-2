const chromium = require("chrome-aws-lambda");
const puppeteer = require("puppeteer-core");

exports.handler = async function (event, context) {
  let text = 1000;
  let browser;
  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath:
        process.env.CHROME_EXECUTABLE_PATH || (await chromium.executablePath),
      headless: true,
    });
    const page = await browser.newPage();
    await page.goto("https://www.tipranks.com/stocks/amc/forecast", {
      waitUntil: "load",
    });

    await page
      .waitForSelector("h1")
      .then((res) => {
        console.log("in eval");
      })
      .catch((err) => console.log(err));
  } catch (error) {
    console.log(error);
    return error;
  } finally {
    if (browser !== null) {
      console.log("finally");
      await browser.close();
    }
  }

  return { statusCode: 200, body: JSON.stringify({ text }) };
};

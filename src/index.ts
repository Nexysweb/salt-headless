import puppeteer from "puppeteer";

export const main = async (
  username: string,
  password: string,
  withScreenshot: boolean = false
) => {
  const makeScreenshot = async (idx: string) => {
    if (withScreenshot) {
      await page.screenshot({ path: "./out/t" + idx + ".png" });
    }
  };

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(
    "https://sessions.salt.ch/cas/login?service=https%3A//myaccount.salt.ch/en/&lang=en"
  );

  const fieldUsernameId = "#username";
  const fieldPasswordId = "#password";

  await page.$eval(
    fieldUsernameId,
    (el: any, value) => (el.value = value),
    username
  );
  await page.$eval(
    fieldPasswordId,
    (el: any, value) => (el.value = value),
    password
  );

  const btn = await page.$('input[type="submit"]');
  if (!btn) {
    console.log("could not find button");
  }

  await makeScreenshot("0");

  await btn?.click();
  await page.waitForNavigation({ waitUntil: "networkidle2" });
  await makeScreenshot("1");
  console.log("starts waiting");

  const btn2 = await page.$("span.icon-nav-user-logged-in");
  if (!btn2) {
    throw Error("could not find button");
  }

  await btn2.click();
  //await page.goto("https://myaccount.salt.ch/en/usage/");
  await makeScreenshot("2");

  const btn3 = await page.$("span.icon-usage");
  if (!btn3) {
    throw Error("could not find button");
  }

  await btn3.click();
  await makeScreenshot("3");
  await page.waitForNavigation({ waitUntil: "networkidle2" });
  await makeScreenshot("4");

  const el1 = await page.$(".lead");
  if (!el1) {
    throw Error("could not find element");
  }
  const text = await page.evaluate((element) => element.textContent, el1);

  console.log(parseOut(text));
  await browser.close();
};

const parseOut = (text: string) => {
  //console.log(text.split("\n"));
  const aText = text.split("\n");

  const phone = aText[1].trim();
  const subscription = aText[6].trim();
  const owner = aText[8].trim();
  const user = aText[10].trim();
  const balance = aText[14].trim();

  return { phone, owner, subscription, user, balance };
};

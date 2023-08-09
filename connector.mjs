#!/usr/bin/env node
import chalk from "chalk";
import { Builder, until, By } from "selenium-webdriver";
export async function connector(type, channel) {
  try {
    let SERVICE_URL = "http://localhost:8000/",
      SUCCESS_URL = "http://localhost:8000/test",
      QR_ELEMENT = "qr-code",
      WAITOUT_TIME = 15000,
      ATTRIBUTE_NAME = "src",
      LOCATOR = By.className(QR_ELEMENT);
    switch (type) {
      case "Discord": {
        SERVICE_URL = "https://discord.com/login";
        QR_ELEMENT = "qrCode-2R7t9S";
        WAITOUT_TIME = 15000;
        ATTRIBUTE_NAME = "innerHTML";
        SUCCESS_URL = "https://discord.com/channels/@me";
        LOCATOR = By.className(QR_ELEMENT);
        break;
      }
      case "Message": {
        SERVICE_URL = "https://messages.google.com/web/authentication";
        QR_ELEMENT = "qr-code";
        WAITOUT_TIME = 30000;
        ATTRIBUTE_NAME = "src";
        SUCCESS_URL = "https://messages.google.com/web/conversations";
        LOCATOR = By.className(QR_ELEMENT);
        break;
      }
      default: {
        break;
      }
    }
    const driver = new Builder().forBrowser("chrome").build();
    const socket = await driver.createCDPConnection("page");
    await driver.logMutationEvents(socket, async (event) => {
      try {
        if (event["attribute_name"] === ATTRIBUTE_NAME) {
          console.log(chalk.greenBright("[Status] - Got the qr code"));
          if (ATTRIBUTE_NAME == "src") {
            channel.postMessage({ src: event["current_value"] });
          }
        } else if (event["attribute_name"] == "class") {
          const div = await driver.findElement(By.className(QR_ELEMENT));
          if (div) {
            const svg = await div.findElement(By.css("svg"));
            const svgIMG = await svg.takeScreenshot();
            if (svgIMG) {
              console.log(chalk.greenBright("[Status] - Got the qr code"));
              channel.postMessage({
                src: "data:image/png;base64," + svgIMG,
              });
            }
          }
        }
      } catch (err) {
        console.log(err);
      }
    });
    // await driver.onLogEvent(socket, (event) => {
    //   if (event) {
    //     console.log(event);
    //     driver
    //       .getCurrentUrl()
    //       .then((link) => {
    //         console.log(link);
    //         if (link === SUCCESS_URL) {
    //           channel.postMessage({ exit: "0" });
    //           // driver.quit()
    //           // 	.then(() => exit(0))
    //           // 	.catch((e) => console.log(e));
    //         }
    //       })
    //       .catch((e) => console.log(e));
    //   }
    // });
    await driver.get(SERVICE_URL);
    await driver.wait(until.elementLocated(LOCATOR), WAITOUT_TIME);
  } catch (e) {
    console.log(e);
  }
}

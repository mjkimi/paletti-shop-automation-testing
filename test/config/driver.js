const { Builder, By, until } = require('selenium-webdriver');
const { expect } = require('chai');

const driver = new Builder().forBrowser('firefox').build();
// driver.manage().setTimeouts({ implicit: 10000 });
driver.manage().window().maximize();
const URL = 'https://mjkimi.github.io/paletti/';

class Driver {
  constructor() {
    globalThis.driver = driver;
    globalThis.By = By;
    globalThis.until = until;
    globalThis.expect = expect;
  }
  go_to_url(baseURL) {
    baseURL ? driver.get(baseURL) : driver.get(URL);
  }
  async wait_page_load() {
    const container = await driver.findElement(By.className('body-container'));
    await driver.wait(until.elementIsVisible(container), 5000);
  }
  quit() {
    driver.quit();
  }
}

module.exports = Driver;

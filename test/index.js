const menu = require('./suites/menu');
const buyChocolate = require('./suites/buyChocolate');
const chocolateLetter = require('./suites/chocolateLetter');
const cart = require('./suites/cart');
const Driver = require('./config/driver');

const driver = new Driver();

describe('Test suites for homepage https://mjkimi.github.io/paletti/', () => {
  beforeEach(async () => {
    // wait 1 sec before every test:
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('----------------------');
  });

  before(async function () {
    driver.go_to_url();
    await driver.wait_page_load();
  });

  after(() => {
    driver.quit();
  });

  describe('Slide menu', () => {
    menu.check();
  });
  describe('Chocolate', () => {
    buyChocolate.check();
  });
  describe('Chocolate letter', () => {
    chocolateLetter.check();
  });
  describe('Cart', () => {
    cart.check();
  });
});

const path = require('path');
const Driver = require('../config/driver');
const { scroll_into_view } = require('./buyChocolate');
const addContext = require('mochawesome/addContext');

class ChocolateLetter extends Driver {
  check() {
    it('message should type correctly', async function () {
      const sendingText = 'Happy birthday!';
      const sectionLetter = await driver.findElement(By.id('personalize'));

      scroll_into_view(sectionLetter);

      const messageInput = await driver.findElement(By.id('design-input'));
      await messageInput.sendKeys(sendingText);
      // Take a screenshot of chocolate letter:
      await driver.sleep(1000);
      await driver.takeScreenshot().then(function (image) {
        require('fs').writeFileSync(
          path.join(__dirname, '../results/screenshots', 'custom_letter.png'),
          image,
          'base64'
        );
      });

      // Expect correct typing on the chocolate:
      const chocoLetter = await driver
        .findElement(By.id('your-message'))
        .getText()
        .then((val) => val);

      addContext(this, '../screenshots/custom_letter.png');
      expect(chocoLetter).to.be.equal(sendingText);
    });

    it('should successfully be added to the cart', async () => {
      const HAPPY_PATH = [
        'John Doe',
        '1510 Main str',
        '454647',
        'NY',
        'United States',
      ];
      const nextBtn = await driver.findElement(By.id('next-form'));

      nextBtn.click();

      const form = await driver.findElement(By.id('receiver'));

      // Select all form required fields:
      const listOfElem = await form
        .findElements(
          By.xpath(
            '//div[contains(@class, "input-wrapper")]//*[self::input or self::select]'
          )
        )
        .then((formFields) => {
          formFields.forEach((field, index) => {
            field.getTagName().then((type) => {
              switch (type) {
                case 'input': // Fill in 'inputs'
                  let value = HAPPY_PATH[index - 1];
                  field.sendKeys(value);
                case 'select': // Choose 'select' option
                  field
                    .findElement(
                      By.xpath(
                        `option[normalize-space(text())="${HAPPY_PATH[4]}"]`
                      )
                    )
                    .click();
                  break;
              }
            });
          });
        });

      const requiredMsg = await form
        .findElement(By.xpath('//form/h4[contains(@class, "required")]'))
        .getCssValue('visibility')
        .then((val) => val);

      const addToCartBtn = await form.findElement(
        By.xpath('//form//button[@id="add-to-cart"]')
      );

      addToCartBtn.click();

      expect(requiredMsg).to.be.equal('hidden');
    });
  }
}

module.exports = new ChocolateLetter();

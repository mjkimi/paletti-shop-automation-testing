const Driver = require('../config/driver');

class BuyChocolate extends Driver {
  scroll_into_view(place) {
    driver.executeScript('arguments[0].scrollIntoView(true);', place);
  }

  check() {
    let cart, cartClasses, chocoDataId;

    it(' "Buy now" function executes correctly', async () => {
      // Scroll chocolate colection into view:
      const sectionShop = await driver.findElement(By.id('shop'));
      this.scroll_into_view(sectionShop);

      // Buy 1st chocolate in a collection:
      const buyNowBtn = await driver.findElement(
        By.xpath('//button[contains(@class, "buy-now") and @data-id="1"]')
      );

      buyNowBtn.click();
      chocoDataId = '@data-id="1"';
      const btnText = await driver
        .findElement(
          By.xpath(
            `//button[contains(@class, "buy-now") and ${chocoDataId}]/span`
          )
        )
        .getText()
        .then((val) => val.toLowerCase());

      cart = await driver.findElement(By.className('cart'));
      cartClasses = await cart.getAttribute('class').then((val) => val);

      // -----------------Expect----------------:
      // 'btn attr disabled'
      expect(
        await buyNowBtn.getAttribute('disabled').then((val) => JSON.parse(val))
      ).to.be.true;
      // 'spanText = in cart'
      expect(btnText).to.equal('in cart');
      // 'cart is open'
      expect(cartClasses).to.include('showCart');
      // ----------------------------------------
    });

    it('from collection should successfully be added to the cart', async () => {
      const success = await cart.findElements(
        By.xpath(`//span[${chocoDataId}]`)
      );
      expect(success.length).to.be.above(0);

      // Close cart:
      await driver.findElement(By.xpath('//body')).click();
    });
  }
}

module.exports = new BuyChocolate();

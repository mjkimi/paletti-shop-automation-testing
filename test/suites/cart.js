const Driver = require('../config/driver');

class Cart extends Driver {
  check() {
    let firstItem, priceFooter;
    // all cart items
    const cartItems = async () =>
      await driver.findElements(By.xpath('//div[@class = "cart-item"]'));

    async function getAmount() {
      const text = await firstItem.findElement(
        By.xpath('//p[@class = "item-amount"]')
      );
      return text.getText();
    }

    let defaultAmount = 1;
    function clickCalc(numberOfClicks, action, increase = false) {
      for (let i = 0; i < numberOfClicks; i++) {
        action.click();
        if (increase) {
          defaultAmount++;
        } else {
          defaultAmount--;
        }
      }
      return defaultAmount;
    }

    it('item should increase the amount by pressing + button', async () => {
      firstItem = await cartItems().then((val) => val[0]);
      // + :
      const increase = await firstItem.findElement(
        By.xpath('//i[contains(@class, "fa-plus")]')
      );

      // -----Quantity increase (+2):
      const clickedAmountPlus = clickCalc(2, increase, true);
      // get the amount of items after increasing quantity(clicking) and turn it into number value:
      const quantityPlus = Number(await getAmount());
      expect(quantityPlus).to.equal(clickedAmountPlus);
    });

    it('item should decrease the amount by pressing - button', async () => {
      const decrease = await firstItem.findElement(
        By.xpath('//i[contains(@class, "fa-minus")]')
      );
      // -----Quantity decrease (-1):
      const clickedAmountMinus = clickCalc(1, decrease);
      const quantityMinus = Number(await getAmount());
      expect(quantityMinus).to.equal(clickedAmountMinus);
    });

    it('sum of prices should be equal to total', async () => {
      const sum = await driver.executeScript(() => {
        // Select ALL chocolates in the cart:
        const allItems = Array.from(
          document.getElementsByClassName('cart-item')
        );
        // Get the prices & amounts:
        const sumArr = allItems.map((item) => {
          const priceText = item.querySelector('.price').innerText;
          const price = Number(priceText.replace('$', ''));

          const amount = Number(item.querySelector('.item-amount').innerText);

          return amount * price;
        });
        // Return calculated sum of items:
        return sumArr.reduce((a, b) => a + b, 0);
      });

      // Get the total price:
      priceFooter = await driver.findElement(By.className('cart-footer'));
      const totalPriceText = await priceFooter
        .findElement(By.className('cart-total'))
        .getText();
      const totalPrice = Number(totalPriceText.replace('$', ''));

      expect(sum).to.equal(totalPrice);
    });
    it('remove item button functions correctly', async () => {
      // remove
      const removeBtn = await firstItem.findElement(
        By.className('remove-item')
      );
      const chocoId = await removeBtn.getAttribute('data-id');

      removeBtn.click();
      await driver.wait(until.stalenessOf(removeBtn));

      const cartContent = await driver.findElement(
        By.className('cart-content')
      );
      const removedChoco = await cartContent.findElements(
        By.xpath(`//span[@data-id=${chocoId}]`)
      );

      expect(removedChoco.length).to.equal(0);
    });
    it('clear all button functions correctly', async () => {
      const clearBtn = await priceFooter.findElement(
        By.className('clear-cart')
      );
      clearBtn.click();

      await driver.wait(until.stalenessOf(firstItem));
      const emptyCart = await cartItems().then((el) => el.length);
      expect(emptyCart).to.equal(0);
    });

    // total sum-------------------------------------------------

    // clear cart
  }
}

module.exports = new Cart();

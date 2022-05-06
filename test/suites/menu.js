const Driver = require('../config/driver');

class Menu extends Driver {
  check() {
    let menuBtn, menu;
    it('should slide in when clicking menu button', async () => {
      // Open slide menu:
      menuBtn = await driver.findElement(By.id('main-menu-btn'));
      menuBtn.click();
      // Find class 'show' in menu:
      menu = await driver.findElement(
        By.xpath('//div[contains(@class, "side-menu")]')
      );
      const menuClasses = await menu.getAttribute('class').then((val) => val);

      expect(menuClasses).to.include('show');
    });

    it('should close when close button clicked', async () => {
      // // Close button:
      await driver.findElement(By.id('btn-close')).click();
      const menuClasses = await menu.getAttribute('class').then((val) => val);

      expect(menuClasses).to.not.include('show');
    });

    it('should navigate to a link', async function () {
      // 3rd link in slideMenu & its navigated div:
      const linkPckg = await driver.findElement(
        By.xpath('//ul[@class="menu-nav"]/li[3]/a')
      );
      const pckg = await driver.findElement(By.id('packaging'));

      menuBtn.click();
      linkPckg.click();

      await driver.wait(until.elementIsVisible(pckg));

      // Linked packaging section:
      // Check if element is in viewport after clicking a link:
      await driver
        .executeScript(() => {
          const divPckg = document.getElementById('packaging');
          const rect = divPckg.getBoundingClientRect();
          return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <=
              (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <=
              (window.innerWidth || document.documentElement.clientWidth)
          );
        })
        .then((result) => {
          expect(result).to.be.true;
        });
    });
  }
}

module.exports = new Menu();

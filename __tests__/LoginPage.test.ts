import { Browser, Builder, By, until, WebDriver } from "selenium-webdriver";

let driver: WebDriver;

beforeAll(async () => {
  // using edge bcos chrome sucks ass
  driver = await new Builder().forBrowser(Browser.EDGE).build();
});

afterAll(async () => {
  if (driver) {
    await driver.quit();
  }
});

describe("Login Page", () => {
  it("should redirect to superadmin after login", async () => {
    await driver.get("http://localhost:3000/login");
    await driver.findElement(By.id("email")).sendKeys("dti.produkta@gmail.com");
    await driver.findElement(By.id("password")).sendKeys("ProdukTa@DTI2025");
    await driver.findElement(By.id("login-button")).click();

    await driver.wait(until.urlIs("http://localhost:3000/superadmin"), 10000);
  });
});

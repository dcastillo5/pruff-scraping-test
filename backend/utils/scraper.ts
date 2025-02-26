import Chromium from "@sparticuz/chromium";
import puppeteer, { Browser, ElementHandle, Page } from "puppeteer-core";
import { property } from "../handlers/getProperties";

export const scrapePropertiesFromWebsite = async (URL: string, take: number, skip: number) => {
  const browser: Browser = await puppeteer.launch({
    args: Chromium.args,
    defaultViewport: Chromium.defaultViewport,
    executablePath: await Chromium.executablePath(),
    headless: Chromium.headless,
  });

  const page: Page = await browser.newPage();
  await page.goto(URL);

  await page.waitForSelector(".dpp-loader", { hidden: true });

  const { propertiesWrapper, hasMoreProperties } = await scrapeProperties(page, take + skip);
  const properties: property[] = await getPropertiesData(propertiesWrapper, take, skip);

  await page.close();
  await browser.close();

  return { hasMoreProperties, properties };
};

const scrapeProperties = async (page: Page, totalPropertiesToScrape: number) => {
  let propertiesWrapper: ElementHandle<HTMLDivElement>[] = await page.$$("#properties-wrapper > div");
  let loadMoreButton: ElementHandle<Element> | null = await page.$("#dpp-more");
  let hasMoreProperties: boolean = await hasMorePropertiesToLoad(page);

  while (loadMoreButton) {
    const propertiesLength: number = propertiesWrapper.length;
    if (propertiesLength >= totalPropertiesToScrape) break;

    hasMoreProperties = await hasMorePropertiesToLoad(page);
    if (!hasMoreProperties) break;

    await loadMoreButton.click();
    await page.waitForSelector(".dpp-loader", { hidden: true });

    loadMoreButton = await page.$("#dpp-more");
    propertiesWrapper = await page.$$("#properties-wrapper > div");
  }
  return { hasMoreProperties, propertiesWrapper };
};

const hasMorePropertiesToLoad = async (page: Page) => {
  const loadMoreButton: ElementHandle<Element> | null = await page.$(".dpp-pagination-wrapper");
  if (!loadMoreButton) return false;
  const isVisible: boolean = await loadMoreButton.evaluate((el) => {
    return window.getComputedStyle(el).display !== "none";
  });
  return isVisible;
};

const getPropertiesData = async (allProperties: ElementHandle<HTMLDivElement>[], take: number, skip: number) => {
  const selectedProperties: ElementHandle<HTMLDivElement>[] = allProperties.slice(skip, skip + take);

  const propertiesData: property[] = [];

  for (const property of selectedProperties) {
    const propertyData: property | undefined = await getPropertyData(property);
    if (propertyData) propertiesData.push(propertyData);
  }

  return propertiesData;
};

const getPropertyData = async (property: ElementHandle<HTMLDivElement>) => {
  const title = await getElementAttribute(property, ".dpp-title", "innerText");
  if (!title) return undefined;
  const place = await getElementAttribute(property, ".dpp-place", "innerText");
  const href = await getElementAttribute(property, "a", "href");
  const img = await getElementAttribute(property, "img", "src");
  const details = await getElementAttribute(property, ".dpp-details", "innerText");
  const priceUF = await getElementAttribute(property, ".price.uf", "innerText");
  const priceCL = await getElementAttribute(property, ".price.cl", "innerText");
  const sold = (await getElementAttribute(property, ".dpp-price-medium > small", "innerText")) ? true : false;

  return { place, href, img, title, details, priceUF, priceCL, sold } as property;
};

const getElementAttribute = async (
  parentElement: ElementHandle<HTMLDivElement>,
  querySelector: string,
  attribute: string
) => {
  const element = await parentElement.$(querySelector);
  if (!element) return undefined;
  return await element.evaluate((el, attr) => (el as any)[attr].trim(), attribute);
};

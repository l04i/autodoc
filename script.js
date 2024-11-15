const puppeteer = require("puppeteer");
const sqlite3 = require("sqlite3").verbose();

(async () => {
  const scrapeCategory = async (page, url) => {
    await page.goto(url, { waitUntil: "load", timeout: 60000 });

    const data = await page.evaluate(() => {
      const categoryDetails = [];

      const subCategoryEls = document.querySelectorAll(
        "#main > section:nth-child(4) > div > nav > ul > li, #main > div.section.wrap.mt-3.mt-md-4.mt-lg-5 > div > nav > ul > li"
      );

      subCategoryEls.forEach((subCategoryEl) => {
        const subCategoryId = subCategoryEl
          .querySelector("a")
          ?.getAttribute("data-category-id");
        const subCategoryName = subCategoryEl
          .querySelector("a")
          ?.textContent.trim();
        const subCategoryLink = subCategoryEl
          .querySelector("a")
          ?.getAttribute("href");
        const subCategoryImageUrl = subCategoryEl
          .querySelector("img")
          ?.getAttribute("src");

        categoryDetails.push({
          subCategoryId,
          subCategoryName,
          subCategoryLink,
          subCategoryImageUrl,
          items: [],
        });
      });

      return categoryDetails;
    });

    return data;
  };

  const scrapeCategoryWithItems = async (page) => {
    const categories = [];

    const categoryElements = await page.evaluate(() => {
      const categoryElements = document.querySelectorAll(
        "#main > section:nth-child(4) > div > ul > li"
      );
      const categories = [];

      categoryElements.forEach((categoryEl) => {
        const id = categoryEl.querySelector(".catalog-items")?.id;
        const name = categoryEl
          .querySelector(".catalog-items__parent-name")
          ?.textContent.trim();
        const imageUrl = categoryEl.querySelector(
          ".catalog-items__parent-img img"
        )?.src;
        const link = categoryEl
          .querySelector(".catalog-items__parent > a")
          ?.getAttribute("href");

        // Check if the category has items or nested subcategories
        const itemEls = categoryEl.querySelectorAll(
          ".catalog-items__tooltip-link"
        );

        const hasItems = itemEls.length > 0;

        categories.push({
          categoryId: id,
          categoryName: name,
          categoryImageUrl: imageUrl,
          categoryLink: link,
          items: hasItems
            ? Array.from(itemEls).map((itemEl) => ({
                itemId: itemEl.getAttribute("data-category-id"),
                itemName: itemEl
                  .querySelector("span:last-child")
                  ?.textContent.trim(),
                itemLink: itemEl.getAttribute("data-link"),
                itemImageUrl: itemEl.querySelector("img")?.getAttribute("src"),
              }))
            : [], // Empty if subcategories exist
          SubCategories: hasItems ? [] : null, // Null initially for nested scraping
        });
      });

      return categories;
    });

    // Fetch subcategories for categories without items
    for (const category of categoryElements) {
      if (category.SubCategories === null && category.categoryLink) {
        const subCategories = await scrapeCategory(page, category.categoryLink);
        category.SubCategories = subCategories;

        // Fetch items for each subcategory
        for (const subCategory of category.SubCategories) {
          if (subCategory.subCategoryLink) {
            const subCategoryItems = await scrapeCategory(
              page,
              subCategory.subCategoryLink
            );
            subCategory.items = subCategoryItems.map((item) => ({
              itemId: item.itemId,
              itemName: item.itemName,
              itemLink: item.itemLink,
              itemImageUrl: item.itemImageUrl,
            }));
          }
        }
      }
    }

    return categoryElements;
  };

  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    const baseUrl = "https://www.autodoc.co.uk";
    const relativeUrl = "/car-parts";
    const fullUrl = new URL(relativeUrl, baseUrl).href;

    await page.goto(fullUrl, { waitUntil: "load", timeout: 60000 });

    const categories = await scrapeCategoryWithItems(page);

    console.log("Scraped Data:", JSON.stringify(categories, null, 2));

    // Save data to SQLite database
    const db = new sqlite3.Database("categories_with_subcategories.db");

    db.serialize(() => {
      db.run(`
           CREATE TABLE IF NOT EXISTS categories (
             id INTEGER PRIMARY KEY AUTOINCREMENT,
             category_id TEXT NOT NULL,
             name TEXT NOT NULL,
             image_url TEXT,
             link TEXT
           )
         `);

      db.run(`
           CREATE TABLE IF NOT EXISTS category_items (
             id INTEGER PRIMARY KEY AUTOINCREMENT,
             category_id INTEGER NOT NULL,
             item_id TEXT NOT NULL,
             name TEXT NOT NULL,
             link TEXT,
             image_url TEXT,
             FOREIGN KEY (category_id) REFERENCES categories(id)
           )
         `);

      db.run(`
           CREATE TABLE IF NOT EXISTS subcategories (
             id INTEGER PRIMARY KEY AUTOINCREMENT,
             category_id INTEGER NOT NULL,
             subcategory_id TEXT NOT NULL,
             name TEXT NOT NULL,
             image_url TEXT,
             link TEXT,
             FOREIGN KEY (category_id) REFERENCES categories(id)
           )
         `);

      db.run(`
           CREATE TABLE IF NOT EXISTS subcategory_items (
             id INTEGER PRIMARY KEY AUTOINCREMENT,
             subcategory_id INTEGER NOT NULL,
             item_id TEXT NOT NULL,
             name TEXT NOT NULL,
             link TEXT,
             image_url TEXT,
             FOREIGN KEY (subcategory_id) REFERENCES subcategories(id)
           )
         `);

      categories.forEach((category) => {
        db.run(
          `INSERT INTO categories (category_id, name, image_url, link) VALUES (?, ?, ?, ?)`,
          [
            category.categoryId,
            category.categoryName,
            category.categoryImageUrl,
            category.categoryLink,
          ],
          function (err) {
            if (err) return console.error(err);

            const categoryId = this.lastID;

            category.items.forEach((item) => {
              db.run(
                `INSERT INTO category_items (category_id, item_id, name, link, image_url) VALUES (?, ?, ?, ?, ?)`,
                [
                  categoryId,
                  item.itemId,
                  item.itemName,
                  item.itemLink,
                  item.itemImageUrl,
                ]
              );
            });

            category.SubCategories.forEach((subCategory) => {
              db.run(
                `INSERT INTO subcategories (category_id, subcategory_id, name, image_url, link) VALUES (?, ?, ?, ?, ?)`,
                [
                  categoryId,
                  subCategory.subCategoryId,
                  subCategory.subCategoryName,
                  subCategory.subCategoryImageUrl,
                  subCategory.subCategoryLink,
                ],
                function (err) {
                  if (err) return console.error(err);

                  const subCategoryId = this.lastID;

                  subCategory.items.forEach((item) => {
                    db.run(
                      `INSERT INTO subcategory_items (subcategory_id, item_id, name, link, image_url) VALUES (?, ?, ?, ?, ?)`,
                      [
                        subCategoryId,
                        item.itemId,
                        item.itemName,
                        item.itemLink,
                        item.itemImageUrl,
                      ]
                    );
                  });
                }
              );
            });
          }
        );
      });
    });

    console.log("Data saved to the database successfully!");

    db.close();
    await browser.close();
  } catch (error) {
    console.error("Error occurred:", error);
  }
})();

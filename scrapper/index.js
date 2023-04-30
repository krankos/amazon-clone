import puppeteer from "puppeteer-core";
import autoScroll from "./autoScroll.js";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

async function bestSellers() {
    // it will take some time to run so just wait
    let browser;

    try {
        const USERNAME = 'brd-customer-hl_441b5a29-zone-scraping_browser';
        const PASSWORD = process.env.PASSWORD;
        const auth = `${USERNAME}:${PASSWORD}` ;


        browser = await puppeteer.connect({
            browserWSEndpoint: `wss://${auth}@zproxy.lum-superproxy.io:9222`,
        });

        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(2*60*1000);

        await page.goto('https://www.amazon.com/Best-Sellers/zgbs');

        // const selector ='.a-carousel';
        // await page.waitForSelector(selector);
        // const el = await page.$(selector)

        // const text = await el?.evaluate((el) => el.innerHTML);

        // console.log(text);

        const productsData= await page.evaluate(() => {
            const products = Array.from(document.querySelectorAll('.a-carousel-card'));
            return products.map(product => {
                const titleElement = product.querySelector('.p13n-sc-truncate-desktop-type2');
                const priceElement = product.querySelector('._cDEzb_p13n-sc-price_3mJ9Z');
                const imageElement = product.querySelector('.a-dynamic-image');
                const ratingElement = product.querySelector('.a-icon-alt');
                // const categoryElement = product.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.previousElementSibling.querySelector('h2');
                // console.log(product);
                return {
                    // category: categoryElement ? categoryElement.innerText.trim() : null,
                    image: imageElement ? imageElement.src : null,
                    title: titleElement ? titleElement.innerText.trim() : null,
                    price: priceElement ? priceElement.innerText.trim() : null,
                    rating: ratingElement ? {
                            text: ratingElement.innerText.trim(),
                            value: parseInt(ratingElement.innerText.trim().split(' ')[0]),
                        } : null,
                }
            })
        })
        console.log(productsData);
        console.log (productsData.length)
        return;
    }
    catch (e) {
        console.error('scrape failed',e);
    }
    finally {
        await browser?.close();
}
}

async function scrapeProducts(url,pages,category) {
    // it will take some time to run so just wait
    let browser;

    try {
        const USERNAME = 'brd-customer-hl_441b5a29-zone-scraping_browser';
        const PASSWORD = process.env.PASSWORD;
        const auth = `${USERNAME}:${PASSWORD}` ;


        browser = await puppeteer.connect({
            browserWSEndpoint: `wss://${auth}@zproxy.lum-superproxy.io:9222`,
        });

        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(2*60*1000);

        await page.goto(url);
        await page.setViewport({
        width: 1920,
        height: 1080
    });

        await autoScroll(page);
        await page.screenshot({ path: `screenshots-${category}-${Math.random(1000)}.png`,
        fullPage: true });

        // const selector ='.a-carousel';
        // await page.waitForSelector(selector);
        // const el = await page.$(selector)

        // const text = await el?.evaluate((el) => el.innerHTML);

        // console.log(text);

const productsData= await page.evaluate((category) => {
            const products = Array.from(document.querySelectorAll('.p13n-sc-uncoverable-faceout'));
            return products.map(product => {
                const titleElement = product.querySelector('._cDEzb_p13n-sc-css-line-clamp-3_g3dy1');
                const priceElement = product.querySelector('._cDEzb_p13n-sc-price_3mJ9Z');
                const imageElement = product.querySelector('.a-dynamic-image');
                const ratingElement = product.querySelector('.a-icon-alt');

                return {
                    category,
                    image: imageElement ? imageElement.src : null,
                    title: titleElement ? titleElement.innerText.trim() : null,
                    price: priceElement ? priceElement.innerText.trim() : null,
                    rating: ratingElement ? {
                            text: ratingElement.innerText.trim(),
                            value: parseFloat(ratingElement.innerText.trim().split(' ')[0]),
                        } : null,
                }
            })
        }, category)
        // console.log(productsData);

        for (let index = 1; index < pages; index++) {
            await page.goto(`${url}/ref=zg_bs_pg_${index+1}?_encoding=UTF8&pg=${index+1}`);
            await page.setViewport({
        width: 1920,
        height: 1080
    });
            await autoScroll(page);
            await page.screenshot({ path: `screenshots-${category}-${Math.random(1000)}.png`,
        fullPage: true });
            const productsData2= await page.evaluate((category) => {
                const products = Array.from(document.querySelectorAll('.p13n-sc-uncoverable-faceout'));
                return products.map(product => {
                    const titleElement = product.querySelector('._cDEzb_p13n-sc-css-line-clamp-3_g3dy1');
                    const priceElement = product.querySelector('._cDEzb_p13n-sc-price_3mJ9Z');
                    const imageElement = product.querySelector('.a-dynamic-image');
                    const ratingElement = product.querySelector('.a-icon-alt');

                    return {
                        category: category,
                        image: imageElement ? imageElement.src : null,
                        title: titleElement ? titleElement.innerText.trim() : null,
                        price: priceElement ? priceElement.innerText.trim() : null,
                        rating: ratingElement ? {
                            text: ratingElement.innerText.trim(),
                            value: parseFloat(ratingElement.innerText.trim().split(' ')[0]),
                        } : null,
                    }
                })
            }, category)
            productsData.push(...productsData2);

            
        }
        // console.log(productsData);
        // console.log (productsData.length)
        // console.log('scrapping done')
        return productsData;
    }
    catch (e) {
        console.error('scrape failed',e);
    }
    finally {
        await browser?.close();
}
}



// bestSellers();
// const categories = [
//   {url: 'https://www.amazon.com/Best-Sellers-Electronics/zgbs/electronics', name: 'Electronics'},
//   {url: 'https://www.amazon.com/Best-Sellers-Clothing-Shoes-Jewelry/zgbs/fashion', name: 'Fashion'},
//   {url: 'https://www.amazon.com/Best-Sellers-Kitchen-Dining/zgbs/kitchen', name: 'Kitchen'},
//   {url: 'https://www.amazon.com/Best-Sellers-Beauty/zgbs/beauty', name: 'Beauty'},
//   {url: 'https://www.amazon.com/Best-Sellers-Automotive/zgbs/automotive', name: 'Automotive'},
//   {url: 'https://www.amazon.com/Best-Sellers-Computers-Accessories/zgbs/pc', name: 'Computers & Accessories'}
// ];

// const products = await Promise.all(categories.map(async category => {
//   const products = await scrapeProducts(category.url, 2, category.name);
//   return products;
// }));
const electronics = await scrapeProducts('https://www.amazon.com/Best-Sellers-Electronics/zgbs/electronics', 2, 'Electronics');
const fashion = await scrapeProducts('https://www.amazon.com/Best-Sellers-Clothing-Shoes-Jewelry/zgbs/fashion', 2, 'Fashion');
const kitchen = await scrapeProducts('https://www.amazon.com/Best-Sellers-Kitchen-Dining/zgbs/kitchen', 2, 'Kitchen');
const beauty = await scrapeProducts('https://www.amazon.com/Best-Sellers-Beauty/zgbs/beauty', 2, 'Beauty');
const automotive = await scrapeProducts('https://www.amazon.com/Best-Sellers-Automotive/zgbs/automotive', 2, 'Automotive');
const computers = await scrapeProducts('https://www.amazon.com/Best-Sellers-Computers-Accessories/zgbs/pc', 2, 'Computers & Accessories');

const products = [electronics, fashion, kitchen, beauty, automotive, computers].flat();
// save products to json file
fs.writeFileSync('products.json',JSON.stringify(await products));

console.log((await products.flat()).length);

// async function fullScrollTest() {
//     // it will take some time to run so just wait
//     let browser;

//     try {
//         const USERNAME = 'brd-customer-hl_441b5a29-zone-scraping_browser';
//         const PASSWORD = process.env.PASSWORD;
//         const auth = `${USERNAME}:${PASSWORD}` ;
//         const url = 'https://www.amazon.com/Best-Sellers-Electronics/zgbs/electronics';
// browser = await puppeteer.connect({
//             browserWSEndpoint: `wss://${auth}@zproxy.lum-superproxy.io:9222`,
//         });
//         const page = await browser.newPage();
//         page.setDefaultNavigationTimeout(2*60*1000);
//         await page.goto('https://www.amazon.com/Best-Sellers-Electronics/zgbs/electronics');
//         await page.setViewport({ width: 1200, height: 800 });

//         await autoScroll(page);

//         await page.screenshot({ path: 'screenshot.png',
//         fullPage: true });

//         return;
//     }
//     catch (e) {
//         console.error('scrape failed',e);
//     }
//     finally {
//         await browser?.close();
// }
// }



// fullScrollTest();


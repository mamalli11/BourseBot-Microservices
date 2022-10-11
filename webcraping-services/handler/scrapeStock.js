const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

class scrapeStock {
    async scrapeListing(page) {
        try {
            await page.goto("https://rahavard365.com/stock");
            const html = await page.content();
            const $ = await cheerio.load(html);

            const list = $("table > tbody > tr").map((index, element) => {
                const titleElement = $(element).find(".symbol");
                const symbol = $(titleElement).text();
                const url = "https://rahavard365.com" + $(titleElement).attr("href");

                const market = $(element)[0].childNodes[3].children[0].data;

                const dateElement = $(element).find('[data-type="date-time-data"]');
                const date = new Date($(dateElement).attr("data-order"));

                const percentElement = $(element).find('[data-type="real-close-price-change-percent-data"]');
                const percent = $(percentElement).attr("data-order");

                const changeElement = $(element).find('[data-type="real-close-price-change-data"]');
                const change = $(changeElement).attr("data-order");

                const priceElement = $(element).find('[data-type="real-close-price-data"]');
                const price = $(priceElement).attr("data-order");

                const volumeElement = $(element).find('[data-type="volume-data"]');
                const volume = $(volumeElement).attr("data-order");

                const valueElement = $(element).find('[data-type="value-data"]');
                const value = $(valueElement).attr("data-order");

                const openPriceElement = $(element).find('[data-type="open-price-data"]');
                const openPrice = $(openPriceElement).attr("data-order");

                const highPriceElement = $(element).find('[data-type="high-price-data"]');
                const highPrice = $(highPriceElement).attr("data-order");

                const lowPriceElement = $(element).find('[data-type="low-price-data"]');
                const lowPrice = $(lowPriceElement).attr("data-order");

                const askVolumeElement = $(element).find('[data-type="ask-volume"]');
                const askVolume = $(askVolumeElement).attr("data-order");

                const askPriceElement = $(element).find('[data-type="ask-price"]');
                const askPrice = $(askPriceElement).attr("data-order");

                const bidPriceElement = $(element).find('[data-type="bid-price"]');
                const bidPrice = $(bidPriceElement).attr("data-order");

                const bidVolumeElement = $(element).find('[data-type="bid-volume"]');
                const bidVolume = $(bidVolumeElement).attr("data-order");

                return {
                    symbol,
                    url,
                    market,
                    date,
                    percent,
                    change,
                    volume,
                    value,
                    openPrice,
                    highPrice,
                    lowPrice,
                    askVolume,
                    askPrice,
                    bidPrice,
                    bidVolume,
                    price,
                };
            }).get();

            return list;
        } catch (error) {
            console.error(error);
        }
    }
    async scrapeItem(page, listing, body) {
        try {
            console.log(body._id, " > ", body.url);

            const { pushToQueue } = require("../config/rabbitmq");

            await page.goto(body.url);
            const html = await page.content();
            const $ = await cheerio.load(html);

            const strategy = $("#main-gauge-text").text();
            const buyerNumberPerson = this.toEnglish($(".personbuyercount").text());
            const sellerNumberPerson = this.toEnglish($(".personsellercount").text());
            const volumeBuyerPerson = this.toEnglish($(".personbuyvolume").attr("title"));
            const volumeSellerPerson = this.toEnglish($(".personsellvolume").attr("title"));

            let stock = listing.find((item) => item.url === body.url);

            stock.volumeSellerPerson = volumeSellerPerson;
            stock.volumeBuyerPerson = volumeBuyerPerson;
            stock.sellerNumberPerson = sellerNumberPerson;
            stock.buyerNumberPerson = buyerNumberPerson;
            stock.strategy = strategy;
            stock._id = body._id;

            console.log(`symbol: : ${stock.symbol} , id => ${stock._id} Sended To DB-Services ✔`);
            await pushToQueue("DB_BOT", { Request: "Scraping", Type: "Update", Body: stock });

        } catch (err) {
            console.error(err);
        }
    }
    toEnglish(persianNumber) {
        try {
            if (persianNumber == undefined) { return null }
            const pn = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹", "٬", "٫"];
            const en = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "", "."];
            let cache = persianNumber;
            for (let i = 0; i < 12; i++) {
                let reg_fa = new RegExp(pn[i], "g");
                cache = cache.replace(reg_fa, en[i]);
            }
            return cache;
        } catch (error) {
            console.log(error);
        }
    }
    async main(body) {
        try {
            const browser = await puppeteer.launch({ headless: false });
            const page = await browser.newPage();
            const listing = await this.scrapeListing(page);
            await this.scrapeItem(page, listing, body);
            await browser.close();
        } catch (err) {
            console.error(err);
        }
    }
}

module.exports = { ScrapeStock: new scrapeStock() };

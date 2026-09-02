const puppeteer = require("puppeteer");

class KickNotifications {
  constructor() {}

  async init() {
    if (!this.page) {
      let browser = await puppeteer.launch();
      let page = await browser.newPage();
      await page.setExtraHTTPHeaders({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
      });
      await page.goto("https://kick.com/api/v2/channels/elraenn", { waitUntil: "networkidle2" });
      this.page = page;
      return true;
    } else {
      return false;
    }
    process.on("exit", async() => {
        await browser.close()
    })
  }

  async getStream(streamer) {
    await this.init();
    const pg = await this.page.evaluate(async (channel) => {
      const response = await fetch('https://kick.com/api/v2/channels/' + channel + "/livestream", { method: "GET" });
      return await response.text();
    }, streamer);
    try {
      const data = JSON.parse(pg);
      if (data?.data && data?.data !== null) {
        return data.data;
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  }

  getStreamerValue(message) {
    const kickUrlPattern = /^https:\/\/kick\.com\/([\w-]+)$/;
    const simpleMessagePattern = /^[\w-]+$/;

    const kickUrlMatch = message.match(kickUrlPattern);

    if (kickUrlMatch) {
        return kickUrlMatch[1];
    } else if (simpleMessagePattern.test(message)) {
        return message;
    } else {
        return null;
    }
  }

  async getStreamer(user) {
    if (!user) throw TypeError("Please write user");
    await this.init();
    try {
      const pg = await this.page.evaluate(async (channel) => {
        const response = await fetch('https://kick.com/api/v2/channels/' + channel, { method: "GET" });
        return await response.text();
      }, user);
      try {
        const data = JSON.parse(pg);
        if (data && data?.id) {
          return data;
        } else {
          return null;
        }
      } catch (err) {
        return null;
      }
    } catch (err) {
      console.log(err);
      return null;
    }
  }
}

module.exports = KickNotifications;
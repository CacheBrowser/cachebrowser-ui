
export default class GettingStartedBrowserCtrl {
  constructor(browserStats) {
    this.browserStats = browserStats
    this.selectedBrowser = null

    this.stepNumber = 1
    this.allowSkip = false
    this.continue = false
  }

  selectBrowser(browser) {
    if (browser == 'firefox') {
      this.browserStats.browser = this.browserStats.FIREFOX
    } else if (browser == 'chrome') {
      this.browserStats.browser = this.browserStats.CHROME
    }

    this.selectedBrowser = browser
    this.continue = true
  }
}


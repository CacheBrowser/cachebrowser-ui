

class BrowserService {
  constructor(storage) {
    this.storage = storage

    this.FIREFOX = 'firefox'
    this.CHROME = 'chrome'

    this.browserName = null
    this.pluginInstalled = null
    this.certInstalled = null


    this.load()
  }

  get browser() {
    return this.browserName
  }

  set browser(value) {
    this.browserName = value
    this.save()
  }

  get isPluginInstalled() {
    return this.pluginInstalled
  }

  set isPluginInstalled(value) {
    this.pluginInstalled = value
    this.save()
  }

  get isCertInstalled() {
    return this.certInstalled
  }

  set isCertInstalled(value) {
    this.certInstalled = value
    this.save()
  }

  load() {
    const self = this
    this.storage.get('browser#name', value => { self.browserName = value })
    this.storage.get('browser#pluginInstalled', value => { self.pluginInstalled = value })
    this.storage.get('browser#certInstalled', value => { self.certInstalled = value })
  }

  save() {
    this.storage.set('browser#name', this.browser)
    this.storage.set('browser#pluginInstalled', this.pluginInstalled)
    this.storage.set('browser#certInstalled', this.certInstalled)
  }
}

export var SERVICE_NAME = "browserStats"
export var SERVICE = BrowserService
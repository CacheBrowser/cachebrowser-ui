
export default class SettingsScramblerCtrl {
  constructor($scope, storage, ipc) {
    this.storage = storage
    this.scope = $scope
    this.ipc = ipc

    this.overheadValueBuf = 0
    this.settingsLoaded = false

    this.settings = {}
    this.loadSettings()
  }

  onInitialSettingsLoaded() {
    const self = this
    this.scope.$watch(() => this.settings, () => {
      self.saveSettings()
    }, true)

    this.overheadValueBuf = this.settings.overhead
  }

  loadSettings() {
    const self = this

    this.ipc.request('/scrambler/get/settings')
    .then(result => {
      console.log(result)
      this.settings = result.settings

      if (!self.settingsLoaded) {
        this.onInitialSettingsLoaded()
      }
      self.settingsLoaded = true
    })
    .catch(() => {
      if (!this.settingsLoaded) {
        this.storage.get('settings#scrambler', settings => {
          if (settings) {
            self.settings = settings
          }
        })
      }
    })
  }

  saveSettings() {
    this.storage.set('settings#scrambler', this.settings)
    this.ipc.request('/scrambler/set/settings', this.settings)
  }

  overheadSliderReleased() {
    this.settings.overhead = this.overheadValueBuf
    this.scope.$apply()
  }
}

export class SettingsCtrl {
  constructor() {
    this.currentTab = 'scrambler'

  }

  changeTab(tab) {
    this.currentTab = tab
  }
}
import { installRootCert, getCertFilePath } from '../../../common/cert'
import * as _ from 'lodash'

export default class GettingStartedCertCtrl {
  constructor($scope, browserStats, ipc) {
    this.browserStats = browserStats
    this.ipc = ipc

    this.stepNumber = 3
    this.allowSkip = true
    this.continue = false

    this.state = 'none'
    this.apply = _.bind($scope.$apply, $scope)
  }

  install() {
    if (this.browserStats.browser == this.browserStats.FIREFOX) {
      this.installOnFirefox()
    } else {
      this.installOnSystem()
    }
  }

  installOnFirefox() {
    // let timedout = false
    const self = this
    self.continue = true
    self.state = 'firefox-help'
    return this.ipc.request('/browser/open', {url: 'file://' + getCertFilePath()})
      .then(() => {
        console.log("AHA")
      })
  }

  installOnSystem() {
    const self = this

    installRootCert()
      .then(() => {
        self.continue = true
        self.state = 'success'
        self.apply()
      }).catch(() => {
      self.state = 'error'
      self.apply()
    })
  }
}
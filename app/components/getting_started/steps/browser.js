import { error } from 'loglevel'
import * as _ from 'lodash'

import { installChromeExtension } from '../../../common/browser/chrome'
import { installFirefoxExtension } from '../../../common/browser/firefox'

export default class GettingStartedBrowserPluginCtrl {
  constructor($uibModal, $document) {
    this.modal = $uibModal
    this.document = $document

    this.stepNumber = 1
    this.allowSkip = true
    this.continue = false
  }

  promptInstall(browser) {
    const self = this
    this.modal.open({
      controller: PluginInstallPromptCtrl,
      controllerAs: '$$',
      templateUrl: 'promptTemplate',
      backdrop: false,
      appendTo: this.document.find('#p-getting-started').eq(0),
      resolve: {
        browser: () => browser
      }
    }).result.then(() => {
      self.continue = true
    })
  }
}

class PluginInstallPromptCtrl {
  constructor($uibModalInstance, browser, $scope) {
    this.modal = $uibModalInstance
    this.browser = browser

    this.state = 'none'
    this.stateMessage = ''

    this.apply = _.bind($scope.$apply, $scope)
  }

  install() {
    if (this.browser.toLowerCase() == 'chrome') {
      this.installChrome()
    } else if (this.browser.toLowerCase() == 'firefox') {
      this.installFirefox()
    }
  }

  installChrome() {
    const self = this
    self.state = 'loading'
    self.stateMessage = 'Installing Chrome Extension...'

    installChromeExtension()
      .then(() => {
        self.state = 'success'
        self.stateMessage = 'Extension successfully installed, please restart Chrome.'
        self.apply()
      }).catch((err) => {
        self.state = 'error'
        self.stateMessage = err
        self.apply()
        error(err)
      })
  }

  installFirefox() {
    const self = this
    self.state = 'loading'
    self.stateMessage = 'Downloading plugin...'

    let install = installFirefoxExtension()
    install.on('downloadComplete', () => {
      self.stateMessage = 'Opening Firefox...'
      self.apply()
    })
    install.on('firefoxOpened', () => {
      self.state = 'success'
      self.stateMessage = 'Please continue installation in Firefox'
      self.apply()

    })
    install.on('error', err => {
      self.state = 'error'
      self.stateMessage = err
      self.apply()
      error(err)
    })
  }
}
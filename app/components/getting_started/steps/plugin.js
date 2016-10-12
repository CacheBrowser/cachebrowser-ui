import { error } from 'loglevel'
import * as _ from 'lodash'

import { installChromeExtension } from '../../../common/browser/chrome'
import { installFirefoxExtension } from '../../../common/browser/firefox'

export default class GettingStartedBrowserPluginCtrl {
  constructor($uibModal, $document, $scope, browserStats) {
    this.modal = $uibModal
    this.document = $document
    this.browserStats = browserStats

    this.stepNumber = 2
    this.allowSkip = true
    this.continue = false

    this.state = 'none'
    this.stateMessage = ''
    this.apply = _.bind($scope.$apply, $scope)
  }

  promptInstall(browser) {
    this.modal.open({
      controller: PluginInstallPromptCtrl,
      controllerAs: '$$',
      templateUrl: 'promptTemplate',
      backdrop: false,
      appendTo: this.document.find('#p-getting-started').eq(0),
      resolve: {
        browser: () => browser
      }
    }).result.then(result => {
      if (result == 'yes') {
        this.install()
      }
    })
  }

  install() {
    if (this.browserStats.browser == this.browserStats.CHROME) {
      this.installChrome()
    } else if (this.browserStats.browser == this.browserStats.FIREFOX) {
      this.installFirefox()
    } else {
      this.stateMessage = 'Could not detect selected browser'
      this.state = 'error'
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
        self.continue = true
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
      self.continue = true
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

class PluginInstallPromptCtrl {
  constructor($uibModalInstance, browser) {
    this.modal = $uibModalInstance
    this.browser = browser
  }

  install() {
    this.modal.close('yes')
  }
}
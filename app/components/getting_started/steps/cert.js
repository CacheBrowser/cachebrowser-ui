import { installRootCert } from '../../../common/cert'
import * as _ from 'lodash'

export default class GettingStartedCertCtrl {
  constructor($scope) {
    this.stepNumber = 2
    this.allowSkip = true
    this.continue = false

    this.state = 'none'
    this.apply = _.bind($scope.$apply, $scope)
  }

  install() {
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
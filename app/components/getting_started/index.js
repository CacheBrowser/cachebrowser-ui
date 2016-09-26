import GettingStartedBrowserPluginCtrl from './steps/browser.js'
import GettingStartedCertCtrl from './steps/cert.js'
import GettingStartedFinishCtrl from './steps/finish.js'

export const CONTROLLERS = [
  GettingStartedBrowserPluginCtrl,
  GettingStartedCertCtrl,
  GettingStartedFinishCtrl
]

export const ROUTES = [
  { path: '/getting_started', controller:"GettingStartedBrowserPluginCtrl",
    controllerAs: "$$", template: 'steps/browser.html'},
  { path: '/getting_started/1', controller:"GettingStartedBrowserPluginCtrl",
    controllerAs: "$$", template: 'steps/browser.html'},
  { path: '/getting_started/2', controller:"GettingStartedCertCtrl",
    controllerAs: "$$", template: 'steps/cert.html'},
  { path: '/getting_started/3', controller:"GettingStartedFinishCtrl",
    controllerAs: "$$", template: 'steps/finish.html'}
]

import GettingStartedBrowserCtrl from './steps/browser.js'
import GettingStartedBrowserPluginCtrl from './steps/plugin.js'
import GettingStartedCertCtrl from './steps/cert.js'
import GettingStartedFinishCtrl from './steps/finish.js'

export const CONTROLLERS = [
  GettingStartedBrowserCtrl,
  GettingStartedBrowserPluginCtrl,
  GettingStartedCertCtrl,
  GettingStartedFinishCtrl
]

export const ROUTES = [
  { path: '/getting_started', controller:"GettingStartedBrowserCtrl",
    controllerAs: "$$", template: 'steps/browser.html'},
  { path: '/getting_started/1', controller:"GettingStartedBrowserCtrl",
    controllerAs: "$$", template: 'steps/browser.html'},
  { path: '/getting_started/2', controller:"GettingStartedBrowserPluginCtrl",
    controllerAs: "$$", template: 'steps/plugin.html'},
  { path: '/getting_started/3', controller:"GettingStartedCertCtrl",
    controllerAs: "$$", template: 'steps/cert.html'},
  { path: '/getting_started/4', controller:"GettingStartedFinishCtrl",
    controllerAs: "$$", template: 'steps/finish.html'}
]

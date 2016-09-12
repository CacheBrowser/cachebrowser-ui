import { ChromeCtrl, FirefoxCtrl } from './controllers'

export const CONTROLLERS = [ ChromeCtrl, FirefoxCtrl ]

export const ROUTES = [
    { path: '/browser/chrome', controller:"ChromeCtrl", template: 'chrome.html'},
    { path: '/browser/firefox', controller:"FirefoxCtrl", template: 'firefox.html'}
]
import { ChromeCtrl } from './controllers'

export const CONTROLLERS = [ ChromeCtrl ]

export const ROUTES = [
    { path: '/browser/chrome', controller:"ChromeCtrl", template: 'chrome.html'}
]
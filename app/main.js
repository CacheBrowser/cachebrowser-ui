// eslint-disable-next-line
var electron = require('electron') // Dont use import syntax for this

import {WINDOWS, OSX, LINUX, isPlatform, UnsupportedPlatform} from './common/platform'
import * as log from 'loglevel'

// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow


log.setLevel("debug")

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Check Platform
  if (!isPlatform(WINDOWS, LINUX, OSX)) {
    throw new UnsupportedPlatform()
  }

  if (isPlatform(WINDOWS, LINUX)) {
    mainWindow = new BrowserWindow({width: 650, height: 450, frame: 'false'})
  } else if(isPlatform(OSX)) {
    mainWindow = new BrowserWindow({width: 650, height: 450, titleBarStyle: 'hidden'})
  }

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`)

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})
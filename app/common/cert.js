import { spawn } from 'child_process'
import { info, error } from 'loglevel'
import * as path from 'path'

import {isPlatform, WINDOWS, OSX, LINUX} from './platform'

export function installRootCert() {
  if (isPlatform(OSX)) {
    return installRootCertOsX()
  } else if (isPlatform(WINDOWS)) {
    return installRootCertWindows()
  } else if (isPlatform(LINUX)) {
    return installRootCertLinux()
  }
}

export function getCertFilePath() {
  const homeDir = process.env['HOME']
  if (isPlatform(OSX)) {
    return path.join(homeDir, '.mitmproxy/mitmproxy-ca-cert.pem')
  }
}

function installRootCertOsX() {
  info("Installing root certificate")

  return new Promise((resolve, reject) => {
    const proc = spawn('security', ['add-trusted-cert', getCertFilePath()])

    proc.stdout.on('data', data => {
      info(data.toString())
    })

    proc.stderr.on('data', data => {
      error(data.toString())
    })

    proc.on('close', code => {
      if (code == 0) {
        resolve()
      } else {
        reject()
      }
    })
  })
}

function installRootCertWindows() {

}

function installRootCertLinux() {

}


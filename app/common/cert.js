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

function installRootCertOsX() {
  const homeDir = process.env['HOME']

  info("Installing root certificate")

  return new Promise((resolve, reject) => {
    const proc = spawn('security', ['add-trusted-cert', path.join(homeDir, '.mitmproxy/mitmproxy-ca-cert.pem')])

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


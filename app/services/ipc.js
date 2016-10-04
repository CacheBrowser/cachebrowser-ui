import Reconnector from '../common/websocket'
import { info, debug, error } from 'loglevel'
import * as _ from 'lodash'

class IPCService {
    constructor($rootScope, $q) {
        this.rootScope = $rootScope
        this.Q = $q

        var ws = new WebSocket("ws://127.0.0.1:9000")
        this.sock = new Reconnector(ws)

        this.listeners = {}
        this.nextListenerId = 1

        this.pendingRequests = {}
        this.nextRequestId = 1

        this.sock.on('open', () => {
           debug("connected")
           this.emit('connect')
        })

        this.sock.on('close', (code, reason) => {
            debug("connection lost", reason)
            this.emit('disconnect', code, reason)
        })

        this.sock.on('message', (data) => {
            var message = JSON.parse(data)
            this.onmessage(message)
        })

        this.sock.on('error', () => {
            error("ERROR ")
        })

        this.sock.on('connecting', () => {
            debug("connecting")
        })
    }

    emit(event) {
        var args = ['ipc/' + event]
        args = args.concat(Array.prototype.slice.call(arguments))
        this.rootScope.$broadcast.apply(this.rootScope, args)
    }

    onmessage(message) {
        var messageType = message.type

        if (messageType == 'pub') {
            var data = message.message
            var channel = message.channel
            this.handle_publish(channel, data)

        } else if (messageType == 'rpc_resp') {
            this.onresponse(message)
        }
    }


    subscribe(channel, callback) {
        if (!this.listeners[channel]) {
            this.listeners[channel] = {}
        }

        var id = this.nextListenerId++
        this._subscribe(channel, id, callback)

        var handler = () => {
            this._unsubscribe(channel, id)
        }

        return handler
    }

    unsubscribe(handler) {
        handler()
    }

    _subscribe(channel, id, callback) {
        info("Subscribed to " + channel)
        this.listeners[channel][id] = callback
        this.sendMessage({
            type: 'sub',
            channel: channel,
            subscription_id: id
        })
    }

    _unsubscribe(channel, id) {
        info("Unsubscribed from " + channel)
        delete this.listeners[channel][id]
        this.sendMessage({
            type: 'unsub',
            channel: channel,
            subscription_id: id
        })
    }

    handle_publish(channel, message) {
        _.each(this.listeners[channel], function(callback) {
            callback(message, channel)
        })
    }

    publish(channel, message) {
        this.sendMessage({
            type: 'pub',
            channel: channel,
            message: message
        })
    }

    request(route, params) {
        const self = this

        var defered = this.Q.defer()

        var id = this.nextRequestId++

        var message = {
            type: 'rpc_req',
            method: route,
            params: params,
            request_id: id
        }

        this.sendMessage(message, () => {
            self.pendingRequests[id] = {
                message: message,
                defered: defered
            }
        }, () => {
            defered.reject()
        })

        return defered.promise
    }

    onresponse(message) {

        var id = message.request_id
        var response = message.message

        var request = this.pendingRequests[id]
        delete this.pendingRequests[id]

        var defered = request.defered
        defered.resolve(response)
    }

    ping() {
        return this.request('/ping')
    }

    sendMessage(message, success, fail) {
        var realSend = () => {
            this.sock.send(JSON.stringify(message))
            if (success) {
                success()
            }
        }

        if (this.sock.readyState != WebSocket.OPEN) {
            this.sock.forceReconnect()

            var open = () => {
                this.sock.removeListener('open', open)
                this.sock.removeListener('close', close)
                process.nextTick(realSend)
            }

            var close = () => {
                this.sock.removeListener('open', open)
                this.sock.removeListener('close', close)
                if (fail) {
                    fail()
                }
            }

            this.sock.once('open', open)
            this.sock.once('close', close)
        } else {
            realSend()
        }
    }

    refreshDelay() {
        this.sock.refreshDelay()
    }
}

export var SERVICE_NAME = "ipc"
export var SERVICE = IPCService

import * as _ from 'lodash';
import Reconnector from '../common/websocket';

class IPCService {
    constructor($rootScope, $q) {
        this.rootScope = $rootScope;
        this.Q = $q;

        var ws = new WebSocket("ws://127.0.0.1:9000");
        this.sock = new Reconnector(ws);

        this.listeners = {};
        this.nextListenerId = 1;

        this.pendingRequests = {};
        this.nextRequestId = 1;

        this.sock.on('open', () => {
           console.debug("connected");
           this.emit('connect');
        });

        this.sock.on('close', (code, reason) => {
            console.debug("connection lost", reason);
            this.emit('disconnect', code, reason);
        });

        this.sock.on('message', (data) => {
            var message = JSON.parse(data);
            this.onmessage(message)
        });

        this.sock.on('error', (err) => {
            console.error("ERROR ");
        });

        this.sock.on('connecting', () => {
            console.debug("connecting");
        });
    }

    emit(event) {
        var args = ['ipc/' + event];
        args = args.concat(Array.prototype.slice.call(arguments));
        this.rootScope.$broadcast.apply(this.rootScope, args);
    }

    onmessage(message) {
        var messageType = message.message_type;

        if (messageType == 'publish') {
            var data = message.data;
            var channel = message.channel;
            this.publish(channel, data);

        } else if (messageType == 'response') {
            this.onresponse(message);
        }
    }


    subscribe(channel, callback) {
        if (!this.listeners[channel]) {
            this.listeners[channel] = {};
        }

        var id = this.nextListenerId++;
        this._subscribe(channel, id, callback);

        var handler = () => {
            this._unsubscribe(channel, id);
        }

        return handler;
    }

    unsubscribe(handler) {
        handler();
    }

    _subscribe(channel, id, callback) {
        console.log("Subscribed to " + channel);
        this.listeners[channel][id] = callback;
        this.request('/subscribe', {
            channel: channel,
            subscribtion_id: id
        })
    }

    _unsubscribe(channel, id) {
        console.log("Unsubscribed from " + channel);
        delete this.listeners[channel][id];
        this.request('/unsubscribe', {
            channel: channel,
            subscribtion_id: id
        })
    }

    publish(channel, message) {
        _.each(this.listeners[channel], function(callback) {
            callback(message, channel);
        });
    }

    request(route, params) {
        var defered = this.Q.defer();

        var sendRequest = () => {
            var id = this.nextRequestId++;

            var message = {
                route: route,
                params: params,
                request_id: id
            };

            this.pendingRequests[id] = {
                message: message,
                defered: defered
            }

            this.sock.send(JSON.stringify(message));
        }

        if (this.sock.readyState != WebSocket.OPEN) {
            this.sock.forceReconnect();

            var open = () => {
                this.sock.removeListener('open', open);
                this.sock.removeListener('close', close);
                process.nextTick(sendRequest);
            };

            var close = () => {
                this.sock.removeListener('open', open);
                this.sock.removeListener('close', close);
                defered.reject();
            };

            this.sock.once('open', open);
            this.sock.once('close', close);
        } else {
            sendRequest();
        }

        return defered.promise;
    }

    onresponse(message) {
        var id = message.request_id;
        var response = message.response;

        var request = this.pendingRequests[id];
        delete this.pendingRequests[id];

        var defered = request.defered;
        defered.resolve(response);
    }

    ping() {
        return this.request('/ping');
    }

    refreshDelay() {
        this.sock.refreshDelay();
    }
}

export var SERVICE_NAME = "ipc";
export var SERVICE = IPCService;

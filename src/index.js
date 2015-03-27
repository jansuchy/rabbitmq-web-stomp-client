var Stomp = require('stompjs/lib/stomp.js').Stomp,
    SockJS = require('sockjs-client'),
    config = require('./config.js'),
    stompUrl = 'http://itonis-portal.nangu.tv:15674/stomp';

module.exports = {
    logger: logger,
    logview: logview,
    stompClient: stompClient,
    config: config
};

/**
 * Creates and connects a new STOMP client.
 */
function stompClient(stompUrl, username, password, onConnect) {

    // Note: Critical section. Do not split/interrupt the following block
    // from new SockJS(...); to client.connect(...);
    // The stomp client needs to install onconnect websocket handler in time
    var client = Stomp.over(new SockJS(stompUrl));

    // If all your clients can do native websockets, you can avoid SockJS altogether:
    //    Stomp.client(stompUrl + '/websocket');
    // or:
    //    var ws = new WebSocket(stompUrl + '/websocket');
    //    Stomp.over(ws);

    client.heartbeat.outgoing = 0;
    client.heartbeat.incoming = 0;

    client.connect(username, password, onConnectionSuccess, onConnectionError);
    // end of critical section

    return client;


    function onConnectionSuccess() {
        console.info('Stomp client: connected');
        if (onConnect) {
            onConnect();
        }
    }

    function onConnectionError() {
        console.error('Stomp client: connection failed');
    }
}

/**
 * Creates a new logger.
 * @param {String} clientId - messages are sent to <clientId>.<componnet>.<severity>
 * topic, see topic https://www.rabbitmq.com/tutorials/tutorial-five-python.html
 * Client id, component, and severity should not include "." character. It would
 * mess with rabbitmq topic filtering syntax.
 */
function logger(clientId) {
    var client = stompClient(config.stompUrl, config.loggerUsername, config.loggerPassword, onConnect),
        connected = false;

    return function log(component, severity, messageText) {
        if (!connected) {
            console.error('Logger: Not logging message. Not connected (yet?)');
            return;
        }

        client.send(
            '/exchange/' + config.logExchange + '/' + clientId + '.' + component + '.' + severity,
            /* headers: */ {},
            messageText
        );
    };

    function onConnect() {
        connected = true;
    }
}

/**
 * Creates a new log viewer.
 * @param {String} [filter=#] - rabbitmq syntax, for example *.*.info, my-client.# see
 * https://www.rabbitmq.com/tutorials/tutorial-five-python.html
 * @param {Function} onMessage - invoked when a message is received: onMessage(message)
 */
function logview(onMessage, filter) {
    filter = filter || '#';

    var subscription = null,
        client = stompClient(config.stompUrl, config.logConsumerUsername, config.logConsumerPassword, onConnect);

    return function stop() {
        if (subscription) {
            subscription.unsubscribe();
        }
        // false means stopped
        subscription = false;
    };

    function onConnect() {
        var s = client.subscribe('/exchange/' + config.logExchange + '/' + filter, onMessage);

        if (subscription === false) {
            s.unsubscribe();
        } else {
            subscription = s;
        }
    }
}

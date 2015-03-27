# rabbit-web-stomp JavaScript client

## Building

    npm install
    npm run build


## Configuring

Adjust configuration variables directly in src/index.js. Provide correct
rabbitmq usernames and passwords (loggerUsername, loggerPassword,
logConsumerUsername, logConsumerPassword). rabbitmq exchange name (logExchange)
and correct rabbitmq-web-stomp endpoint URL (stompUrl).


## Running and developing

Build and serve the JS application:

    npm run build
    npm run serve

Point your browser to http://localhost:8080 and open the JS dev console.

    log = app.logger("my-client");
    app.logview(function(msg) { console.info("Received: " + m); });

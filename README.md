# VR Bowling

School group assignment for Experimental Web

- Francis Declercq
- Jasper Van Gestel

## Installation

Download

```Bash
git clone https://github.com/vgesteljasper/experimental-web-group-7.git
cd ./experimental-web-group-7
yarn install
```

Generate ssl certs for https to work locally

```Bash
chmod a+x ./server/config/generate-ssl-certs.sh
./server/config/generate-ssl-certs.sh
```

Fill in the .env file

```Bash
mv ./.env-example ./.env
vim ./.env
```

## Run

Development

```Bash
# development
yarn development
```

Production

```Bash
# make production build
yarn production

# serve production build
yarn serve
```

## How It Works

The `Hapi.js` server is able to send messages via `WebSockets`.
When a user created a room, it gets created in the server.
Friends can use that group name to join it and setup `WebRTC` connections
with the rest of the users in the group.
All users will be connected via `WebRTC` with eachother forming a communication mesh.

During setup, all messages happen via `WebSockets`. Connecting and creating rooms and uploading a username
for example all send the data to the server where it gets dispatched to the rest of the connected users in the room.

Game updates like throwing the bowling ball and going to the next person is handled by the comminucation mesh.

The DataChannel class (`src/js/classes/DataChannel`) is responsible for setting up this WebRTC mesh.
It sends and receives `WebSocket` messages to and frow to the server containing all the necessary objects needed to seup a
`WebRTCPeerConnection` and `WebRTCDataChannel` and dispatches events so other scripts can know what is happening in the mesh.

Data excange between scripts is made possible by dispatching and listening to custom events, and by using `mobx`.

Both the `React.js` UI (`src/js/components.App.jsx`) that handles the creating and joining of rooms, and the Game class (`src/js/classes/Game.js`)
that handles all the game logic have access to the DataChannel class to
listen to events and trigger actions in the data channel mesh.

When the client receives a message from the server that all users in the room are ready, the `React.js` UI will be removed
to be able to play the game written on top of `A-Frame.js` and `Three.js`

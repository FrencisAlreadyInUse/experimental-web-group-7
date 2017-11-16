WebVR Bowling Game (1 Controller)
==================

## Research:
- WebVR Multiplayer
- [Deepstream.io](https://www.sitepoint.com/deepstream-an-open-source-server-for-building-realtime-apps/)
- [A Frame — Glitch](https://glitch.com/aframe)
- [Realtime Multiplayer WebVR A-Frame](https://github.com/Srushtika/realtime-multiplayer-webvr-aframe)
- [ (TUTORIAL) Build Realtime Multiplayer WebVR A-Frame](https://github.com/Srushtika/realtime-multiplayer-webvr-aframe/blob/master/tutorial.md)
- [multiplayer WebVR game](https://github.com/gladeye/block-break-vr)
- accelerometer test: welke data verkrijgbaar van apparaat
  - [gyroscope](https://github.com/tomgco/gyro.js)
  - [html5 sensor interaction library for mobile](https://github.com/ehzhang/sense-js)
- [Glossary of Bowling](https://en.wikipedia.org/wiki/Glossary_of_bowling)
- [A-Frame physics](https://hacks.mozilla.org/2017/05/having-fun-with-physics-and-a-frame/)
- [Wii Remote](http://johnny-five.io/examples/classic-controller/)
- Wii Remote with JS

## Flow:
1. Connecten to **New Game**
  - Room code genereren
  - Joinen met multiple devices
  - 1 Device is controller (aparte code genereren voor controller)

2. **[joined]** WebVR Bowling Alley
  - Keuze om eigen bal te maken (met eigen profielfoto of foto die je zelf trekt) [Bal heeft dan texturen van je gezicht]
  - Keuze om links of rechtshandig in te stellen
  - Op controller is een algemene start knop
  - Game kan niet starten zonder controller

3. Game (Start)
  - Controller heeft functionaliteit van balswings
  - Bij loslaten knop op device, laat je de bal aan het rollen
  - Aan de hand van Data Device (snelheid, richting, ...) leeft de bal z'n eigen leven
  - Bij Strike, Spare, Split, ... userfeedback adhv animaties

4. Sound
  - Bij droppen & rollen bal op alley
  - Hitten van kegels
  - Bij animaties (strike, spare, split, ...)

5. Scores
  - TV die boven alley hangt
  - Update bij elke speler die gooit
  - Na 10 Frames is game gedaan (restart game)

6. Restart Game (na 10 frames)
  - Restart button op controller
  - Data wordt gewiped
  - Let's play again (Button)

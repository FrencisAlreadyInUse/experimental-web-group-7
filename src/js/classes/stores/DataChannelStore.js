import { observable, computed, action } from 'mobx';

export default class DataChannelStore {
  //
  @observable
  room = {
    name: '',
    size: 5,
    userCount: 0,
  };

  @observable
  user = {
    name: 'anonymous',
    uri: null,
  };

  @observable
  sections = {
    start: { active: true, last: false },
    roomCreate: { active: false, last: false },
    roomCreated: { active: false, last: false },
    roomJoin: { active: false, last: false },
    roomJoined: { active: false, last: false },
    userData: { active: false, last: false },
    waiting: { active: false, last: false },
  };

  constructor(dataChannel) {
    this.dataChannel = dataChannel;
    this.roomCanSwitch = true;
    this.minimumRoomVisible = 1000;

    this.dataChannel
      .on('dataChannelError', console.error)
      .on('dataChannelSuccess', this.dataChannelOnSuccess)
      .on('dataChannelMessage', this.dataChannelOnMessage);
  }

  @computed
  get currentSection() {
    for (const key in this.sections) {
      if (this.sections[key].active) return key;
    }
    return null;
  }

  @computed
  get lastSection() {
    for (const key in this.sections) {
      if (this.sections[key].last) return key;
    }
    return null;
  }

  @computed
  get currentSectionIndex() {
    return this.currentSection ? this.sectionNames.indexOf(this.currentSection) : null;
  }

  @computed
  get lastSectionIndex() {
    return this.lastSection ? this.sectionNames.indexOf(this.lastSection) : null;
  }

  @computed
  get sectionNames() {
    return Object.keys(this.sections);
  }

  @computed
  get sectionCount() {
    return this.sectionNames.length;
  }

  @action
  goToSection = sectionName => {
    if (!this.sections[sectionName]) return;

    if (!this.roomCanSwitch) {
      this.interval = window.setInterval(() => {
        if (this.roomCanSwitch) {
          this.goToSection(sectionName);

          window.clearInterval(this.interval);
          this.interval = null;
        }
      }, 30);

      return;
    }

    this.roomCanSwitch = false;
    window.setTimeout(() => {
      this.roomCanSwitch = true;
    }, this.minimumRoomVisible);

    if (this.sections[this.lastSection]) {
      this.sections[this.lastSection].last = false;
    }

    if (this.sections[this.currentSection]) {
      this.sections[this.currentSection].last = true;
      this.sections[this.currentSection].active = false;
    }

    this.sections[sectionName].active = true;
  };

  @action
  createRoom = () => {
    this.dataChannel.createRoom();
  };

  @action
  joinRoom = () => {
    this.dataChannel.joinRoom(this.room.name);
  };

  @action
  openRoom = () => {
    this.dataChannel.openRoom(this.room.name, this.room.size);
  };

  @action
  registeredRoom = () => {
    this.goToSection('userData');
  };

  @action
  userReady = (uri) => {
    this.dataChannel.userReady(this.user.name, uri);
    this.goToSection('waiting');
  };

  @action
  updateRoomSize = event => {
    if (event.target.value < 2 || event.target.value > 5) return;
    this.room.size = event.target.value;
  };

  @action
  updateRoomName = event => {
    this.room.name = event.target.value;
  };

  @action
  updateUserName = event => {
    this.user.name = event.target.value;
  };

  dataChannelOnSuccess = event => {
    const { action: eventAction } = event.detail;

    if (eventAction === 'roomCreated') {
      this.room.userCount += 1;
      console.log(event.detail.room.name);
      this.room.name = event.detail.room.name;

      this.goToSection('roomCreate');
    }

    if (eventAction === 'roomJoined') {
      this.goToSection('roomJoined');
    }

    if (eventAction === 'roomOpened') {
      this.goToSection('roomCreated');
    }
  };

  dataChannelOnMessage = event => {
    const { action: eventAction } = event.detail;

    if (eventAction === 'peerConnect') {
      this.room.userCount += 1;

      if (this.room.userCount === parseInt(this.room.size, 10)) {
        this.dataChannel.roomFull(this.room.name);
        this.goToSection('userData');
      }
    }

    if (eventAction === 'peerDisconnect') {
      this.room.userCount = this.room.userCount > 0 ? this.room.userCount - 1 : 0;
    }

    if (eventAction === 'roomFull') {
      this.goToSection('userData');
    }
  };
}

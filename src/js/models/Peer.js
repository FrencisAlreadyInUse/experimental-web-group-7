import { observable, action } from 'mobx';

export default class Peer {
  @observable name = 'anonymous';
  @observable uri = null;
  @observable score = 0;

  constructor(id, name, uri, ballPosition, scorePosition, crownPosition) {
    this.id = id;

    if (name) this.name = name;
    if (uri) this.uri = uri;

    if (ballPosition) this.ballPosition = ballPosition;
    if (scorePosition) this.scorePosition = scorePosition;
    if (crownPosition) this.crownPosition = crownPosition;
  }

  @action
  setName = name => {
    this.name = name;
  };

  @action
  setUri = uri => {
    this.uri = uri;
  };

  @action
  setScore = score => {
    this.score = score;
  };
}

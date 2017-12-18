import { observable, action } from 'mobx';

export default class Peer {
  @observable name = 'anonymous';
  @observable order = -1;
  @observable uri = null;
  @observable score = 0;

  constructor(id, ballPosition, scorePosition, crownPosition) {
    this.id = id;

    if (name) this.name = name;

    if (ballPosition) this.ballPosition = ballPosition;
    if (scorePosition) this.scorePosition = scorePosition;
    if (crownPosition) this.crownPosition = crownPosition;
  }

  @action
  complete = (order, name, uri) => {
    this.order = order;
    this.name = name;
    this.uri = uri;
  }

  @action
  setScore = score => {
    this.score = score;
  };
}

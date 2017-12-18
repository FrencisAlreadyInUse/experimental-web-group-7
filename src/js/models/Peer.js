import { observable, action } from 'mobx';

export default class Peer {
  @observable name = 'anonymous';
  @observable order = -1;
  @observable uri = null;
  @observable score = 0;

  constructor(id, name, uri, order, ballPosition, scorePosition, crownPosition) {
    this.id = id;

    this.name = name;
    this.uri = uri;
    this.order = order;

    this.ballPosition = ballPosition;
    this.scorePosition = scorePosition;
    this.crownPosition = crownPosition;
  }

  @action
  setScore = score => {
    this.score = score;
  };
}

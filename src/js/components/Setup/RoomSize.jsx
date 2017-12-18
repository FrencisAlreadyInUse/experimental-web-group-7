import React from 'react';
import { number, object } from 'prop-types';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';

const Button = styled.button`
  cursor: pointer;
`;

const RoomSize = ({ setupStore, min, max }) => {
  let currentSize = setupStore.room.size;

  const handleChangeRoomSizeUp = () => {
    if (currentSize < max) {
      currentSize += 1;
      setupStore.updateRoomSize(currentSize);
    } else {
      setupStore.updateRoomSize(5);
    }
  };

  const handleChangeRoomSizeDown = () => {
    if (currentSize > min) {
      currentSize -= 1;
      setupStore.updateRoomSize(currentSize);
    } else {
      setupStore.updateRoomSize(2);
    }
  };

  return (
    <div className="flex-inline row input--number__wrapper">
      <Button className="input input--button" onClick={handleChangeRoomSizeUp}>+</Button>
      <div
        className="input stroke input--stroke blob"
        role="button"
        tabIndex={0}
      >
        {setupStore.room.size}
      </div>
      <Button className="input input--button" onClick={handleChangeRoomSizeDown}>-</Button>
    </div>
  );
};

RoomSize.propTypes = {
  min: number.isRequired,
  max: number.isRequired,
  setupStore: object.isRequired,
};

export default inject('setupStore')(observer(RoomSize));

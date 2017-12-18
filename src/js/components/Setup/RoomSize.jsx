import React from 'react';
import { number, object } from 'prop-types';
import { inject, observer } from 'mobx-react';

const RoomSize = ({ setupStore, min, max }) => {
  let currentSize = setupStore.room.size;

  const handleCountDown = ({ keyCode }) => {
    if (keyCode === 38) {
      // UP
      if (currentSize < max) {
        currentSize += 1;
        setupStore.updateRoomSize(currentSize);
        console.log('[handleCountUp] — currentSize', currentSize);
      } else {
        setupStore.updateRoomSize(5);
      }
    } else if (keyCode === 40) {
      // DOWN
      if (currentSize > min) {
        currentSize -= 1;
        setupStore.updateRoomSize(currentSize);
        console.log('[handleCountDown] — currentSize', currentSize);
      } else {
        setupStore.updateRoomSize(2);
      }
    }
  };

  return (
    <input
      type="text"
      className="input stroke input--stroke"
      onKeyDown={handleCountDown}
      onChange={setupStore.updateRoomSize}
      value={setupStore.room.size}
      defaultValue={setupStore.room.size}
    />
  );
};

RoomSize.propTypes = {
  min: number.isRequired,
  max: number.isRequired,
  setupStore: object.isRequired,
};

export default inject('setupStore')(observer(RoomSize));

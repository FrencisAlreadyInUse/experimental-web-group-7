/* eslint-disable jsx-a11y/label-has-for */

import React from 'react';

import Screen from './index.jsx';

const ScreenWaiting = () => (
  <Screen name="waiting" className="around">
    <header className="hide">
      <h1>Waiting For Your Friends</h1>
    </header>
    <div className="section__content flex column column-center">
      <div className="title t-center">
        <span className="stroke blobs">Waiting</span> for your <span className="stroke">friends</span>
      </div>
    </div>
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="166.8px" height="100px">
      <path
        id="cone-01"
        className="beige logo-cone"
        d="M106.6,57.3c0-1.8-1.6-3.2-3-4.1c-2.7-1.7-6-2.6-9.2-3.1c-4.8-0.9-9.7-1-14.5-0.8
        c-4.1,0.2-8.3,0.7-12.3,2c-3.1,1-7.4,2.8-7.4,6.6c0,0.8,0,4.1,0,5c0,4.3,6,6.1,9.3,6.9c4.4,1.1,9,1.5,13.5,1.5
        c4.6,0,9.3-0.3,13.8-1.4c3.4-0.8,9.7-2.6,9.8-7C106.7,61.3,106.6,57.5,106.6,57.3z M64.2,60.2c4-2.3,9.1-3.1,13.7-3.4
        c6-0.5,12.3-0.3,18.2,1.1c2.2,0.5,4.5,1.2,6.5,2.4c-4,2.3-9.1,3.1-13.7,3.4c-6,0.5-12.3,0.3-18.2-1.1C68.5,62.1,66.2,61.4,64.2,60.2
        z"
      />
      <path
        id="cone-02"
        className="beige logo-cone"
        d="M136.7,32.7c0-1.8-1.6-3.2-3-4.1c-2.7-1.7-6-2.6-9.2-3.1c-4.8-0.9-9.7-1-14.5-0.8
        c-4.1,0.2-8.3,0.7-12.3,2c-3.1,1-7.4,2.8-7.4,6.6c0,0.8,0,4.1,0,5c0,4.3,6,6.1,9.3,6.9c4.4,1.1,9,1.5,13.5,1.5
        c4.6,0,9.3-0.3,13.8-1.4c3.4-0.8,9.7-2.6,9.8-7C136.8,36.7,136.7,32.9,136.7,32.7z M94.3,35.6c4-2.3,9.1-3.1,13.7-3.4
        c6-0.5,12.3-0.3,18.2,1.1c2.2,0.5,4.5,1.2,6.5,2.4c-4,2.3-9.1,3.1-13.7,3.4c-6,0.5-12.3,0.3-18.2-1.1C98.6,37.5,96.3,36.8,94.3,35.6
        z"
      />
      <path
        id="cone-03"
        className="beige logo-cone"
        d="M76.5,32.7c0-1.8-1.6-3.2-3-4.1c-2.7-1.7-6-2.6-9.2-3.1c-4.8-0.9-9.7-1-14.5-0.8
        c-4.1,0.2-8.3,0.7-12.3,2c-3.1,1-7.4,2.8-7.4,6.6c0,0.8,0,4.1,0,5c0,4.3,6,6.1,9.3,6.9c4.4,1.1,9,1.5,13.5,1.5
        c4.6,0,9.3-0.3,13.8-1.4c3.4-0.8,9.7-2.6,9.8-7C76.6,36.7,76.5,32.9,76.5,32.7z M34.1,35.6c4-2.3,9.1-3.1,13.7-3.4
        c6-0.5,12.3-0.3,18.2,1.1c2.2,0.5,4.5,1.2,6.5,2.4c-4,2.3-9.1,3.1-13.7,3.4c-6,0.5-12.3,0.3-18.2-1.1C38.4,37.5,36.1,36.8,34.1,35.6
        z"
      />
      <path
        id="cone-04"
        className="beige logo-cone"
        d="M166.8,8.1c0-1.8-1.6-3.2-3-4.1c-2.7-1.7-6-2.6-9.2-3.1c-4.8-0.9-9.7-1-14.5-0.8
        c-4.1,0.2-8.3,0.7-12.3,2c-3.1,1-7.4,2.8-7.4,6.6c0,0.8,0,4.1,0,5c0,4.3,6,6.1,9.3,6.9c4.4,1.1,9,1.5,13.5,1.5
        c4.6,0,9.3-0.3,13.8-1.4c3.4-0.8,9.7-2.6,9.8-7C166.9,12.1,166.8,8.4,166.8,8.1z M124.4,11.1c4-2.3,9.1-3.1,13.7-3.4
        c6-0.5,12.3-0.3,18.2,1.1c2.2,0.5,4.5,1.2,6.5,2.4c-4,2.3-9.1,3.1-13.7,3.4c-6,0.5-12.3,0.3-18.2-1.1
        C128.7,12.9,126.4,12.2,124.4,11.1z"
      />
      <path
        id="cone-05"
        className="beige logo-cone"
        d="M106.6,8.1c0-1.8-1.6-3.2-3-4.1c-2.7-1.7-6-2.6-9.2-3.1c-4.8-0.9-9.7-1-14.5-0.8
        c-4.1,0.2-8.3,0.7-12.3,2c-3.1,1-7.4,2.8-7.4,6.6c0,0.8,0,4.1,0,5c0,4.3,6,6.1,9.3,6.9c4.4,1.1,9,1.5,13.5,1.5
        c4.6,0,9.3-0.3,13.8-1.4c3.4-0.8,9.7-2.6,9.8-7C106.7,12.1,106.6,8.4,106.6,8.1z M64.2,11.1c4-2.3,9.1-3.1,13.7-3.4
        c6-0.5,12.3-0.3,18.2,1.1c2.2,0.5,4.5,1.2,6.5,2.4c-4,2.3-9.1,3.1-13.7,3.4c-6,0.5-12.3,0.3-18.2-1.1C68.5,12.9,66.2,12.2,64.2,11.1
        z"
      />
      <path
        id="cone-06"
        className="beige logo-cone"
        d="M46.4,8.1c0-1.8-1.6-3.2-3-4.1c-2.7-1.7-6-2.6-9.2-3.1c-4.8-0.9-9.7-1-14.5-0.8
        c-4.1,0.2-8.3,0.7-12.3,2C4.3,3.1,0,4.9,0,8.7c0,0.8,0,4.1,0,5c0,4.3,6,6.1,9.3,6.9c4.4,1.1,9,1.5,13.5,1.5c4.6,0,9.3-0.3,13.8-1.4
        c3.4-0.8,9.7-2.6,9.8-7C46.5,12.1,46.4,8.4,46.4,8.1z M4,11.1C8,8.7,13.1,8,17.7,7.6c6-0.5,12.3-0.3,18.2,1.1
        c2.2,0.5,4.5,1.2,6.5,2.4c-4,2.3-9.1,3.1-13.7,3.4c-6,0.5-12.3,0.3-18.2-1.1C8.3,12.9,6,12.2,4,11.1z"
      />
    </svg>
  </Screen>
);

export default ScreenWaiting;

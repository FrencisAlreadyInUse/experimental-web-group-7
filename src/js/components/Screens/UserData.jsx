/* eslint-disable jsx-a11y/label-has-for */

import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';

import Screen from './index.jsx';
import thumbDataURI from './../../functions/thumbDataURI.js';

const Title = styled.div`
  margin-bottom: 30px;
`;

const Form = styled.form`
  width: 100%;
  max-width: 400px;
`;

const FormRow = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 42px;
`;

const ButtonWrapper = styled.div`
  margin-top: 20px;
`;

const Note = styled.aside`
  margin-top: 40px;
`;

const ScreenUserData = ({ channelStore }) => {
  let $fileInputWrapper = null;
  let $fileInput = null;

  const handleFileInputChange = () => {
    const imageFile = $fileInput.files[0];
    if (!imageFile || !$fileInputWrapper) return;

    $fileInputWrapper.dataset.text = imageFile.name;
  };

  const handleUserReady = () => {
    const imageFile = $fileInput.files[0];
    if (!imageFile) return;

    thumbDataURI(imageFile)
      .then(uri => channelStore.userReady(uri))
      .catch(console.error);
  };

  return (
    <Screen name="userData" className="around">
      <header className="hide">
        <h2>Player Setup</h2>
      </header>
      <div className="section__content flex column column-center">
        <Title className="title">
          Choose a <span className="stroke">username</span> &amp;{' '}
          <span className="stroke">picture</span>*
        </Title>
        <Form className="dp-f ff-cnw form" autoComplete="off">
          <FormRow>
            <label className="label">username</label>
            <input
              className="input input--mini input--bordered"
              type="text"
              name="username"
              placeholder="Yoda"
              onChange={channelStore.updateUserName}
              autoCorrect="off"
              autoCapitalize="off"
            />
          </FormRow>
          <FormRow>
            <label className="label">profile picture</label>
            <div
              ref={el => ($fileInputWrapper = el)}
              className="input input--file"
              data-text="Select your profile picture"
            >
              <input
                ref={el => ($fileInput = el)}
                type="file"
                className="input--file--inner"
                onChange={handleFileInputChange}
              />
            </div>
          </FormRow>
        </Form>
      </div>
      <ButtonWrapper className="btn-wrapper flex column column-center">
        <button className="btn" onClick={handleUserReady}>
          Ready
        </button>
        <Note className="note">
          *Please, upload a picture of your face. It will be funny, we promise
        </Note>
      </ButtonWrapper>
    </Screen>
  );
};

ScreenUserData.propTypes = {
  channelStore: PropTypes.object.isRequired,
};

export default inject('channelStore')(observer(ScreenUserData));

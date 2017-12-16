/* eslint-disable jsx-a11y/label-has-for */

import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';

import wait from './../../functions/wait.js';
import Screen from './Screen.jsx';
import thumbDataURI from './../../functions/thumbDataURI.js';

const Title = styled.h1`
  margin-bottom: 8rem;

  @media only screen and (max-width: 768px) {
    margin-bottom: 3rem;
  }
`;

const Form = styled.form`
  width: 100%;
  max-width: 40rem;
  margin-bottom: 6rem;

  @media only screen and (max-width: 768px) {
    margin-bottom: 0;
  }
`;

const FormRow = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 3rem;
`;

const ButtonWrapper = styled.div`
  margin-top: 2rem;
`;

const Note = styled.div`
  margin-top: 2rem;
  padding: 0 0 2rem;
`;

const ScreenUserData = ({ setupStore }) => {
  let $fileInputWrapper = null;
  let $fileInput = null;

  const handleFileInputChange = () => {
    const imageFile = $fileInput.files[0];
    if (!imageFile || !$fileInputWrapper) return;

    $fileInputWrapper.dataset.text = imageFile.name;
  };

  const handleUserReady = event => {
    event.preventDefault();

    const imageFile = $fileInput.files[0];
    if (!imageFile) return;

    thumbDataURI(imageFile)
      .then(uri => setupStore.userReady(uri))
      .catch(console.error);
  };

  let $input;

  if (setupStore.sections.userData.active) {
    wait(500, () => $input.focus());
  }

  return (
    <Screen name="userData" className="around">
      <header className="hide">
        <h1>Player Setup</h1>
      </header>
      <article className="section__content flex column column-center">
        <Title className="title">
          Choose a <span className="stroke">username</span> &amp;{' '}
          <span className="stroke">picture</span>*
        </Title>
        <Form className="dp-f ff-cnw form" autoComplete="off" onSubmit={handleUserReady}>
          <FormRow>
            <label className="label">username</label>
            <input
              className="input input--mini input--bordered"
              type="text"
              name="username"
              placeholder="Yoda"
              onChange={setupStore.updateUserName}
              autoCorrect="off"
              autoCapitalize="off"
              ref={el => $input = el}
            />
          </FormRow>
          <FormRow>
            <label className="label">profile picture*</label>
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
        <ButtonWrapper className="btn-wrapper flex column column-center">
          <button className="btn" onClick={handleUserReady}>
            Ready
          </button>
          <Note className="note">
            *Please, upload a picture of your face. <br />
            It will be funny, we promise!
          </Note>
        </ButtonWrapper>
      </article>
    </Screen>
  );
};

ScreenUserData.propTypes = {
  setupStore: PropTypes.object.isRequired,
};

export default inject('setupStore')(observer(ScreenUserData));

/* eslint-disable jsx-a11y/label-has-for */

import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';

import Screen from './index.jsx';

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

const ScreenUserData = ({ channelStore }) => (
  <Screen name="userData" className="around">
    <header className="hide">
      <h2>Player Setup</h2>
    </header>
    <div className="section__content flex column column-center">
      <Title className="title">
        Choose a <span className="stroke">username</span> &amp;{' '}
        <span className="stroke">picture</span>*
      </Title>
      <Form className="dp-f ff-cnw form">
        <FormRow>
          <label className="label">username</label>
          <input
            className="input input--mini input--bordered"
            type="text"
            name="username"
            placeholder="Yoda"
          />
        </FormRow>
        <FormRow>
          <label className="label">profile picture</label>
          <div className="input input--file" data-text="Select your profile picture">
            <input type="file" className="input--file--inner" />
          </div>
        </FormRow>
      </Form>
    </div>
    <ButtonWrapper className="btn-wrapper flex column column-center">
      <button className="btn" onClick={channelStore.userReady}>
        Ready
      </button>
      <Note className="note">
        *Please, upload a picture of your face. It will be funny, we promise
      </Note>
    </ButtonWrapper>
  </Screen>
);

ScreenUserData.propTypes = {
  channelStore: PropTypes.object.isRequired,
};

export default inject('channelStore')(observer(ScreenUserData));

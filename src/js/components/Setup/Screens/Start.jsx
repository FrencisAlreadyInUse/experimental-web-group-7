import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';

import Screen from './../Screen.jsx';

const Header = styled.header`
  width: 64.5rem;
  height: 48.5rem;
  background: url(../assets/svg/virtual-lanes-logo.svg) center center no-repeat;
  justify-content: center;
  align-items: center;

  @media only screen and (max-width: 768px) {
    width: 90vw;
    height: 90vw;
  }
`;

const SubTitle = styled.h2`
  text-align: center;
`;

const Lanes = styled.span`
  align-self: flex-end;
`;

const ButtonWrapper = styled.div`
  width: 100%;
  max-width: 400px;

  @media only screen and (max-width: 768px) {
    flex-direction: column;
  }
`;

const ScreenStart = ({ setupStore }) => (
  <Screen name="start" className="around">
    <button className="btn btn--about" onClick={() => setupStore.goToSection('about')}>
      about
    </button>
    <Header className="flex">
      <h1 className="flex column title--big">
        <span>Virtual</span> {''}
        <Lanes className="flex">Lanes</Lanes>
      </h1>
    </Header>
    <article className="section__content flex column column-center">
      <header>
        <SubTitle className="title--sub">A multiplayer virtual reality bowling game</SubTitle>
      </header>
      <ButtonWrapper className="flex between">
        <button className="btn" onClick={() => setupStore.createRoom()}>
          Create Room
        </button>
        <button className="btn" onClick={() => setupStore.goToSection('roomJoin')}>
          Join Room
        </button>
      </ButtonWrapper>
    </article>
  </Screen>
);

ScreenStart.propTypes = {
  setupStore: PropTypes.object.isRequired,
};

export default inject('setupStore')(observer(ScreenStart));

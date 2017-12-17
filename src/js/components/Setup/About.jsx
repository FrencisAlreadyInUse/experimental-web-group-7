import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';

import Screen from './Screen.jsx';

const Header = styled.header`
  width: 64.5rem;
  height: 20rem;
  justify-content: center;
  align-items: center;

  @media only screen and (max-width: 768px) {
    width: 90vw;
    height: 30vw;
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

const About = ({ setupStore }) => (
  <Screen name="about" className="around">
    <Header className="flex">
      <h1 className="flex column title--big">
        <span>Virtual</span> {''}
        <Lanes className="flex">Lanes</Lanes>
      </h1>
    </Header>
    <article className="section__content flex column column-center about--content">
      <header>
        <SubTitle className="title--sub about--sub">
          A multiplayer virtual reality bowling game made by
          <span className="stroke">
            <a href="https://github.com/vgesteljasper"> @vgesteljasper</a>
          </span>
           &
          <span>
            <a href="https://github.com/FrencisAlreadyInUse"> @FrencisAlreadyInUse</a>
          </span>
        </SubTitle>
      </header>
      <ButtonWrapper className="flex center">
        <button className="btn" onClick={() => setupStore.goToSection('start')}>
          Go Back
        </button>
      </ButtonWrapper>
    </article>
  </Screen>
);

About.propTypes = {
  setupStore: PropTypes.object.isRequired,
};

export default inject('setupStore')(observer(About));

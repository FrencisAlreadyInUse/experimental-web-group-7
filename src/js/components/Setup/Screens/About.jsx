import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';

import Screen from './../Screen.jsx';

const Header = styled.header`
  width: 54.5rem;
  height: 38.5rem;
  background: url(../assets/svg/virtual-lanes-logo.svg) center center no-repeat;
  justify-content: center;
  align-items: center;

  @media only screen and (max-width: 768px) {
    width: 90vw;
    height: 90vw;
  }
`;

const Lanes = styled.span`
  align-self: flex-end;
`;

const ButtonWrapper = styled.div`
  width: 100%;

  @media only screen and (max-width: 768px) {
    flex-direction: column;
  }
`;

const About = ({ setupStore }) => (
  <Screen name="about" className="around about--mobile">
    <button className="btn btn--about btn--back" onClick={() => setupStore.goToSection('start')}>
      &larr;
    </button>
    <Header className="flex">
      <h1 className="hide">
        About Virtual Lanes
      </h1>
      <h2 className="flex column title--big">
        <span>Virtual</span> {''}
        <Lanes className="flex">Lanes</Lanes>
      </h2>
    </Header>
    <article className="section__content flex column column-center about--content">
      <header className="about--header">
        <h2 className="title--sub about--sub">
          A multiplayer Virtual Reality Bowling Game made by
          <a className="about--sub__link highlight" href="https://github.com/vgesteljasper" target="_blank" rel="noopener noreferrer"> @vgesteljasper</a> & <a className="about--sub__link highlight" href="https://github.com/FrencisAlreadyInUse" target="_blank" rel="noopener noreferrer"> @FrencisAlreadyInUse</a>
        </h2>
      </header>
      <p className="title--sub about--sub about--sublast">
        The game is made for the <a className="about--sub__link highlight" href="https://vr.google.com/cardboard/" target="_blank" rel="noopener noreferrer">Google Cardboard</a>.
        You throw the ball by <span className="highlight highlight--no-stroke">looking</span> at the
        <span className="highlight highlight--no-stroke"> throw-button</span> and using your
        <span className="highlight highlight--no-stroke"> Cardboard&apos;s button </span>.
      </p>
    </article>
  </Screen>
);

About.propTypes = {
  setupStore: PropTypes.object.isRequired,
};

export default inject('setupStore')(observer(About));

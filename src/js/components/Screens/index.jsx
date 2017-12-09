import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

const Screen = ({
  channelStore, name, className, children,
}) => {
  //
  let classes = 'current';
  let zIndex = 0;

  const {
    sections, sectionNames, lastSectionIndex, currentSectionIndex,
  } = channelStore;

  const forward = lastSectionIndex < currentSectionIndex;
  const thisSectionIndex = sectionNames.indexOf(name);

  if (thisSectionIndex !== currentSectionIndex) {
    if (thisSectionIndex < currentSectionIndex) {
      classes = 'left';
      if (sections[name].last) {
        zIndex = 1;
      } else {
        zIndex = 0;
      }
    } else {
      classes = 'right';
      if (sections[name].last) {
        zIndex = 1;
      } else {
        zIndex = 0;
      }
    }
  } else if (forward) {
    zIndex = 2;
  } else {
    zIndex = 1;
  }

  return (
    <section
      data-section-name={name}
      className={`section ${className} ${classes}`}
      style={{ zIndex }}
    >
      {children}
    </section>
  );
};

Screen.propTypes = {
  channelStore: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  children: PropTypes.array.isRequired,
};

export default inject('channelStore')(observer(Screen));

/* eslint-disable no-undef */
import React from 'react';
import styled from 'styled-components';

const QUESTION = styled.h2`
  text-align: center;
  font-size: ${(props) => (props.small ? '1.2em' : '2em')};
  color: ${(props) => (props.small ? '#999' : '#111')};

  margin: 0em 1rem 1rem 1rem;


  &::before {
    content: "> ";
  }
`;

const Question = (props) => {
  const { children, small } = props;
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <QUESTION {...props} small={small}>{children}</QUESTION>
  );
};

export default Question;

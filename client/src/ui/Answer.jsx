import React from 'react';
import styled from 'styled-components';

const ANSWER = styled.textarea`
  width: 36rem;
  max-width: 100%;
  min-height: 6rem;
  resize: vertical;
  box-sizing: border-box;
  padding: 1rem;
  
  background-color: #eee;
  border: none;
  border-radius: 0;
  
  font-size: 1.1em;


  &:focus {
    outline: none;
    border: 2px solid #111;
  }
`;

const Answer = (props) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <ANSWER {...props} placeholder="Scrivi la tua risposta" />
);

export default Answer;

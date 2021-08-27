import React from 'react';
import styled from 'styled-components';

const TEXTBOX = styled.input`
  width: 36rem;
  max-width: 100%;
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

const TextBox = (props) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <TEXTBOX {...props} />
);

export default TextBox;

import React from 'react';
import styled from 'styled-components';

const BUTTON = styled.button`
  cursor: pointer;

  width: 36rem;
  max-width: 100%;
  padding: 1rem;

  background-color: #111;
  border: none;
  border-radius: 0;

  color: #fff;
  font-weight: 600;
  font-size: 1em;

  transition: 100ms;

  flex: 1 0 18rem;


  &:hover {
    background-color: #333;
  }

  &:active {
    background-color: #444
  }

  &:disabled {
    background-color:#999;
    
    cursor: default;
  }
`;

const Button = (props) => {
  const { text } = props;
  const { children } = props;
  return (
  // eslint-disable-next-line react/jsx-props-no-spreading
    <BUTTON {...props}>{text || children }</BUTTON>
  );
};

export default Button;

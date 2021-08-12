/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { Question, Answer, Button } from './ui';
import QuestionModel from './model/question';

import { getAllQuestions, postAnswer } from './API';

const GlobalStyle = createGlobalStyle`
  * {
    font-family: system-ui, "Helvetica Neue", Helvetica, Arial, sans-serif;
  }
`;

const Centered = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: auto;
`;

const ButtonGroup = styled.div`
  display:flex;
  flex-wrap: wrap;

  width: 36rem;
  max-width: 100%;
`;

const Score = styled.div`
  text-align: center;


  & p {
    margin-top: 2rem;
    margin-bottom: 0;
  }

  & h2 {
    margin-top: 0;
  }
`;

const Counter = styled.div`
  text-align: center;

  margin-bottom: 2rem;


  & p {
    margin-top: 2rem;
    margin-bottom: 0;
  }

  & h2 {
    margin-top: 0;
  }

  & div {
    margin-left: auto;
    margin-right: auto;

    width: 20%;

    border-bottom: 1px solid black;
  }
`;

const App = () => {
  const [update, setUpdate] = useState(0); // integer state
  const [questions, setQuestions] = useState();
  const [questionsModel] = useState([]);
  const [question, setQuestion] = useState();
  const [answer, setAnswer] = useState('');
  const [next, setNext] = useState(false);
  const [end, setEnd] = useState(false);
  const [current, setCurrent] = useState(0);
  const [total, setTotal] = useState(0);

  const useForceUpdate = () => { setUpdate(update + 1); };

  const getQuestions = async () => {
    const response = await getAllQuestions();
    setQuestions(response);
  };

  const _getNextQuestion = () => questions.splice(Math.floor(Math.random() * questions.length), 1)[0];
  const getNextQuestion = () => {
    const temp = _getNextQuestion();
    if (temp) {
      setQuestion(new QuestionModel(temp));
      setNext(false);
      setAnswer('');
      setCurrent(current + 1);
    } else {
      setEnd(true);
    }
  };

  useEffect(() => {
    getQuestions();
  }, []);

  useEffect(() => {
    if (questions) {
      setTotal(questions.length);
      getNextQuestion();
    }
  }, [questions]);

  useEffect(() => {
    if (question) {
      questionsModel.push(question);
    }
  }, [question]);

  const onAnswerChange = (e) => {
    setAnswer(e.target.value);
  };

  const onSend = async () => {
    const response = await postAnswer(question.question, answer);
    console.log(response);

    question.updateScore(response.score);
    if (response.help) {
      question.addHelp(response.help);
    } else {
      question.end();
      setNext(true);
    }

    useForceUpdate();
  };

  const onNext = () => {
    getNextQuestion();
  };

  return (
    <>
      <GlobalStyle />
      <Counter>
        <p>Domanda</p>
        <h2>
          {current}
          {' '}
          di
          {' '}
          {total}
        </h2>
        <div />
      </Counter>
      <Centered>
        {!question ? <Question>Caricamento...</Question> : null}
        {question?.text?.map((q, i) => (
          <Question small={i !== question.text.length - 1}>{q}</Question>
        ))}
        <Answer value={answer} onChange={onAnswerChange} />
        <ButtonGroup>
          <Button onClick={onSend} disabled={next}>Invia</Button>
          <Button onClick={onNext} hidden={!next}>Prossima</Button>
        </ButtonGroup>
        <Score hidden={!end}>
          <p>Quiz completato con un punteggio di:</p>
          <h2>
            {questionsModel.reduce((sum, q) => sum + q.score, 0)}
            /
            {questionsModel.length}
          </h2>
        </Score>
      </Centered>
    </>
  );
};

export default App;

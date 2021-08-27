/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { nanoid } from 'nanoid';
import { Question, Answer, Button } from './ui';
import QuestionModel from './model/question';

import { getAllQuestions, postAnswer, postUser } from './API';
import TextBox from './ui/TextBox';

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

const Form = styled.div`
  margin-top: 2rem;


  & input {
    margin-bottom: 0.5rem;
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
  const [id, setId] = useState();
  const [name, setName] = useState();
  const [surname, setSurname] = useState();
  const [questionPage, setQuestionPage] = useState(false);

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
    setId(nanoid());
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

  const onNameChange = (e) => {
    setName(e.target.value);
  };

  const onSurnameChange = (e) => {
    setSurname(e.target.value);
  };

  const onSend = async () => {
    const response = await postAnswer(id, question.question, answer);
    console.log(response);

    question.updateScore(response.score);
    if (response.help && question.next !== 0) {
      question.addHelp(response.help);
      question.next -= 1;
    } else {
      question.end();
      setNext(true);
    }

    useForceUpdate();
  };

  const onSendUser = async () => {
    const response = await postUser(id, name, surname);
    if (response.created === true) { setQuestionPage(true); }
  };

  const onNext = () => {
    getNextQuestion();
  };

  return (
    <>
      <GlobalStyle />

      {questionPage ? (
        <>
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
                {questionsModel.reduce((sum, q) => sum + q.score, 0).toFixed(2)}
                /
                {questionsModel.length}
              </h2>
            </Score>
          </Centered>
        </>
      ) : (
        <Form>
          <Centered>
            <Question>Nome e Cognome</Question>
            <TextBox placeholder="Nome" text={name} onChange={onNameChange} />
            <TextBox placeholder="Cognome" text={surname} onChange={onSurnameChange} />
            <ButtonGroup>
              <Button onClick={onSendUser}>Invia</Button>
            </ButtonGroup>
          </Centered>
        </Form>
      )}
    </>
  );
};

export default App;

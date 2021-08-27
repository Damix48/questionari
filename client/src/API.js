import axios from 'axios';

const instanceQuestion = axios.create({ baseURL: 'http://localhost:1337/api/question' });
const instanceUser = axios.create({ baseURL: 'http://localhost:1337/api/user' });

const getAllQuestions = async () => {
  try {
    const response = await instanceQuestion.get('/all');
    return response.data;
  } catch (error) {
    return new Error(error);
  }
};

const postAnswer = async (id, question, answer) => {
  try {
    const response = await instanceQuestion.post('/answer', { id, question, answer });
    return response.data;
  } catch (error) {
    return new Error(error);
  }
};

const postUser = async (id, name, surname) => {
  try {
    const response = await instanceUser.post('/add', { id, name, surname });
    return response.data;
  } catch (error) {
    return new Error(error);
  }
};

export { getAllQuestions, postAnswer, postUser };

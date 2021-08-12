import axios from 'axios';

const instance = axios.create({ baseURL: 'http://localhost:1337/api/question' });

const getAllQuestions = async () => {
  try {
    const response = await instance.get('/all');
    return response.data;
  } catch (error) {
    return new Error(error);
  }
};

const postAnswer = async (question, answer) => {
  try {
    const response = await instance.post('/answer', { question, answer });
    return response.data;
  } catch (error) {
    return new Error(error);
  }
};

export { getAllQuestions, postAnswer };

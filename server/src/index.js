const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const question = require('./api/question');
const { port, origin, data_path: path } = require('./config.json');

const startPath = `${__dirname}/../../`;

const QuestionManager = require('./model/QuestionManager');

const app = express();

QuestionManager.init(startPath + path);

app.enable('trust proxy');

app.use(morgan('common'));
app.use(helmet());
app.use(cors({
  origin,
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.listen(port || 1337, () => {
  console.log(`Listening at http://localhost:${port}`);
});

app.use(express.static(`${__dirname}/../../client/build`));
app.get('/', (req, res) => { res.sendFile(`${__dirname}/../../client/build/index.html`); });

app.use('/api/question', question);

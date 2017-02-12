// Import node module
import express from 'express';
import Req from 'superagent';
const api = express.Router();

api.get('/', (req, res) => {
  res.send({message: 'Hello World!!'});
});

export default api;

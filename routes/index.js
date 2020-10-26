'use strict';

const express = require('express');
const router = express.Router();

const { listPeople, list } = require('../models/todos');

router.get('/', (req, res, next) => {
  try {
    res.status(200).json(listPeople());
  } catch (error) {
    next(error);
  }
});

router.get('/:name/tasks', (req, res, next) => {
  try {
    res.status(200).json(list(req.params.name));
  } catch (error) {
    next(error);
  }
})

module.exports = router;



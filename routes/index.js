'use strict';

const express = require('express');
const router = express.Router();

const { listPeople, list, add } = require('../models/todos');

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

router.post('/:name/tasks', (req, res, next) => {
  try {
    res.status(201).json(add(req.params.name, req.body));
  } catch (error) {
    next(error);
  }
})

module.exports = router;



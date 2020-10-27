'use strict';

const express = require('express');
const router = express.Router();

const { listPeople, list, add, complete } = require('../models/todos');


router.get('/', (req, res, next) => {
  try {
    res.status(200).json(listPeople());
  } catch (error) {
    next(error);
  }
});


router.get('/:name/tasks', (req, res, next) => {
  try {
    let userTasks = list(req.params.name);

    if(userTasks === undefined) {
      res.status(404).send("No user or tasks!");
    }
    // Check for req.query object:  /users/billy/tasks?status=complete
    if(req.query.status === 'complete') {
      userTasks = userTasks.filter(task => task.complete === true);
    }
    // Check for req.query object:  /users/billy/tasks?status=active
    if(req.query.status === 'active') {
      userTasks = userTasks.filter(task => task.complete === false);
    }

    res.status(200).json(userTasks);
  } catch (error) {
    next(error);
  }
});


router.post('/:name/tasks', (req, res, next) => {
  try {
    res.status(201).json(add(req.params.name, req.body));
  } catch (error) {
    next(error);
  }
});


module.exports = router;

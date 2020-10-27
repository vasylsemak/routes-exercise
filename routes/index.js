'use strict';

const express = require('express');
const router = express.Router();

const { listPeople, list, add, complete, remove } = require('../models/todos');

//   ROUTE '/'
router.get('/', (req, res, next) => {
  try {
    const people = listPeople();
    // return to ensure the rest of the code is not run
    if(!people) return res.sendStatus(404);
    res.status(200).json(people);
  } catch (error) {
    next(error);
  }
});

//  ROUTE '/:name/tasks'
router
  .get('/:name/tasks', (req, res, next) => {
    try {
      let userTasks = list(req.params.name);

      if(!userTasks) {
        return res.status(404).send("No user or tasks!");
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
  })
  .post('/:name/tasks', (req, res, next) => {
    try {
      if(req.body.content === '') return res.sendStatus(400);
      res.status(201).json(add(req.params.name, req.body));
    } catch (error) {
      next(error);
    }
  });

//  ROUTE '/:name/tasks/:idx'
router
  .put('/:name/tasks/:idx', (req, res, next) => {
    try {
      const afterComplete = complete(req.params.name, req.params.idx);
      if(!afterComplete) return res.sendStatus(404);
      res.status(200).json(afterComplete);
    } catch (error) {
      next(error);
    }
  })
  .delete('/:name/tasks/:idx', (req, res, next) => {
    try {
      const afterDelete = remove(req.params.name, req.params.idx);
      if(!afterDelete) return res.sendStatus(404);
      res.status(204).send(afterDelete);
    } catch (error) {
      next(error);
    }
  });


module.exports = router;

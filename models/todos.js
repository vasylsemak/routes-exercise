'use strict';

let tasks = {}; // a place to store tasks by person

module.exports = {
  reset: function () {
    tasks = {}; // (this function is completed for you.)
  },
  // ==== COMPLETE THE FOLLOWING (SEE `model.js` TEST SPEC) =====
  listPeople: function () {
    return Object.keys(tasks);
  },

  add: function (name, task) {
    if (!task.complete) task.complete = false;

    if (name in tasks) tasks[name].push(task);
    else tasks[name] = [task];
  },

  list(name) {
    return tasks[name];
  },

  complete(name, i) {
    if (tasks[name]) tasks[name][i].complete = true;
  },

  remove(name, i) {
    if (tasks[name]) tasks[name].splice(i, 1);
  },
};

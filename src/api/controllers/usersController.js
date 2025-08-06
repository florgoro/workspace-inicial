const dataManager = require('../utils/dataManager');

exports.getAllUsers = (req, res) => {
  const users = dataManager.getData('users');
  res.json(users);
};

exports.createUser = (req, res) => {
  const users = dataManager.getData('users');
  const newUser = { id: Date.now(), ...req.body };
  users.push(newUser);
  dataManager.saveData('users', users);
  res.status(201).json(newUser);
};
const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/user');

const getUsers = async (req = request, res = response) => {
  const { limit = 5, from = 0 } = req.query;
  const query = { status: true };

  const [total, users] = await Promise.all([
    User.countDocuments(query),
    User.find(query).skip(Number(from)).limit(Number(limit)),
  ]);

  res.json({
    total,
    users,
  });
};

const createUser = async (req, res = response) => {
  const { name, email, password, role } = req.body;
  const user = new User({ name, email, password, role });

  // Encriptar la contraseña
  const salt = bcryptjs.genSaltSync();
  user.password = bcryptjs.hashSync(password, salt);

  // Guardar en BD
  await user.save();

  res.json({
    user,
  });
};

const updateUser = async (req, res = response) => {
  const { id } = req.params;
  const { _id, password, google, email, ...remain } = req.body;

  if (password) {
    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    remain.password = bcryptjs.hashSync(password, salt);
  }

  const user = await User.findByIdAndUpdate(id, remain);

  res.json(user);
};

const replaceUser = (req, res = response) => {
  res.json({
    msg: 'patch API - usuariosPatch',
  });
};

const deleteUser = async (req, res = response) => {
  const { id } = req.params;
  const user = await User.findByIdAndUpdate(id, { status: false });

  res.json(user);
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  replaceUser,
  deleteUser,
};

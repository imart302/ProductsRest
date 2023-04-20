const Role = require('../models/role');
const { User, Category, Product } = require('../models');

const isValidRole = async (role = '') => {
  const rolExists = await Role.findOne({ rol: role });
  if (!rolExists) {
    throw new Error(`El rol ${role} no está registrado en la BD`);
  }
};

const emailExists = async (email = '') => {
  // Verificar si el correo existe
  const existsEmail = await User.findOne({ email });
  if (existsEmail) {
    throw new Error(`El correo: ${email}, ya está registrado`);
  }
};

const existsUserById = async (id) => {
  // Verificar si el correo existe
  const existsUser = await User.findById(id);
  if (!existsUser) {
    throw new Error(`El id no existe ${id}`);
  }
};

/**
 * Categorias
 */
const existsCategoryById = async (id) => {
  // Verificar si el correo existe
  const existsCategory = await Category.findById(id);
  if (!existsCategory) {
    throw new Error(`El id no existe ${id}`);
  }
};

/**
 * Productos
 */
const existsProductById = async (id) => {
  // Verificar si el correo existe
  const existsProduct = await Product.findById(id);
  if (!existsProduct) {
    throw new Error(`El id no existe ${id}`);
  }
};

module.exports = {
  isValidRole,
  emailExists,
  existsUserById,
  existsCategoryById,
  existsProductById,
};

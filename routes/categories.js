const { Router } = require('express');
const { check } = require('express-validator');

const { validateJWT, validateFields, isAdminRole } = require('../middlewares');

const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categories');
const { existsCategoryById } = require('../helpers/dbValidators');

const router = Router();

/**
 * {{url}}/api/categorias
 */

//  Obtener todas las categorias - publico
router.get('/', getCategories);

// Obtener una categoria por id - publico
router.get(
  '/:id',
  [
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom(existsCategoryById),
    validateFields,
  ],
  getCategory
);

// Crear categoria - privado - cualquier persona con un token válido
router.post(
  '/',
  [
    validateJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validateFields,
  ],
  createCategory
);

// Actualizar - privado - cualquiera con token válido
router.put(
  '/:id',
  [
    validateJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existsCategoryById),
    validateFields,
  ],
  updateCategory
);

// Borrar una categoria - Admin
router.delete(
  '/:id',
  [
    validateJWT,
    isAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom(existsCategoryById),
    validateFields,
  ],
  deleteCategory
);

module.exports = router;

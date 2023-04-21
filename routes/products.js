const { Router } = require('express');
const { check } = require('express-validator');

const { validateJWT, validateFields, isAdminRole } = require('../middlewares');

const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/products');

const {
  existsCategoryById,
  existsProductById,
} = require('../helpers/dbValidators');

const router = Router();

/**
 * {{url}}/api/categorias
 */

//  Obtener todas las categorias - publico
router.get('/', getProducts);

// Obtener una categoria por id - publico
router.get(
  '/:id',
  [
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom(existsProductById),
    validateFields,
  ],
  getProduct
);

// Crear categoria - privado - cualquier persona con un token válido
router.post(
  '/',
  [
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('category', 'No es un id de Mongo').isMongoId(),
    check('category').custom(existsCategoryById),
    validateFields,
  ],
  createProduct
);

// Actualizar - privado - cualquiera con token válido
router.put(
  '/:id',
  [
    validateJWT,
    // check('categoria','No es un id de Mongo').isMongoId(),
    check('id').custom(existsProductById),
    validateFields,
  ],
  updateProduct
);

// Borrar una categoria - Admin
router.delete(
  '/:id',
  [
    validateJWT,
    isAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom(existsProductById),
    validateFields,
  ],
  deleteProduct
);

module.exports = router;

const express = require('express');
const { check } = require('express-validator');
const { uploadFile, updateImage, getImage, updateImageCloudinary } = require('../controllers/uploads');
const { validateFields, validateJWT } = require('../middlewares');
const { validateFile } = require('../middlewares/validateFile');

const router = express.Router();

router.post('/', [validateFile, validateJWT], uploadFile);
router.put(
  '/:collection/:id',
  [
    check('collection', 'Colección no valida').isIn(['users', 'products']),
    check('id', 'No es un id de Mongo').isMongoId(),
    validateFields,
    validateFile,
    validateJWT
  ],
  updateImageCloudinary
);

router.get(
  '/:collection/:id',
  [
    check('collection', 'Colección no valida').isIn(['users', 'products']),
    check('id', 'No es un id de Mongo').isMongoId(),
    validateFields,
    validateJWT
  ],
  getImage
);


module.exports = router;

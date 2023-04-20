
const { Router } = require('express');
const { check } = require('express-validator');

const {
    validateFields,
    validateJWT,
    isAdminRole,
    hasRole
} = require('../middlewares');


const { isValidRole, emailExists, existsUserById } = require('../helpers/dbValidators');

const { getUsers,
        updateUser,
        createUser,
        deleteUser,
        replaceUser } = require('../controllers/users');

const router = Router();


router.get('/', getUsers );

router.put('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existsUserById ),
    check('rol').custom( isValidRole ), 
    validateFields
],updateUser );

router.post('/',[
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser más de 6 letras').isLength({ min: 6 }),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom( emailExists ),
    // check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']),
    check('rol').custom( isValidRole ), 
    validateFields
], createUser );

router.delete('/:id',[
    validateJWT,
    // esAdminRole,
    hasRole('ADMIN_ROLE', 'VENTAR_ROLE','OTRO_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existsUserById ),
    validateFields
],deleteUser );

router.patch('/', replaceUser );





module.exports = router;
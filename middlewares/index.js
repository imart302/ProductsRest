

const validateFields = require('../middlewares/validateFields');
const validateJWT = require('../middlewares/validateJWT');
const validateRoles = require('../middlewares/validateRoles');

module.exports = {
    ...validateFields,
    ...validateJWT,
    ...validateRoles,
}
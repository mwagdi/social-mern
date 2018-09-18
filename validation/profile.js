const Validator = require('validator');
const isEmpty = require("./is-empty");

module.exports = function validateProfileInput(data) {
    let errors = {};

    if (!Validator.isURL(data.website)) {
        errors.website = 'Not an URL';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}
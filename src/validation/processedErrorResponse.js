const { validationResult } = require('express-validator');

const processedErrorResponse = function (req, res, next) {
  let errorsObj = {};
  let validationError = validationResult(req);

  if (!validationError.isEmpty()) {
    let errors = validationError.mapped();

    for (const key in errors) {
      if (Object.hasOwnProperty.call(errors, key)) {
        if (typeof errors[key] == typeof {}) {
          errorsObj[key] = [errors[key].msg];
        }
      }
    }
    res.status(422).json({
      errors: errorsObj,
    });
  } else {
    next();
  }
};

module.exports = {
  processedErrorResponse,
};

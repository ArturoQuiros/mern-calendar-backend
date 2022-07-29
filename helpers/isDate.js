const moment = require("moment");

const isDate = (value) => {
  if (!value) {
    return false;
  }

  const date = moment(value);
  return date.isValid() ? true : false;
};

module.exports = { isDate };

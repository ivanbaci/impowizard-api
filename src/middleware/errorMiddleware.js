module.exports = (err, req, res, next) => {
  switch (err.name) {
    case 'InvalidUsername': {
      res.status(409).send({
        code: 'invalid_username',
        error: err.description,
      });
      break;
    }
    case 'InvalidEmail': {
      res.status(409).send({
        code: 'invalid_email',
        error: err.description,
      });
      break;
    }
    case 'InvalidLogin': {
      res.status(401).send({
        code: 'invalid_login',
        error: 'Invalid username or password',
      });
      break;
    }
  }
};

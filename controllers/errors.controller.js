exports.methodNotAllowedHandler = (allowedMethods) => ((req, res, next) => {
    res.status(405).send({msg: `${req.method} method not supported for this route`, Allow: allowedMethods});
});

exports.routeNotFoundHandler = (req, res, next) => {
    res.status(404).send({msg: 'route not found'})
}

exports.internalServerErrorHandler = (err, req, res, next) => {
    res.status(500).send({msg: 'internal server error'});
}

exports.psqlErrorHandler = (err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({msg : `invalid data type`})
    } else {
        next(err);
    }
}

exports.customErrorHandler = (err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({msg: err.msg});
    } else {
        next(err);
    }
}
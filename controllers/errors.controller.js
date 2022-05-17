exports.methodNotAllowedHandler = (allowedMethods) => ((req, res, next) => {
    res.status(405).send({msg: `${req.method} method not supported for this route`, Allow: allowedMethods});
});

exports.routeNotFoundHandler = (req, res, next) => {
    res.status(404).send({msg: 'route not found'})
}

exports.internalServerErrorHandler = (err, req, res, next) => {
    res.status(500).send({msg: 'internal server error'});
}
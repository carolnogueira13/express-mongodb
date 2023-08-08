exports.middlewareGlobal = (req, res, next) => {
    res.locals.umaVariavelLocal = 'Este o valor da variavel local do middleware.';
    next();
};

exports.checkCsrfError = (err, req, res, next) => {
    if (err && 'EBADCSRFTOKEN' === err.code) {
        return res.render('404');
    };
    next();
};

exports.csrfMiddleware = (req, res, next) => {
    res.locals.csrf = req.csrfToken();
    next();
}

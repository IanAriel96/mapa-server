"use strict";
const middleware = (error, req, res, next) => {
    res.status(500).json({
        status: 'error',
        name: error.name,
        message: error.message,
        path: error.path,
        date: Date(),
    });
};
// console.log(errores);
module.exports = middleware;

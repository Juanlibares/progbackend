import { check } from 'express-validator';
import { validationResults } from '../handlers/handle.validator.js';


export const productValidator = [
    check("title").exists().notEmpty().isString(),
    check("price").exists().notEmpty().isDecimal(),
    check("thumbnail").exists().notEmpty().isString().isURL(),
    check("stock").exists().notEmpty().isNumeric(),
    check("description").exists().notEmpty().isString(),
    check("code").exists().notEmpty().isNumeric(),
    (req, res, next) => validationResults(req, res, next)
];


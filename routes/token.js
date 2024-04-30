import { Router } from "express";
import { check } from "express-validator";

import { validarCampos } from "../api/middlewares/validarCampos.js";
import { crearTokenJWT } from "../api/controllers/crearTokenJWT.js";


const tokenRouter = Router();

tokenRouter.post(
    '/',
    [
        check( 'EmpId', 'El empid es necesario para crear el token' ).notEmpty(),
        check( 'Usuario', 'El usuario es necesario para crear el token' ).notEmpty(),
        validarCampos
    ],
    crearTokenJWT
);

export default tokenRouter;
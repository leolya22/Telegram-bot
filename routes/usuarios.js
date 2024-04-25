import { Router } from "express";
import { check } from "express-validator";

import { validarCampos } from "../api/middlewares/validarCampos.js";
import { recibirUsuariosTelegram } from "../api/controllers/recibirUsuariosTelegram.js";
import { borrarRelacionTelegram } from "../api/controllers/borrarRelacionTelegram.js";


const usuariosRouter = Router();

usuariosRouter.post(
    '/',
    [
        check( 'EmpId', 'El empid es necesario' ).notEmpty(),
        check( 'Usuario', 'El usuario es necesario' ).notEmpty(),
        validarCampos
    ],
    recibirUsuariosTelegram
);

usuariosRouter.delete(
    '/',
    [
        check( 'EmpId', 'El empid es necesario' ).notEmpty(),
        check( 'Usuario', 'El usuario es necesario' ).notEmpty(),
        check( 'chat_id', 'El chat_id es necesario' ).notEmpty(),
        validarCampos
    ],
    borrarRelacionTelegram
);

export default usuariosRouter;
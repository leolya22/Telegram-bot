import { response } from "express";

import { generarJWT } from "../helpers/jwt.js";

export const crearTokenJWT = async ( req, res = response ) => {
    const token = await generarJWT( req.body.provid );

    res.json({
        ok: true,
        provid: req.body.provid,
        token
    })
}
 import { TOKEN_SECRET } from "../config.js";
 import jwt from "jsonwebtoken";
 export function createAccessToken(payload) {
   return new Promise ((resolve, reject) => {
       jwt.sign(
            payload,
           TOKEN_SECRET,
           { expiresIn: '1d' },
           (err, token) => {
               if (err) {
                   return reject("Error al generar el token");
               }
               resolve(token);
           }
       );
   });
}
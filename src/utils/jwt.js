import { configDotenv } from "dotenv"
import JWT from "jsonwebtoken"
configDotenv()
export function generateAccessToken(payload){
    return JWT.sign(payload,process.env.SECRET_KEY,{expiresIn:"1h"})
}

export function generateRefreshToken(payload){
    return JWT.sign(payload,process.env.SECRET_KEY,{expiresIn:"24h"})
}

export function verifyToken(token){
    return JWT.verify(token,process.env.SECRET_KEY)
}
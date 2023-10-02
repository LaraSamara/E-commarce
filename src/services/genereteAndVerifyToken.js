import jwt from 'jsonwebtoken';
export const generateToken = (payload,signiture,expiresIn = '1h')=>{
    const token = jwt.sign(payload,signiture,{expiresIn});
    return token;
}
export const verifyToken = (token,signiture)=>{
    const decoded = jwt.verify(token,signiture);
    return decoded;
}
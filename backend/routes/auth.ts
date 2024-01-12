import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import verifyToken from "../middleware/auth";

const router = express.Router();
router.post(
    "/login",
    [
        check("email", "email is required").isEmail(),
        check("password", "password is required").isLength({
            min: 6,
        })
    ],
    async (req: Request, res: Response) => {
        console.log('control reached');
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {email, password} = req.body;
        console.log('got email and pass')
        try{
            const user = await User.findOne({email});
            console.log(user);

            if (!user) {
                return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            console.log(isMatch);
            if (!isMatch) {
                return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
                
            }
            const token = jwt.sign({userId:user.id}, process.env.JWT_SECRET_KEY as string,
                {
                    expiresIn:'7d',
                });
                console.log('token created');
        
                res.cookie("auth_token",token, {
                    httpOnly:true,
                    secure:process.env.NODE_ENV==="production",
                    maxAge:60*60*24*7,
                })
                console.log('cookie created');
                return res.status(200).json({
                    userId:user._id
                });

            

        }
        catch{
            res.status(500).send({
                msg:'something went wrong'
            })
        }
});


router.get("/validate-token",verifyToken, (req: Request,res: Response)=>{
    res.status(200).send({
        userId:req.userId
    })
})


router.post("/logout",(req:Request,res:Response)=>{
    res.cookie("auth_token","",{
        expires: new Date(0),
    });
    res.status(200).send({
        msg:"user logged out"
    })
})

export default router;



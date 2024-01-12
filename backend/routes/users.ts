import express, {Request,Response, Router} from "express";
import User from "../models/user";
import jwt from 'jsonwebtoken';
import {check, validationResult} from 'express-validator';
const router = express.Router();
router.post('/register',[
    check('firstName',"FirstName is required").isString(),
    check('lastName',"LastName is required").isString(),
    check('email',"email is required").isEmail(),
    check('password', 'password must be more than 6 characters').isLength({
        min:6
    })
], async(req:Request, res:Response) => {
    console.log('control reached');
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors:errors.array()
        })
    }
     try{

        
        let user = await User.findOne({
            email:req.body.email
        });

        if(user){
            return res.status(400).json({
                msg:'user already exits'
            })
        }

       
        user = new User(req.body);
        console.log('user created');
        await user.save();
        console.log('user saved');

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
        return res.status(200).send({
            msg:"user registered"
        });


 
     }catch(e){
        res.status(500).send({
            msg:'something went wrong'
        })
     }
})

export default router;
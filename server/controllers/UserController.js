const express = require('express');
const router = express.Router();

const jwtService = require('../services/jwtService');
const bcrypt = require('bcrypt');

const User = require('../database/User');

router.get('/', jwtService.authenticateToken, async (req, res) => {
    try {
        let newUser = await User.findOne({email: req.user.email});
        return res.status(200).json({
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.lastName
        }).end();
    } catch(err) {
        console.log(err);
        return res.status(500).end();
    }
});

router.post('/', async (req, res) => {
    if(!req.body.firstName || !req.body.lastName || !req.body.email || !req.body.password) {
        return res.status(400).end();
    }
    let [email, password] = [req.body.email, req.body.password];

    if(email.trim() === '' || !email.match(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)) 
        return res.status(400).json("invalid-email").end();

    if(await User.findOne({email: email})) 
        return res.status(400).json("already-exists").end(); 

    if(password.trim() === '' || !password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)) 
        return res.status(400).json("weak-password").end();

    try {
        password = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));
        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: email,
            password: password
        });
    
        await user.save();
    
        return res.json({
            accessToken: jwtService.signAccessToken({
                email: user.email
            }),
            refreshToken: jwtService.signRefreshToken({
                email: user.email
            })
        }).status(200).end();
    } catch(err) {
        console.log(err);
        res.status(500).end();
    }
});

router.put('/', jwtService.authenticateToken, async (req, res) => {
    let userUpdate = {
        firstName: req.body.firstName,
        lastName: req.body.lastName
    }
    if(req.body.firstName == null || req.body.firstName.trim() == '') delete userUpdate.firstName;
    if(req.body.lastName == null || req.body.lastName.trim() == '') delete userUpdate.lastName;
    try {
        await User.updateOne({email: req.user.email}, userUpdate);
        return res.status(200).end();
    } catch(err) {
        console.log(err);
        return res.status(500).end();
    }
});

router.put('/password', jwtService.authenticateToken, async (req, res) => {
    try {
        if(!req.body.curPassword || !req.body.newPassword || !req.body.newPassword.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)) {
            return res.status(400).end();
        }
        let user = await User.findOne({email: req.user.email});
        if(await bcrypt.compare(req.body.curPassword, user.password)) {
            user.password = (await bcrypt.hash(req.body.newPassword, Number(process.env.SALT_ROUNDS)));
            await user.save();
        } else return res.status(400).end();
        return res.status(200).end();
    } catch(err) {
        console.log(err);
        return res.status(500).end();
    }
});

module.exports = router;
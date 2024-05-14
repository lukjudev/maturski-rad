const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const jwtService = require('../services/jwtService');

const User = require('../database/User');

router.post('/signin', async (req, res) => {
    if(!req.body.email || !req.body.password) 
        return res.status(400).end();
    try {
        let user = await User.findOne({email: req.body.email});
        if(!user) return res.status(400).json("wrong-credentials").end();
        if(await bcrypt.compare(req.body.password, user.password)) {
            return res.json({
                accessToken: jwtService.signAccessToken({
                    email: user.email
                }),
                refreshToken: jwtService.signRefreshToken({
                    email: user.email
                })
            }).status(200).end();
        }
        return res.status(400).json("wrong-credentials").end();
    } catch(err) {
        console.log(err);
        return res.status(500).end();
    }

});

router.get('/refresh', jwtService.refreshToken, (req, res) => {
    try {
        return res.json({
            accessToken: jwtService.signAccessToken({
                email: req.user.email
            }),
            refreshToken: jwtService.signRefreshToken({
                email: req.user.email
            })
        })
    } catch(err) {
        console.log(err);
        return res.status(500).end();
    }
});

module.exports = router;
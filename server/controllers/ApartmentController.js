const express = require('express');
const router = express.Router();
const jwtService = require('../services/jwtService');
const Apartment = require('../database/Apartment');
const User = require('../database/User');
const Booking = require('../database/Booking');
 
router.get('/booking', jwtService.authenticateToken, async (req, res) => {
    try {
        const email = req.user.email;
        const bookings = await Booking.find({user: email});
        let resBookings = [];
        for(let i = 0; i < bookings.length; i++) {
            const apartment = await Apartment.findOne({_id: bookings[i].apartment}, "price user");
            resBookings = [...resBookings, {
                id: bookings[i]._id,
                checkIn: bookings[i].checkIn,
                checkOut: bookings[i].checkOut,
                apartment: bookings[i].apartment,
                host: apartment.user,
                price: apartment.price
            }];
        }
        return res.status(200).json(resBookings).end();
    } catch(err) {
        console.log(err);
        return res.status(500).end();
    }
});

router.delete('/booking/:id', jwtService.authenticateToken, async (req, res) => {
    try {
        const id = req.params.id;
        const email = req.user.email;
        const booking = await Booking.findOne({_id: id});
        if(booking && booking.user === email) {
            await Booking.deleteOne({_id: id});
            return res.status(200).end();
        }
        const apartment = await Apartment.findOne({_id: booking.apartment});
        if(apartment && apartment.user === email) {
            await Booking.deleteOne({_id: id});
            return res.status(200).end();
        }
        return res.status(400).end();
    } catch(err) {
        console.log(err);
        return res.status(500).end();
    }
});

router.get('/booking/:id', jwtService.authenticateToken, async (req, res) => {
    try {
        const id = req.params.id;
        const bookings = await Booking.find({apartment: id});
        let resBookings = [];
        for(let i = 0; i < bookings.length; i++) {
            const user = await User.findOne({email: bookings[i].user});
            resBookings = [...resBookings, {
                id: bookings[i]._id,
                user: bookings[i].user,
                firstName: user.firstName,
                lastName: user.lastName,
                checkIn: bookings[i].checkIn,
                checkOut: bookings[i].checkOut
            }];
        }
        return res.status(200).json(resBookings).end();
    } catch(err) {
        console.log(err);
        return res.status(500).end();
    }
});

router.post('/book', jwtService.authenticateToken, async (req, res) => {
    try {
        const email = req.user.email;
        if(!req.body.apartment || !req.body.checkIn || !req.body.checkOut) {
            return res.status(400).end();
        }
        const checkIn = new Date(req.body.checkIn);
        const checkOut = new Date(req.body.checkOut);
        (await Booking.find({apartment: req.body.apartment})).forEach((el) => {
            const eIn = new Date(el.checkIn);
            const eOut = new Date(el.checkOut);
            if(checkOut >= eIn && checkIn <= eOut) {
                return res.status(400).end();
            }
        });
    
        const booking = new Booking({
            user: email,
            apartment: req.body.apartment,
            checkIn: new Date(req.body.checkIn),
            checkOut: new Date(req.body.checkOut)
        });
        await booking.save();
        res.status(200).end();
    } catch(err) {
        console.log(err);
        return res.status(500).end();
    }
});

router.delete('/:id', jwtService.authenticateToken, async (req, res) => {
    try {
        const id = req.params.id;
        const email = req.user.email;
        await Apartment.deleteOne({_id: id, user: email});
        await Booking.deleteMany({apartment: id}); 
        return res.status(200).end();
    } catch(err) {
        console.log(err);
        return res.status(500).end();
    }
});

router.get('/single/:id', jwtService.authenticateToken, async (req, res) => {
    try {
        const id = req.params.id;
        const email = req.user.email;
        const data = await Apartment.findOne({_id: id});
        const user = await User.findOne({email: data.user});
        return res.status(200).json({
            title: data.title,
            description: data.description,
            country: data.country,
            address: data.address,
            rooms: data.rooms,
            bathrooms: data.bathrooms,
            capacity: data.capacity,
            images: data.images,
            price: data.price,
            firstName: user.firstName,
            lastName: user.lastName,
            editable: (email === data.user)
        }).end();
    } catch(err) {
        console.log(err);
        return res.status(500).end();
    }
});

router.get('/', jwtService.authenticateToken, async (req, res) => {
    try {
        const country = req.query.country;
        const apartments = await Apartment.find(country ? {country: country} : {}).slice('images', 1);
        return res.status(200).json(apartments.map((apartment) => {
            return {
                id: apartment._id,
                title: apartment.title,
                image: apartment.images[0]
            }
        }))
    } catch(err) {
        console.log(err);
        return res.status(500).end();
    }
});

router.get('/personal', jwtService.authenticateToken, async (req, res) => {
    try {
        const email = req.user.email;
        const apartments = await Apartment.find({ user: email }).slice('images', 1);
        return res.status(200).json(apartments.map((apartment) => {
            return {
                id: apartment._id,
                title: apartment.title,
                description: apartment.description,
                image: apartment.images[0]
            };
        }));
    } catch(err) {
        console.log(err);
        return res.status(500).end();
    }
});

router.post('/', jwtService.authenticateToken, async (req, res) => {
    if(!req.body.title || !req.body.description || !req.body.country || !req.body.address || !req.body.rooms || !req.body.bathrooms || !req.body.capacity || !req.body.price || req.body.images.length !== 5) {
        return res.status(400).end();
    }
    try {
        const email = req.user.email;
        const apartment = new Apartment({
            title: req.body.title,
            description: req.body.description,
            country: req.body.country,
            address: req.body.address,
            rooms: req.body.rooms,
            bathrooms: req.body.bathrooms,
            capacity: req.body.capacity,
            price: req.body.price,
            user: email,
            images: req.body.images
        });
        const savedApartment = (await apartment.save());
        return res.status(201).json(savedApartment).end();
    } catch(err) {
        console.log(err);
        return res.status(500).end();
    }
});

module.exports = router;
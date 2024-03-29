const express = require('express');
const vehicleRouter = express.Router();
const passport = require('passport');
const passportConfig = require('../passport');
const jwt = require('jsonwebtoken');
const Vehicle = require('../models/vehicleModel');
const User = require('../models/userModel');

vehicleRouter.get(`/getall`, passport.authenticate('jwt', { session: false }), async (request, response) => {
    try{
        const { username, role } = request.user;

        if (role !== 'driver' && role !== 'admin') {
            return response.status(403).json({ message: { msgBody: "Forbidden action", msgError: true } });
        }

        const vehicles = await Vehicle.find({ username });

        return response.status(200).json({ message: { msgBody: { count: vehicles.length, data: vehicles }, msgError: false } });
    } catch(error) {
        console.log(error.message)
        response.status(500).json({ message: { msgBody: `Error has occurred while getting vehicles: ${error.message}`, msgError: true } });
    }
});

vehicleRouter.get(`/getbyid/:id`, passport.authenticate('jwt', { session: false }), async (request, response) => {
    try{
        const { id } = request.params;
        const { username, role } = request.user;

        if (role !== 'driver' && role !== 'admin') {
            return response.status(403).json({ message: { msgBody: "Forbidden action", msgError: true } });
        }

        const vehicle = await Vehicle.findOne({ _id: id, username });

        if (!vehicle) {
            return response.status(400).json({ message: { msgBody: `Vehicle not found`, msgError: true } });
        }

        return response.status(200).json({ message: { msgBody: { data: vehicle }, msgError: false } });
    } catch(error) {
        console.log(error.message)
        response.status(500).json({ message: { msgBody: `Error has occurred while getting the vehicle: ${error.message}`, msgError: true } });
    }
});

vehicleRouter.post('/add', passport.authenticate('jwt', { session: false }), async (request, response) => {
    try {
        const { role } = request.user;

        if (role !== 'driver' && role !== 'admin') {
            return response.status(403).json({ message: { msgBody: "Forbidden action", msgError: true } });
        }

        const { manufacturer, model, year, color, batteryCapacity, fuelType, mileage, regenerativeBraking, username } = request.body;
        const user = await User.findOne({ username });
        console.log("user", user);

        if (!user) {
            return response.status(400).json({ message: { msgBody: `User not found`, msgError: true } });
        }

        if (user.role !== 'driver') {
            return response.status(400).json({ message: { msgBody: `Vehicle couldn't be assigned to someone who's not a driver.`, msgError: true } });
        }

        const newVehicle = new Vehicle({ manufacturer, model, year, color, batteryCapacity, fuelType, mileage, regenerativeBraking, username });

        await newVehicle.save().then(() => {
            return response.status(201).json({ message: { msgBody: `Vehicle successfully added.`, msgError: false } });
        }).catch((error) => {
            response.status(500).json({ message: { msgBody: `Error has occurred while adding the vehicle: ${error}`, msgError: true } });
        });

    } catch (error) {
        console.log(error.message)
        response.status(500).json({ message: { msgBody: `Error has occurred while adding the vehicle: ${error.message}`, msgError: true } });
    }
});

vehicleRouter.put('/update/:id', passport.authenticate('jwt', { session: false }), async (request, response) => {
    try {
        const { role } = request.user;

        if (role !== 'driver' && role !== 'admin') {
            return response.status(403).json({ message: { msgBody: `Forbidden action`, msgError: true } });
        }

        const { id } = request.params;

        const result = await Vehicle.findByIdAndUpdate(id, request.body);

        if (!result) {
            return response.status(400).json({ message: { msgBody: `Vehicle not found`, msgError: true } });
        }

        return response.status(200).json({ message: { msgBody: `Vehicle successfully updated.`, msgError: false } });
    } catch (error) {
        console.log(error.message)
        return response.status(500).json({ message: { msgBody: `Error has occurred while updating the vehicle: ${error.message}`, msgError: true } });
    }
});

vehicleRouter.delete('/delete/:id', passport.authenticate('jwt', { session: false }), async (request, response) => {
    try{
        const { role } = request.user;

        if (role !== 'driver' && role !== 'admin') {
            return response.status(403).json({ message: { msgBody: `Forbidden action`, msgError: true } });
        }

        const { id } = request.params;

        const result = await Vehicle.findByIdAndDelete(id);

        if (!result) {
            return response.status(400).json({ message: { msgBody: `Vehicle not found`, msgError: true } });
        }

        return response.status(200).json({ message: { msgBody: `Vehicle successfully deleted.`, msgError: false } });
    } catch(error) {
        console.log(error.message)
        return response.status(500).json({ message: { msgBody: `Error has occurred while deleting the vehicle: ${error.message}`, msgError: true } });
    }
});

module.exports = vehicleRouter;
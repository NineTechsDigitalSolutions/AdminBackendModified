const Notification = require("../models/Notification");

exports.createSmsNotification = async (req, res) => {
    try {

        //will recieve users id array
        Notification.create({ ...req.body, notificationType: "sms" }, (err, doc) => {
            if (err)
                return res.status(400).json({
                    message: err,
                });
            return res.status(200).json({
                message: "Sms Notifications Sent",
            });
        });
    } catch (err) {
        res.status(500).json({
            message: err.toString(),
        });
    }
};

exports.createEmailNotification = async (req, res) => {
    try {

        //will recieve users id array
        Notification.create({ ...req.body, notificationType: "email" }, (err, doc) => {
            if (err)
                return res.status(400).json({
                    message: err,
                });
            return res.status(200).json({
                message: "Email Notifications Sent",
            });
        });
    } catch (err) {
        res.status(500).json({
            message: err.toString(),
        });
    }
};

exports.createPushNotification = async (req, res) => {
    try {

        //will recieve users id array
        Notification.create({ ...req.body, notificationType: "push" }, (err, doc) => {
            if (err)
                return res.status(400).json({
                    message: err,
                });
            return res.status(200).json({
                message: "Notification Sent",
            });
        });
    } catch (err) {
        res.status(500).json({
            message: err.toString(),
        });
    }
};

exports.getAll = async (req, res) => {
    try {
        Notification.find({}).populate("users").then((notifications) => {
            res.status(200).json(notifications);
        });
    } catch (err) {
        res.status(500).json({
            message: err.toString(),
        });
    }
};
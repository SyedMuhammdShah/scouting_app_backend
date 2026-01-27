const Joi = require("joi");

const gameValidationSchemas = {
    createGame: Joi.object({
        quickSetup: Joi.object({
            isPrivate: Joi.boolean().default(false),
            enableChat: Joi.boolean().default(true),
            enablePayment: Joi.boolean().default(true),
            copyPreviousGame: Joi.boolean().default(false),
            backgroundImage: Joi.string().uri().optional(),
        }).required(),
        details: Joi.object({
            title: Joi.string().required(),
            description: Joi.string().allow("").optional(),
            location: Joi.string().required(),
            coordinates: Joi.object({
                lat: Joi.number().required(),
                long: Joi.number().required(),
            }).optional(),
        }).required(),
        schedule: Joi.object({
            date: Joi.date().required(),
            time: Joi.string().required(),
            duration: Joi.string().required(),
            playersNeeded: Joi.number().integer().min(1).required(),
        }).required(),
        rules: Joi.object({
            groundType: Joi.string().optional(),
            matchFormat: Joi.string().optional(),
            ageRange: Joi.object({
                from: Joi.number().integer().min(0).optional(),
                to: Joi.number().integer().min(0).optional(),
            }).optional(),
            gender: Joi.string().valid("Male", "Female", "Mix").default("Mix"),
        }).required(),
        payment: Joi.object({
            level: Joi.string().optional(),
            option: Joi.string().valid("Online", "Cash").optional(),
            price: Joi.number().min(0).default(0),
            currency: Joi.string().default("USD"),
        }).required(),
    }),

    respondToRequest: Joi.object({
        action: Joi.string().valid("accept", "reject").required(),
    }),

    listGames: Joi.object({
        status: Joi.string().valid("OPEN", "FULL", "STARTED", "COMPLETED", "CANCELLED").optional(),
        type: Joi.string().optional(),
        lat: Joi.number().optional(),
        long: Joi.number().optional(),
    }),
};

module.exports = gameValidationSchemas;

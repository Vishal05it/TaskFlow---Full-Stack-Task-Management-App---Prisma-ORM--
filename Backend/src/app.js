"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var dotenv_1 = require("dotenv");
var cookie_parser_1 = require("cookie-parser");
var cors_1 = require("cors");
dotenv_1.default.config();
var app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
exports.default = app;

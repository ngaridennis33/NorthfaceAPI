"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _Email_firstName, _Email_to, _Email_from;
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("config"));
const pug_1 = __importDefault(require("pug"));
const html_to_text_1 = require("html-to-text");
const smtp = config_1.default.get('smtp');
class Email {
    constructor(user, url) {
        this.user = user;
        this.url = url;
        _Email_firstName.set(this, void 0);
        _Email_to.set(this, void 0);
        _Email_from.set(this, void 0);
        __classPrivateFieldSet(this, _Email_firstName, user.name.split(' ')[0], "f");
        __classPrivateFieldSet(this, _Email_to, user.email, "f");
        __classPrivateFieldSet(this, _Email_from, `NorthFace <northface.helpdesk@gmail.com>`, "f");
    }
    newTransport() {
        if (process.env.NODE_ENV === 'production') {
        }
        return nodemailer_1.default.createTransport(Object.assign(Object.assign({}, smtp), { auth: {
                user: smtp.user,
                pass: smtp.pass,
            } }));
    }
    send(template, subject) {
        return __awaiter(this, void 0, void 0, function* () {
            // Generate HTML template based on the template string
            const html = pug_1.default.renderFile(`${__dirname}/../views/${template}.pug`, {
                firstName: __classPrivateFieldGet(this, _Email_firstName, "f"),
                subject,
                url: this.url,
            });
            // Create mailOptions
            const mailOptions = {
                from: __classPrivateFieldGet(this, _Email_from, "f"),
                to: __classPrivateFieldGet(this, _Email_to, "f"),
                subject,
                text: (0, html_to_text_1.convert)(html),
                html,
            };
            // Send email
            const info = yield this.newTransport().sendMail(mailOptions);
            // console.log(nodemailer.getTestMessageUrl(info));
        });
    }
    sendVerificationCode() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.send('verificationCode', 'Your account verification code');
        });
    }
    sendPasswordResetToken() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.send('resetPassword', 'Your password reset token (valid for only 10 minutes)');
        });
    }
}
_Email_firstName = new WeakMap(), _Email_to = new WeakMap(), _Email_from = new WeakMap();
exports.default = Email;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
class User {
    constructor() {
        this.nickname = '';
        this.username = '';
        this.email = '';
        this.password = '';
        this.phone = '';
        this.photoProfile = '';
        this.description = '';
        this.privacity = false;
        this.createdAt = null;
        this.id = (0, uuid_1.v4)();
        this.createdAt = new Date();
    }
    registerUser(user) {
        Object.assign(this, user);
    }
    updateUser(user) {
        Object.assign(this, user);
        console.log(this);
    }
    deleteUser() {
        console.log("User ", this.id, " was deleted");
    }
    login(email, password) {
        if (this.email != email || this.password != password) {
            console.log("Login invalido!");
        }
        else {
            return {
                nickname: this.nickname,
                username: this.username,
                email: this.email,
                password: this.password,
                phone: this.phone
            };
        }
    }
}
const u = new User();
u.updateUser({ email: 'teste' });
u.deleteUser();
u.login('teste', '');

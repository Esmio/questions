const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');
const util = require('util');
const pbkd2Async = util.promisify(crypto.pbkdf2);
const SALT = require('../../cipher').PASSWORD_SALT;
const Errors = require('../../errors');

const UserSchema = new Schema({
    name: {type: String, required: true},
    nickname: {type: String, required: true},
    sex: String,
    age: {type: Number, max: [90, 'Nobody over 90 would use this website']},
    phoneNumber: String,
    password: String,
    avatar: String,
    level: Number,
    number: String,
    openId: {type: String},
    status: {type: Number, default: 0},
})

const UserModel = mongoose.model('user', UserSchema);

// 创建用户
async function createNewUser(params) {
    const {
        name, 
        password, 
        age, 
        phoneNumber, 
        nickname, 
        sex, 
        level, 
        number, 
        avatar,
        openId,
    } = params;
    const user = new UserModel({
        name,
        nickname,
        sex,
        age,
        phoneNumber,
        avatar,
        level,
        number,
        openId,
    })
    if(password) {
        user.password = await pbkd2Async(password, SALT, 512, 128, 'sha1')
            .then(r => r.toString())
            .catch(e => {
                console.log(e);
                throw new Errors.InternalError('内部错误');
            })
    }
    let created = await user.save()
        .catch(e => {
            console.log('e', e);
            switch(e.code) {
                case 11000:
                    throw new Errors.DuplicateUserNameError(params.name);
                default: 
                    throw new Errors.ValidationError('user', `创建用户出错${JSON.stringify(params)}`);
            }
        })
    return {
        _id: created._id,
        name: created.name,
        age: created.age,
        nickname: created.nickname,
        sex: created.sex,
        phoneNumber: created.phoneNumber,
        avatar: created.avatar,
        level: created.level,
        number: created.number,
        openId: created.openId,
    }
}

// 查询用户
async function getUsers(params = {page: 0, pageSize: 0}) {
    let flow = UserModel.find({});
    flow.skip(params.page * params.pageSize)
    flow.limit(params.pageSize)
    return await flow
        .catch(e => {
            console.log(e);
            throw new Error(`error getting users from db`);
        })
}

// 根据_id查询用户
async function getUserById(userId) {
    return await UserModel.findOne({_id: userId})
        .catch(e => {
            console.log(e);
            throw new Error(`error getting user by id: ${userId}`);
        })
}

// 修改某用户 
async function updateUserById(userId, update) {
    return await UserModel.findOneAndUpdate({_id: userId}, update, {new: true})
        .catch(e => {
            console.log(e);
            throw new Error(`error updating user by id: ${userid}`)
        })
}

// 登陆
async function login(phoneNumber, password) {
    password = await pbkd2Async(password, SALT, 512, 128, 'sha1')
        .then(r => r.toString())
        .catch(e => {
            console.log(e);
            throw new Error('内部错误');
        })
    const user = await UserModel.findOne({phoneNumber: phoneNumber, password: password})
        .catch(e => {
            console.log(`error login in, phone ${phoneNumber}`, {err: e.stack || e});
        })
    if(!user) throw new Errors.LoginError('no such user');
    return {
        _id: user._id,
        phoneNumber: user.phoneNumber,
        name: user.name,
        nickname: user.name,
        age: user.age,
    }
}

module.exports = {
    model: UserModel,
    createNewUser,
    updateUserById,
    getUsers,
    getUserById,
    login,
}

class BaseHTTPError extends Error {
    constructor(msg, OPCode, httpCode, httpMsg) {
        super(msg);
        this.OPCode = OPCode;
        this.httpCode = httpCode;
        this.httpMsg = httpMsg;
        this.name = 'BaseHTTPError';
    }
    static get ['DEFAULT_OPCODE'] () {
        return 10000;
    }
}

class InternalError extends BaseHTTPError {
    constructor(msg) {
        const OPCode = 10001;
        const httpMsg = '服务器开小差了';
        super(msg, OPCode, 500, httpMsg);
    }
}

class AuthError extends BaseHTTPError {
    constructor(msg) {
        const OPCode = 40001;
        const httpMsg = '没有权限';
        super(msg, OPCode, 401, httpMsg);
    }
}

class LoginError extends BaseHTTPError {
    constructor(msg) {
        const OPCode = 40005;
        const httpMsg = '账号或者密码有误';
        super(msg, OPCode, 500, httpMsg);
    }
}

class ValidationError extends BaseHTTPError {
    constructor(path, reason) {
        const OPCode = 20000;
        const httpCode = 400;
        const httpMsg = '参数错误，请检查后再试';
        const msg = `error validation param, path: ${path}, reason: ${reason}`;
        super(msg, OPCode, httpCode, httpMsg);
    }
}

class DuplicateUserNameError extends ValidationError {
    constructor(username) {
        super('username', `duplicate user name: ${username}`);
        this.httpMsg = '这个昵称已被占用';
        this.OPCode = 20001;
    }
}

class DuplicatedError extends ValidationError {
    constructor(param) {
        super(param, `duplicate param: ${param}`);
        this.httpMsg = `${param}已存在`;
        this.OPCode = 20002;
    }
}

class NotExistError extends ValidationError {
    constructor(param) {
        super(param, `not exist param: ${param}`);
        this.httpMsg = `${param}不存在`;
        this.OPCode = 20003;
    }
}

module.exports = {
    BaseHTTPError,
    ValidationError,
    DuplicateUserNameError,
    InternalError,
    DuplicatedError,
    LoginError,
    AuthError,
    NotExistError,
}
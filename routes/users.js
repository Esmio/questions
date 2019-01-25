const express = require('express');
const router = express.Router();
const User = require('../models/mongo/user');
const auth = require('../middlewares/auth_user');
const multer = require('multer');
const path = require('path');
const upload = multer({dest: path.join(__dirname, '../public/upload')});

/* GET users listing. */

router.route('/')
  .get((req, res, next) => {
    (async () => {
      let users = await User.getUsers();
      return {
        code: 0,
        data: {
          users,
        }
      }
    })()
      .then(r => {
        res.json(r);
      })
      .catch(e => {
        console.log(e, '获取所有用户失败')
      })
  })
  .post((req, res, next) => {
    (async () => {
      const {
        name,
        age,
        password,
        phoneNumber,
        sex,
        avatar,
        level,
        number,
        nickname,
        openId,
      } = req.body;
      let user = await User.createNewUser({
        name,
        age,
        password,
        phoneNumber,
        sex,
        avatar,
        level,
        number,
        nickname,
        openId,
      })
      return {
        code: 0,
        data: {
          user,
        }
      }
    })()
      .then(r => {
        res.json(r)
      })
      .catch(e => {
        console.log(e, '添加用户失败')
      })
  })

router.route('/:id')
  .get((req, res, next) => {
    (async () => {
      const id = req.params.id;
      const user = await User.getUserById(id);
      return {
        code: 0,
        data: {
          user,
        }
      }
    })()
      .then(r => {
        res.json(r)
      })
      .catch(e => {
        console.log('获取用户失败', e);
      })
  })
  .patch((req, res, next) => {
    (async () => {
      const id = req.params.id;
      const {
        name,
        age,
        sex,
        avatar,
        level,
        number,
        nickname,
        openId,
      } = req.body;
      const user = await User.updateUserById(id, {
        name,
        age,
        sex,
        photo,
        level,
        avatar,
        number,
        nickname,
        openId,
      })
      return {
        code: 0,
        data: {
          user,
        }
      }
    })()
      .then(r => {
        res.json(r);
      })
      .catch(e => {
        console.log('更新用户失败', e);
      })
  })

module.exports = router;

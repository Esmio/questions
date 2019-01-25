const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth_user');
const Errors = require('../errors');

const Issue = require('../models/mongo/issue');
const Topic = require('../models/mongo/topic');
const Option = require('../models/mongo/option');

// 问卷
router.route('/issue')
    .post(auth(), (req, res, next) => {
        (async () => {
            const {issue, remark, title} = req.body;
            const created = await Issue.create({
                issue,
                title,
                remark,
            })
            return {
                code: 0,
                data: {
                    created,
                }
            }
        })()
            .then(r => {
                res.header('Access-Control-Allow-Origin', ['*']);                
                res.json(r);
            })
            .catch(e => {
                console.log('post /api/question/issue', e);
                next(e);
            })
    })
// 期号列表
router.route('/issue/list')
    .post((req, res, next) => {
        (async () => {
            const {page, pageSize} = req.body;
            const {list, total} = await Issue.list({page: page - 1, pageSize});
            return {
                code: 0,
                data: {
                    list,
                    pagination: {
                        page,
                        pageSize,
                        total,
                    }
                }
            }
        })()
            .then(r => {
                res.header('Access-Control-Allow-Origin', ['*']);                
                res.json(r);
            })
            .catch(e => {
                console.log('post /api/question/issue/list', e);
                next(e);
            })
    })
// 发布期号
router.route('/issue/update')
    .post(auth(), (req, res, next) => {
        (async () => {
            const {
                oid,
                key,
                method,
            } = req.body;
            const keyDict = {
                'status': 'status',
            }
            const methodDict = {
                'publish': 1
            }
            const options = { [keyDict[key]] : methodDict[method] };
            const updated = await Issue.updateIssue(oid, options);
            return {
                code: 0,
                data: {
                    updated,
                }
            }
        })()
            .then(r => {
                res.header('Access-Control-Allow-Origin', ['*']);                
                res.json(r);
            })
            .catch(e => {
                console.log('post /api/question/issue/update', e);
                next(e);
            })
    })
// 删除期号
router.route('/issue/remove')
    .post(auth(), (req, res, next) => {
        (async () => {
            const { oid } = req.body;
            const deleted = Issue.deleteIssue(oid);
            // todo 删除题目(topics)和选项(options);
            return {
                code: 0,
                data: {
                    deleted,
                }
            }
        })()
            .then(r => {
                res.header('Access-Control-Allow-Origin', ['*']);
                res.json(r);
            })
            .catch(e => {
                console.log('delete /api/question/issue/remove', e);
                next(e);
            })
    })
// 题目
router.route('/topic')
    .post(auth(), (req, res, next) => {
        (async () => {
            const {
                issue_id,
                issue,
                type,
                title,
                number,
                required
            } = req.body
            const topic = await Topic.create({
                issue_id,
                issue,
                type,
                title,
                number,
                required
            })
            return {
                code: 0,
                data: {
                    topic,
                }
            }
        })()
            .then(r => {
                res.header('Access-Control-Allow-Origin', ['*']);                                
                res.json(r)
            })
            .catch(e => {
                console.log('post /api/question/topic', e);
                next(e);
            })
    })
// 题目列表
router.route('/topic/list')
    .post((req, res, next) => {
        (async () => {
            const { issue_id } = req.body;
            const listproto = await Topic.getListByIssueId(issue_id);
            const promises = listproto.map(async (item, index) => {
                const {
                    _id,
                    number,
                    required,
                    type,
                    create,
                    issue,
                    issue_id,
                    title,
                } = item;
                const options = await Option.getOptionsByTopicId(_id);
                return {
                    _id,
                    number,
                    required,
                    type,
                    create,
                    issue,
                    issue_id,
                    title,
                    options,
                }
            })
            const list = await Promise.all(promises);
            return {
                code: 0,
                data: {
                    list,
                }
            }    
        })()
            .then(r => {
                res.header('Access-Control-Allow-Origin', ['*']);                                
                res.json(r)
            })
            .catch(e => {
                console.log('post /api/question/topic/list', e);
                next(e);
            })
    })
// 删除一个题目
router.route('/topic/remove')
    .post(auth(), (req, res, next) => {
        (async () => {
            const { topic_id } = req.body;
            const topic_deleted = await Topic.deleteOneTopic(topic_id);
            const options_deleted = await Option.deleteOptionsByTopicId(topic_id);
            return {
                code: 0,
                data: {
                    topic_deleted,
                    options_deleted,
                }
            }
        })()
            .then(r => {
                res.header('Access-Control-Allow-Origin', ['*']);                                
                res.json(r)
            })
            .catch(e => {
                console.log('post /api/question/topic/remove', e);
                next(e);
            })
    })

// 答案
router.route('/option')
    .post((req, res, next) => {
        (async () => {
            const {
                topic_id,
                text,
                value,
            } = req.body;
            const option = await Option.create({
                topic_id,
                text,
                value,
            })
            return {
                code: 0,
                data: {
                    option,
                }
            }
        })()
            .then(r => {
                res.header('Access-Control-Allow-Origin', ['*']);
                res.json(r);
            })
            .catch(e => {
                console.log('post /api/question/option', e);
                next(e);
            })
        
    })
// 某题答案列表
router.route('/option/list')
    .post((req, res, next) => {
        (async () => {
            const {topic_id} = req.body;
            const options = await Option.getOptionsByTopicId(topic_id);
            return {
                code: 0,
                data: {
                    options,
                }
            }
        })()
            .then(r => {
                res.header('Access-Control-Allow-Origin', ['*']);
                res.json(r);
            })
            .catch(e => {
                console.log('post /api/question/option/list', e);
                next(e);
            })
    })
// 删除某题答案
router.route('/option/remove')
    .post(auth(), (req, res, next) => {
        (async () => {
            const { option_id } = req.body;
            const deleted = await Option.deleteOneOption(option_id);
            return {
                code: 0,
                data: {
                    deleted,
                }
            }
        })()
            .then(r => {
                res.header('Access-Control-Allow-Origin', ['*']);
                res.json(r);
            })
            .catch(e => {
                console.log('post /api/question/option/remove', e);
                next(e);
            })
    })

router.route('/submit')
    .post((req, res, next) => {
        (async () => {
            const {
                issue,
                uid,
                items,
            } = req.body;
            console.log(issue, uid, items)
            return {
                code: 0,
                data: {
                    issue,
                    uid,
                    items,
                }
            }
        })()
            .then(r => {
                res.header('Access-Control-Allow-Origin', ['*']);                
                res.json(r)
            })
            .catch(e => {
                console.log('post /api/questions', e);
                next(e)
            })
    })

module.exports = router;
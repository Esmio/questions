const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Errors = require('../../errors');


const IssueSchema = new Schema({
    issue: String,
    title: String,
    remark: String,
    create: Date,
    status: {type: Number, default: 0},
})

const IssueModel = mongoose.model('issue', IssueSchema);

async function create(params) {
    let {
        issue,
        title,
        remark,
        create,
    } = params;
    create = create || Date.now();
    const question = new IssueModel({
        issue,
        title,
        remark,
        create,
    })
    let created = await question.save()
        .catch(e => {
            console.log('create issue', e);
        })
    return created;
}

async function list(params = { page: 0, pageSize: 10 }) {
    const {page, pageSize} = params;
    const flow = IssueModel.find({});
    const total = await IssueModel.countDocuments({});
    flow.skip(page * pageSize);
    flow.limit(pageSize);
    flow.sort({
        'create': -1
    })
    const list = await flow
        .catch(e => {
            throw new Error('error getting issue list from db');
        })
    return {
        list,
        total,
    }
}

async function deleteIssue(oid) {
    let deleted = await IssueModel.deleteOne({'_id': oid})
        .catch(e => {
            throw new Error('error deleting Issue', e);
        })
    return deleted;
}

async function updateIssue(oid, options) {
    return await IssueModel.findOneAndUpdate({_id: oid}, options, {new: true})
        .catch(e => {
            throw new Error(`error update issue of oid: ${oid}`);
        })
}

module.exports = {
    model: IssueModel,
    create,
    list,
    deleteIssue,
    updateIssue,
}
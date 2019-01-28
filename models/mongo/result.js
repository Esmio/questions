const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Errors = require('../../errors');


const ResultSchema = new Schema({
    issue_id: {type: Schema.Types.ObjectId, required: true},
    uid: {type: Number, required: true},
    items: {type: String, required: true},
    create_time: Date,
    status: {type: Number, default: 0},
})

const ResultModel = mongoose.model('result', ResultSchema);

async function create(params) {
    const {
        issue_id,
        uid,
        items,
    } = params;
    const create_time = Date.now();
    const result = new ResultModel({
        issue_id,
        uid,
        items,
        create_time,
    })
    const created = await result.save()
        .catch(e => {
            console.log('error creating result', e);
        })
    return created
}

async function findResultsByIssueId(issue_id) {
    const results = await ResultModel.find({issue_id})
        .catch(e => {

        })
    return results;
}

async function findExistedOne(params) {
    const { 
        issue_id,
        uid,
    } = params;
    const result = await ResultModel.findOne({
        issue_id,
        uid,
    })
    return result;
}

module.exports = {
    model: ResultModel,
    create,
    findExistedOne,
    findResultsByIssueId,
}
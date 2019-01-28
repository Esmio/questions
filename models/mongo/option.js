const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Errors = require('../../errors');

const now = new Date();

const OptionSchema = new Schema({
    topic_id: Schema.Types.ObjectId,
    issue_id: Schema.Types.ObjectId,
    text: String,
    value: Number,
    create: Date,
    status: {type: Number, default: 0},
})

const OptionModel = mongoose.model('option', OptionSchema);

async function create(params) {
    let {
        topic_id,
        issue_id,
        text,
        value,
        create,
    } = params;
    create = create || Date.now();
    const option = new OptionModel({
        topic_id,
        issue_id,
        text,
        value,
        create,
    })
    let created = await option.save()
        .catch(e => {
            console.log('create option', e);
        })
    return created;
}

async function getOptionsByTopicId(id) {
    let flow = OptionModel.find({
        topic_id: id,
    });
    flow.sort({
        'value': 1,
    })
    return await flow
        .catch(e => {
            throw new Error('error getting options from db');
        })
}

async function deleteOneOption(id) {
    const deleted = await OptionModel.deleteOne({_id: id})
        .catch(e => {
            throw new Error('error delete option by _id');
        })
    return deleted;
}

async function deleteOptionsByTopicId(id) {
    return await OptionModel.deleteMany({topic_id: id})
        .catch(e => {
            throw new Error('error delete options by topic_id');
        })
}

async function deleteOptionsByIssueId(id) {
    return await OptionModel.deleteMany({issue_id: id})
        .catch(e => {
            throw new Error('error delete options by issue_id');
        })
}

module.exports = {
    model: OptionModel,
    create,
    getOptionsByTopicId,
    deleteOneOption,
    deleteOptionsByTopicId,
    deleteOptionsByIssueId,
}
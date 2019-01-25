const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Errors = require('../../errors');

const TopicSchema = new Schema({
    issue_id: Schema.Types.ObjectId,
    issue: String,
    type: String,
    title: String,
    number: Number,
    required: Number,
    multi: Number,
    othervalue: Number,
    value: String,
    follow: String,
    create: Date,
    status: {type: Number, default: 0},
})

const TopicModel = mongoose.model('topic', TopicSchema);

async function create(params) {
    const {
        issue,
        issue_id,
        type,
        title,
        number,
        required,
        multi,
        othervalue,
        value,
        follow,
    } = params;
    const create = Date.now();
    const topic = new TopicModel({
        issue,
        issue_id,
        type,
        title,
        number,
        required,
        multi,
        othervalue,
        follow,
        value,
        create,
    })
    let created = await topic.save()
        .catch(e => {
            console.log('create topic', e);
        })
    return created;
}

async function getListByIssueId(issue_id) {
    return await TopicModel.find({issue_id})
        .catch(e => {
            console.log('error getting topic by issue_id', e);
        })
}

async function deleteOneTopic(topic_id) {
    return await TopicModel.deleteOne({_id: topic_id})
        .catch(e => {
            console.log('error delete topic by topic_id', e);
        })
}

module.exports = {
    model: TopicModel,
    create,
    getListByIssueId,
    deleteOneTopic,
}
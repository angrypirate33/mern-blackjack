const mongoose = require('mongoose')
const Schema = mongoose.Schema

const cardSchema = new Schema({
    id: String,
    face: String,
    value: Number
}, { _id: false })

const handSchema = new Schema({
    dealerCards: {
        type: [cardSchema],
        required: true
    },
    dealerScore: {
        type: Number,
        required: true
    },
    playerCards: {
        type: [cardSchema],
        required: true
    },
    playerScore: {
        type: Number,
        required: true
    },
    result: {
        type: String,
        required: true,
        enum: ['win', 'loss', 'push']
    },
    wagerAmount: {
        type: Number,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('hand', handSchema)
const User = require('../../models/user')
const Hand = require('../../models/hand')

module.exports = {
    add
}

async function add(req, res) {
    try {
        if (!req.body || !req.body.userId || !req.body.dealerCards || !req.body.playerCards || !req.body.result || !req.body.wagerAmount) {
            return res.status(400).json({ error: 'Missing required fields.' })
        }

        const hand = new Hand({
            userId: req.body.userId,
            dealerCards: req.body.dealerCards,
            playerCards: req.body.playerCards,
            result: req.body.result,
            wagerAmount: req.body.wagerAmount
        })

        await hand.save()

        res.status(200).json({ message: 'Hand successfully added.', hand: hand})

    } catch (error) {
        console.error('Error adding hand: ', error)
        res.status(500).json({ error: 'Internal server error.' })
    }
}
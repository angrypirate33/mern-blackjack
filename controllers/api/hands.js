const User = require('../../models/user')
const Hand = require('../../models/hand')

module.exports = {
    add,
    getHandsByUserId
}

async function add(req, res) {
    try {
        if (!req.body || !req.body.userId || !req.body.dealerCards || !req.body.playerCards || !req.body.result || !req.body.wagerAmount) {
            return res.status(400).json({ error: 'Missing required fields.' })
        }

        const hand = new Hand({
            userId: req.body.userId,
            dealerCards: req.body.dealerCards,
            dealerScore: req.body.dealerScore,
            playerCards: req.body.playerCards,
            playerScore: req.body.playerScore,
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

async function getHandsByUserId(req, res) {
    try {
        const userId = req.query.userId

        if (!userId) {
            return res.status(400).json({ error: 'UserId is required.' })
        }

        const hands = await Hand.find({ userId: userId }).sort({ createdAt: -1 })

        res.status(200).json(hands)

    } catch (error) {
        console.error('Error retreiving hand history: ', error)
        res.status(500).json({ error: 'Internal server error.' })
    }
}
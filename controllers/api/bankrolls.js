const User = require('../../models/user')

module.exports = {
    update,
    getLatestBankroll
}

async function update(req, res) {
    try {
        const user = await User.findById(req.params.userId)
        if (!user) {
            console.error('User not found for ID: ', req.params.userId)
            return res.status(400).json({error: 'User not found'})
        }
        user.bankroll = req.body.bankroll
        await user.save()

        res.status(200).json({bankroll: user.bankroll})
    } catch (err) {
        console.error('Error: ', err)
        res.status(500).json({error: 'Server error'})
    }
}

async function getLatestBankroll(req, res) {
    console.log('getLatest function hit..')
    try {
        const user = await User.findById(req.params.userId)
        if (!user) {
            return res.status(404).send({ error: 'User not found.' })
        }
        res.send({ bankroll: user.bankroll })
    } catch (error) {
        console.error('Error fetching bankroll: ', error)
        res.status(500).send({ error: 'Internal server error.' })
    }
}
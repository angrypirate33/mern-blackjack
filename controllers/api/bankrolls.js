const User = require('../../models/user')

module.exports = {
    update
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
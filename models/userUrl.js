const mongoose = require('mongoose');

const userUrlSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    urlId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'URL',
        required: true,
    },
});


userUrlSchema.index({ userId: 1, urlId: 1 }, { unique: true });

const UserURL = mongoose.model('UserURL', userUrlSchema);

module.exports = UserURL;
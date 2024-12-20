const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    action: {
        type: String,
        required: true
    },
    details: {
        type: String
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const boardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    background: {
        type: String,
        default: '#0079bf' // Default Trello blue
    },
    isStarred: {
        type: Boolean,
        default: false
    },
    activity: [activitySchema],
    visibility: {
        type: String,
        enum: ['private', 'workspace', 'public'],
        default: 'private'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual populate for lists
boardSchema.virtual('lists', {
    ref: 'List',
    localField: '_id',
    foreignField: 'board',
    options: { sort: { position: 1 } }
});

// Middleware to update timestamps
boardSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// Method to add activity
boardSchema.methods.addActivity = async function(userId, action, details) {
    this.activity.unshift({
        user: userId,
        action,
        details,
        timestamp: new Date()
    });

    // Keep only the last 50 activities
    if (this.activity.length > 50) {
        this.activity = this.activity.slice(0, 50);
    }

    return this.save();
};

// Method to check if user is member
boardSchema.methods.isMember = function(userId) {
    return this.members.some(member => member.toString() === userId.toString()) ||
           this.owner.toString() === userId.toString();
};

// Method to check if user is owner
boardSchema.methods.isOwner = function(userId) {
    return this.owner.toString() === userId.toString();
};

// Index for better query performance
boardSchema.index({ owner: 1 });
boardSchema.index({ members: 1 });
boardSchema.index({ 'activity.timestamp': -1 });

const Board = mongoose.model('Board', boardSchema);
module.exports = Board; 
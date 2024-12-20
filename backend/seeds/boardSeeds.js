const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Board = require('../models/Board.js');
const List = require('../models/List.js');
const Card = require('../models/Card.js');
const User = require('../models/User.js');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB for seeding'))
    .catch(err => console.error('MongoDB connection error:', err));

const seedDatabase = async () => {
    try {
        // Clear existing data
        await Board.deleteMany({});
        await List.deleteMany({});
        await Card.deleteMany({});

        // Create a test user if it doesn't exist
        let testUser = await User.findOne({ email: 'test@example.com' });
        if (!testUser) {
            testUser = await User.create({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123' // In production, this should be hashed
            });
        }

        // Create sample boards
        const boards = await Board.create([
            {
                title: 'Project Alpha',
                description: 'Main development board for Project Alpha',
                owner: testUser._id,
                members: [testUser._id],
                background: '#0079bf'
            },
            {
                title: 'Personal Tasks',
                description: 'Personal task tracking',
                owner: testUser._id,
                members: [testUser._id],
                background: '#519839'
            }
        ]);

        // Create sample lists for the first board
        const listsForFirstBoard = await List.create([
            {
                title: 'To Do',
                board: boards[0]._id,
                position: 0
            },
            {
                title: 'In Progress',
                board: boards[0]._id,
                position: 1
            },
            {
                title: 'Done',
                board: boards[0]._id,
                position: 2
            }
        ]);

        // Create sample lists for the second board
        const listsForSecondBoard = await List.create([
            {
                title: 'Backlog',
                board: boards[1]._id,
                position: 0
            },
            {
                title: 'This Week',
                board: boards[1]._id,
                position: 1
            },
            {
                title: 'Completed',
                board: boards[1]._id,
                position: 2
            }
        ]);

        // Create sample cards for the first board's lists
        const cardsForFirstBoard = await Card.create([
            {
                title: 'Setup Development Environment',
                description: 'Install all necessary tools and dependencies',
                listId: listsForFirstBoard[0]._id,
                position: 0
            },
            {
                title: 'Create Database Schema',
                description: 'Design and implement database structure',
                listId: listsForFirstBoard[0]._id,
                position: 1
            },
            {
                title: 'Implement Authentication',
                description: 'Working on user authentication system',
                listId: listsForFirstBoard[1]._id,
                position: 0
            },
            {
                title: 'Basic API Setup',
                description: 'Completed basic API structure',
                listId: listsForFirstBoard[2]._id,
                position: 0
            }
        ]);

        // Create sample cards for the second board's lists
        const cardsForSecondBoard = await Card.create([
            {
                title: 'Grocery Shopping',
                description: 'Buy weekly groceries',
                listId: listsForSecondBoard[0]._id,
                position: 0
            },
            {
                title: 'Gym Session',
                description: 'Monday and Wednesday workouts',
                listId: listsForSecondBoard[1]._id,
                position: 0
            },
            {
                title: 'Read Documentation',
                description: 'Complete chapter 1 and 2',
                listId: listsForSecondBoard[1]._id,
                position: 1
            }
        ]);

        // Update lists with their cards
        for (const list of listsForFirstBoard) {
            list.cards = cardsForFirstBoard
                .filter(card => card.listId.toString() === list._id.toString())
                .map(card => card._id);
            await list.save();
        }

        for (const list of listsForSecondBoard) {
            list.cards = cardsForSecondBoard
                .filter(card => card.listId.toString() === list._id.toString())
                .map(card => card._id);
            await list.save();
        }

        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

seedDatabase(); 
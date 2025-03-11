import mongoose from 'mongoose';

let models = {};

async function main() {
    try {
        await mongoose.connect('mongodb+srv://tammyn3:passWord13@cluster0.bv1ht.mongodb.net/?retryWrites=true&w=majority&appName=Plated');
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

// Define the Post Schema
const recipeSchema = new mongoose.Schema({
    title: String,
    summary: String,
    ingredients: [String],
    instructions: String,
    username: String,
    created_date: { type: Date, default: Date.now }
});

models.Post = mongoose.model('Post', recipeSchema);
console.log('Post model created');

// Define the Comment Schema
const commentSchema = new mongoose.Schema({
    username: { type: String, required: true },
    comment: { type: String, required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true }, // Reference to the Post model
    created_date: { type: Date, default: Date.now }
});

models.Comment = mongoose.model('Comment', commentSchema);
console.log('Comment model created');

main();

export default models;

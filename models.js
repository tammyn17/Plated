import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';

let models = {};

main()

async function main() {
   await mongoose.connect(process.env.MONGO_URI);

   console.log('Connected to MongoDB');

   const recipeSchema = new mongoose.Schema({
       title: String,
       summary: String,
       ingredients: [String],
       instructions: String,
       user: String,
       likes: [{ type: String }],
       created_date: { type: Date, default: Date.now }
   })
   models.Post = mongoose.model('Post', recipeSchema);
   console.log('Post model created');

   const commentSchema = new mongoose.Schema({
        username: String,
        comment: String,
        post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
        created_date: { type: Date, default: () => new Date() }
    })
    models.Comment = mongoose.model('Comment', commentSchema)
    console.log("comment model created");

}

export default models;
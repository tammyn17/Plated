import mongoose from 'mongoose';

let models = {};

main()

async function main() {
   await mongoose.connect('mongodb+srv://tammyn3:passWord13@cluster0.bv1ht.mongodb.net/?retryWrites=true&w=majority&appName=Plated');

   console.log('Connected to MongoDB');

   const recipeSchema = new mongoose.Schema({
       title: String,
       summary: String,
       ingredients: [String],
       instructions: String,
       // user: String,
       created_date: { type: Date, default: Date.now }
   })
   models.Post = mongoose.model('Post', recipeSchema);
   console.log('Post model created');
}

export default models;
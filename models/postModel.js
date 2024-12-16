import mongoose from "mongoose";

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
    },
    subtitle:{
        type: String, 
        require: true,
    },
    content:{
        type: String,
        require: true,
    },
    category:{
        type: String,
    },
    image: {
        type: String,
        require: false,
    }
})

const Article = mongoose.model("Article", articleSchema);
export default Article;
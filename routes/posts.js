import express from "express";
import multer from "multer"; // Import multer to handle file uploads
import Article from "../models/postModel.js";
import axios from "axios";

const router = express.Router(); // Create a new router object to define API routes

// Define storage settings for multer (where to store the file and how to name it)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Specify the folder where files should be saved
    cb(null, "uploads/"); // Save files in the 'uploads/' folder
  },
  filename: function (req, file, cb) {
    // Specify how to name the uploaded files
    cb(null, Date.now() + "-" + file.originalname); // Name the file with the current timestamp + original name (for uniqueness)
  },
});

const upload = multer({ storage: storage }); // Initialize multer with the defined storage settings

// Route to add a new article, handling both text data and an image upload
router.post("/add", upload.single("image"), async (req, res) => {
  // Destructure fields from the request body (data from form input)
  const { title, subtitle, content, category } = req.body;

  // Check if a file was uploaded, if so, save its path, otherwise set image to 0 (no image)
  const image = req.file ? req.file.path : null;

  try {
    // Create a new article object using the data from the request body and the image path
    const newArticle = new Article({
      title,
      subtitle,
      content,
      category,
      image,
    });

    // Save the new article to the MongoDB database
    await newArticle.save();

    // Send a success message with status code 201 (resource created)
    res.status(201).send("Article Added Successfully");
  } catch (error) {
    // If there's an error, log it in the console
    console.error("Error in Adding Article", error);

    // Send a 500 status code (server error) and a relevant error message
    res.status(500).send("Server Error");
  }
});

// Data show from Database
router.get("/view", async (req, res) => {
  try {
    const articles = await Article.find();
    //res.send(articles);
    res.status(200).json(articles);
  } catch (error) {
    console.error("Error in getting posts", error);
    res.status(500).send("Server Error");
  }
});

// Show single post
router.get("/view/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const article = await Article.findById(id);
    // res.send(article);
    res.status(200).json(article);
  } catch (error) {
    console.error("Error in getting posts", error);
    res.status(500).send("Server Error");
  }

  // Delete Data
  router.delete("/delete/:id", async (req, res) => {
    const { id } = req.params;
    try {
      await Article.findByIdAndDelete(id);
      res.status(200).send("Article Deleted Successfully");
    } catch (error) {
      console.error("Error in getting posts", error);
      res.status(500).send("Server Error");
    }
  });
});

// Update a post by id
router.patch("/update/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const { title, subtitle, content, category } = req.body;
  const image = req.file ? req.file.path : null;

  try {
    const article = await Article.findById(id);
    if (!article) {
      return res.status(404).send("Article not found");
    }
    article.title = title;
    article.subtitle = subtitle;
    article.content = content;
    article.category = category;

    if (image) {
      article.image = image;
    }

    await article.save();
    res.status(200).send("Article updated successfully");
  } catch (error) {
    console.error("Error in getting posts", error);
    res.status(500).send("Server Error");
  }
});

router.get("/top-news", async (req, res) => {
  try {
    const response = await axios.get(
      `https://newsapi.org/v2/top-headlines?sources=google-news-in&apiKey=dabb41bdfbeb488eaa812971ce14a172&q=india`
    );
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

export default router; // Export the router to be used in other parts of the app

const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');

// Create a new MongoClient
const client = new MongoClient(process.env.DB_CONNECT_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("my_blog").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
run().catch(console.dir);
//console.log('🙂' + process.env.DB_CONNECT_STRING)

// Get all posts
app.get('/posts', (req, res) => {
    res.json(blogPosts);
});

// Get a specific post by ID
app.get('/posts/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    const post = posts.find(p => p.id === postId);

    if (post) {
        res.json(post);
    } else {
        res.status(404).json({ error: 'Post not found' });
    }
});

// Create a new post
app.post('/posts', (req, res) => {
    const { title, content } = req.body;
    const newPost = { id: posts.length + 1, title, content };
    posts.push(newPost);
    res.status(201).json(newPost);
});

// Update a post by ID
app.put('/posts/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    const { title, content } = req.body;
    const post = posts.find(p => p.id === postId);

    if (post) {
        post.title = title;
        post.content = content;
        res.json(post);
    } else {
        res.status(404).json({ error: 'Post not found' });
    }
});

// Update a post partially by ID
app.patch('/posts/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    const { title, content } = req.body;
    const post = posts.find(p => p.id === postId);

    if (post) {
        if (title) post.title = title;
        if (content) post.content = content;
        res.json(post);
    } else {
        res.status(404).json({ error: 'Post not found' });
    }
});

// Delete a post by ID
app.delete('/posts/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    const postIndex = posts.findIndex(p => p.id === postId);

    if (postIndex !== -1) {
        const deletedPost = posts.splice(postIndex, 1);
        res.json(deletedPost[0]);
    } else {
        res.status(404).json({ error: 'Post not found' });
    }
});

// Start the server and listen on port 3000
app.listen(3000, () => {
    console.log('Server listening on port 3000!');
});

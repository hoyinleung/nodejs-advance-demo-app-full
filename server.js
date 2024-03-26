const express = require('express');
const app = express();
const dbOp = require('./model/posts')
const bodyParser = require('body-parser');
console.log('🙂' + dbOp.connectToDatabase())

app.use(bodyParser.json());

//Homepage
app.get('/', (req, res) => {
    res.send('API Homepage');
});

// Get all posts
app.get('/posts', async (req, res) => {
    try {
        const dbRes = await dbOp.findManyDocuments({})
        res.json(dbRes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get a specific post by ID
app.get('/posts/:id', async (req, res) => {
    try {
        const dbRes = await dbOp.findOneDocument(req.params.id);
        res.json(dbRes);
    } catch (error) {
        // Handle any errors that occur during the asynchronous operation
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


/* const pageNumber = 1; // The current page number
const pageSize = 10; // The number of documents per page

const query = {}; // Your query criteria

const documents = await collection
  .find(query)
  .skip((pageNumber - 1) * pageSize)
  .limit(pageSize)
  .toArray();

console.log(documents); */

// Create a new post
app.post('/posts', async (req, res) => {

    const newPost = {
        "title": req.body.title,
        "views": req.body.views,
        "content": req.body.content
    }

    try {
        const dbRes = await dbOp.createDocument(newPost);
        res.status(201).json(dbRes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

});

// Update a post by ID
app.put('/posts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, views, content } = req.body;
    
        // Update the entire document
        const dbRes = await dbOp.updateDocument(id, {
            title : title,
            views : views,
            content:content
        });
        res.json(dbRes);
      } 
      catch (error) {
        res.status(400).json({ message: error.message });
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
app.listen(3001, () => {
    console.log('Server listening on port 3001!');
});

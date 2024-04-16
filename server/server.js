const express = require('express');
const app = express();
const cors = require('cors')
const dbOp = require('./model/posts')
const bodyParser = require('body-parser');
//console.log('🙂' + dbOp.connectToDatabase())

app.use(bodyParser.json());

let corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions))

//Homepage
app.get('/', (req, res) => {
    res.send('API Homepage');
});

// Get all posts
app.get('/posts', async (req, res) => {
    try {
        if (req.query.page) {
            const dbRes = await dbOp.findManyDocumentsWithPagination({}, parseInt(req.query.page), parseInt(req.query.limit))
            res.json(dbRes);
        }
        else {
            const dbRes = await dbOp.findManyDocuments({})
            res.json(dbRes);
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get post with pagination
app.get('/postsWithPage', async (req, res) => {
    try {
        const dbRes = await dbOp.findManyDocumentsWithPagination({})
        res.json(dbRes);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get all hot posts
app.get('/posts/hot', async (req, res) => {
    try {
        const dbRes = await dbOp.getHotPosts(15000)
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

// Search by Keyword
app.get('/search', async (req, res) => {
    try {
        const dbRes = await dbOp.searchDocumentByKeyword(req.query.keyword)
        res.json(dbRes);
    } catch (error) {
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

// 對特定ID的document進行全部資料更新
app.put('/posts/:id', async (req, res) => {

    function hasAllRequiredFields(reqBody) {
        const requiredFields = ['title', 'content', 'views'];
        // Check if all required fields exist and have truthy values
        return requiredFields.every(field => reqBody.hasOwnProperty(field));
    }

    if (!hasAllRequiredFields(req.body)) {
        return res.status(400).json({ message: '沒有提交必要欄位資料: title, content, or views' });
    }

    try {
        const { id } = req.params;

        // Update the entire document
        const dbRes = await dbOp.updateDocument(id, req.body);
        res.json(dbRes);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 對特定ID的document更新部份資料
app.patch('/posts/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const dbRes = await dbOp.updateDocument(id, req.body);
        res.json(dbRes);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a post by ID
app.delete('/posts/:id', async (req, res) => {
    try {
        const dbRes = await dbOp.deleteDocument(req.params.id)
        res.json(dbRes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server and listen on port 3000
app.listen(3001, () => {
    console.log('Rest API後端正在3001號port運行中...');
});

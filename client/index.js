const express = require('express')
const app = express()

const urlFetch = async (url) => {
    const res = await fetch(url);
    if (res.ok) {
        const data = await res.json();
        return data
    }
}

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

app.set('view engine', 'ejs')
app.set('views', 'views')

app.get('/', async (req, res) => {

    // Get all blog post from mongodb
    const allPosts = await urlFetch(`${process.env.API_URL}posts`);

    res.render('index', {
        courseName: 'NodeJS進階課程',
        title: '首頁',
        blogs: allPosts
    })
})
//display one article
app.get('/post/:id', async (req, res) => {

    // Get all blog post from mongodb
    const postDetail = await urlFetch(`${process.env.API_URL}posts/${req.params.id}`);

    res.render('postDetail', {
        title: postDetail.title,
        post: postDetail
    })
})
app.get('/create', async (req, res) => {
    res.render('create', {
        title: '加入文章'
    })
})
app.post('/create', async (req, res) => {

    const { title, content } = req.body;

    try {
        const response = await fetch(`${process.env.API_URL}posts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(
                {
                    title: title,
                    content: content,
                    views: 0,
                }
            )
        });

        const newPost = await response.json();
        //res.status(201).json(newPost);
        res.redirect(`/post/${newPost.insertedId}`);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})
app.get('/edit/:id', async (req, res) => {

    // Check if id exists
    const id = req.params.id
    if (!id) {
        // Handle the case where id is missing (e.g., send a 400 Bad Request error)
        return res.status(400).send('Error: ID parameter is required.');
    }

    //依ID讀取特定文章資料
    const postData = await urlFetch(`${process.env.API_URL}posts/${id}`);

    res.render('edit', {
        title: '更改文章 #',
        post: postData
    })
})
app.get('/login', async (req, res) => {
    res.render('login', {
        courseName: 'NodeJS進階課程',
        title: '登入',
    })
})
app.get('/logout', async (req, res) => {
    res.send('logout page')
    //登出要做的事
})

app.get('/search', async (req, res) => {

    if (req.query.keyword) {
        const searchResult = await urlFetch(`${process.env.API_URL}search?keyword=${req.query.keyword}`);
        //console.log(searchResult)

        res.render('search', {
            title: '搜尋結果',
            data: searchResult
        })
    } else {
        res.render('search', {
            title: '搜尋結果',
            data: 'N/A'
        })
    }

})

app.use((req, res) => {
    res.status(404).render('404', { title: '找不到' })
})

app.listen(3000, () => {
    console.log('前端正在3000號port運行中...');
})
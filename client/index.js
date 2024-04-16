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
    const allPosts = await urlFetch(`http://localhost:3001/posts`);

    res.render('index', {
        courseName: 'NodeJS進階課程',
        title: '首頁',
        blogs: allPosts
    })
})
app.get('/create', async (req, res) => {
    res.render('create', {
        courseName: 'NodeJS進階課程',
        title: '加入文章'
    })
})
app.get('/edit/:id', async (req, res) => {

    // Check if id exists
    const id = req.params.id
    if (!id) {
        // Handle the case where id is missing (e.g., send a 400 Bad Request error)
        return res.status(400).send('Error: ID parameter is required.');
    }
    
    //依ID讀取特定文章資料
    const postData = await urlFetch(`http://localhost:3001/posts/${id}`);

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
        const searchResult = await urlFetch(`http://localhost:3001/search?keyword=${req.query.keyword}`);
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
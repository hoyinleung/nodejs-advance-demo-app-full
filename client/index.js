const express = require('express')
const app = express()
const axios = require('axios');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const session = require('express-session');

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());
app.use(session({
    secret: 'SessionSecret123',
    resave: false,
    saveUninitialized: false,
    //cookie: { maxAge: new Date ( Date.now() + (3600000) ) } 
  }));

app.set('view engine', 'ejs')
app.set('views', 'views')

app.use((req, res, next) => {

    const token = req.cookies['jwt-token'];

    if (!token) return res.redirect(`/login`);
    }
})

const checkLoginMiddleware = (req, res, next) => {

    const token = req.cookies['jwt-token'];

    if (!token) return res.redirect(`/login`);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("🚀 ~ checkLoginMiddleware ~ decoded:", decoded)
        req.username = decoded.username;
        next();
    } catch (error) {
        console.log('🚀')
        res.status(401).json({ message: 'Unauthorized' });
    }
}

app.get('/dashboard', checkLoginMiddleware, async (req, res) => {

    // Get all blog post from mongodb
    const allPosts = await axios.get(`${process.env.API_URL}posts`);

    res.render('dashboard', {
        courseName: 'NodeJS進階課程',
        title: 'Dashboard',
        blogs: allPosts.data,
        username: req.username
    })
})

//display one article
app.get('/post/view/:id', async (req, res) => {

    const postDetail = await axios.get(`${process.env.API_URL}posts/${req.params.id}`);

    res.render('postDetail', {
        title: postDetail.data.title,
        post: postDetail.data
    })
})

app.get('/post/create', async (req, res) => {
    res.render('create', {
        title: '加入文章'
    })
})

app.post('/post/create', async (req, res) => {

    const { title, content } = req.body;

    try {
        const response = await axios.post(
            `${process.env.API_URL}posts`,
            {
                title: title,
                content: content,
                views: 0,
            }
        )

        res.redirect(`/post/view/${response.data.insertedId}`);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.get('/post/edit/:id', async (req, res) => {

    // Check if id exists
    const id = req.params.id
    if (!id) {
        // Handle the case where id is missing (e.g., send a 400 Bad Request error)
        return res.status(400).send('Error: ID parameter is required.');
    }

    //依ID讀取特定文章資料
    //const postData = await urlFetch(`${process.env.API_URL}posts/${id}`);
    const postData = await axios.get(`${process.env.API_URL}posts/${id}`);

    res.render('edit', {
        title: '更改文章 #',
        post: postData.data
    })
})
app.post('/post/edit/:id', async (req, res) => {

    // Check if id exists
    const id = req.params.id
    if (!id) {
        // Handle the case where id is missing (e.g., send a 400 Bad Request error)
        return res.status(400).send('Error: ID parameter is required.');
    }

    //User's form data
    const { title, content } = req.body;

    //依ID讀取特定文章資料
    const response = await axios.patch(
        `${process.env.API_URL}posts/${id}`,
        {
            title: title,
            content: content,
        }
    )
    console.log(`edit #id ${id} response`, response.data)

    res.redirect(`/post/edit/${id}`);
})
app.get('/register', async (req, res) => {
    res.render('register', {
        title: '註冊'
    })
})
app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            const user = await User.create({ username, password: hashedPassword });
            res.status(201).json({ message: 'User Created', user });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' })
        }

    } catch (error) {
        console.log(error);
    }
});
app.get('/login', async (req, res) => {
    res.render('login', {
        title: '登入'
    })
})
app.post('/login', async (req, res) => {

    const { username, password } = req.body;

    try {
        console.log('✅')
        const response = await axios.post(
            `${process.env.API_URL}authenticate`,
            {
                "username": username,
                "password": password
            }
        )

        const token = jwt.sign({ username: username }, process.env.JWT_SECRET);

        res.cookie('jwt-token', token, { httpOnly: true });
        res.redirect('/');

    } catch (error) {
        if (error.response && error.response.status === 401) {
            // Handle the 401 error specifically
            console.error('Authentication error:', error.response.data);
            res.status(401).json({ message: 'Invalid username or password' });
        }
        else 
        {
            console.log('error', error)
            res.status(500).json({ message: 'Internal server error' })
        }
    }

})
app.get('/logout', async (req, res) => {
    res.clearCookie('jwt-token');
    res.redirect('/');
})

app.get('/search', async (req, res) => {

    if (req.query.keyword) {
        const searchResult = await axios.get(`${process.env.API_URL}search?keyword=${req.query.keyword}`);

        res.render('search', {
            title: '搜尋結果',
            data: searchResult.data
        })
    } else {
        res.render('search', {
            title: '搜尋結果',
            data: 'N/A'
        })
    }

})

app.get('/', async (req, res) => {

    // Get all blog post from mongodb
    const allPosts = await axios.get(`${process.env.API_URL}posts`);

    res.render('index', {
        courseName: 'NodeJS進階課程',
        title: '首頁',
        blogs: allPosts.data
    })
})

app.use((req, res) => {
    res.status(404).render('404', { title: '找不到' })
})

app.listen(3000, () => {
    console.log('前端正在3000號port運行中...');
})
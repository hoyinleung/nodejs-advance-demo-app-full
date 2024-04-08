const express = require('express')
const app = express()

const urlFetch = async (url) => {
    const res = await fetch(url);
    if(res.ok){
        const data = await res.json();
        return data
    }
}

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

app.set('view engine', 'ejs')
app.set('views', 'page')

app.get('/', (req, res) => {

    // Get all blog post from mongodb

    res.render('index', {
        courseName: 'NodeJS進階課程',
        title: '首頁'
    })
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

/* app.post('/',(req,res)=>{
    console.log(req.body)
    console.log(req.body.username)
    console.log(req.body.password)
}) */

app.use((req, res) => {
    res.status(404).render('404', { title: '找不到' })
})

app.listen(3000, () => {
    console.log('前端正在3000號port運行中...');
})
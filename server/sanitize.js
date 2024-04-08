const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

// Apply the sanitizer middleware before routes
//app.use(mongoSanitize());

function sanitizeNoSQL(allowedChars = /[^\$\.`]/g) {
    return function (req, res, next) {
        const sanitizeObject = (obj) => {
            if (obj) {
                for (const key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        obj[key] = obj[key].replace(allowedChars, '');
                    }
                }
            }
        };

        sanitizeObject(req.body);
        sanitizeObject(req.params);
        sanitizeObject(req.headers);
        sanitizeObject(req.query);

        next();
    };
}

app.use(sanitizeNoSQL());

app.post('/user', (req, res) => {

    let userData = req.body;
    //console.log("🚀 ~ app.post ~ body:", userData)

    // Example with malicious code (MongoDB operator injection)
    userData.name = "John Doe";
    userData.email = "john@example.com";
    userData.$gt = { age: 18 }; // This is malicious code for MongoDB

    //console.log("Original Data:", userData);

    // Simulate saving to database (usually wouldn't log actual data)
    //console.log("Data saved (assuming database interaction):", userData);

    res.send('User created!');
});

app.listen(3000, () => console.log('Server listening on port 3000'));

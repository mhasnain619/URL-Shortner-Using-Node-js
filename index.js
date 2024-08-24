const express = require("express");
const path = require('path');
const cookieParser = require('cookie-parser');
const { connectToMongoDB } = require('./connect');
const URL = require('./models/url');
const staticRoutes = require('./routes/staticRouter');
const urlRoute = require('./routes/url');
const userRoute = require('./routes/user');
const { restrictToLogedUserOnly, checkAuth } = require('./middlewares/auth');
const app = express();
const PORT = 8001;

connectToMongoDB('mongodb://localhost:27017/short-url')
    .then(() => {
        console.log('Mongodb Connected Successfully');
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err);
    });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use('/url', restrictToLogedUserOnly, urlRoute);
app.use('/user', userRoute);
app.use('/', checkAuth, staticRoutes);

app.get('/url/:shortId', async (req, res) => {
    const shortId = req.params.shortId;

    try {
        const entry = await URL.findOneAndUpdate(
            { shortId },
            {
                $push: {
                    visitHistory: {
                        timestamp: Date.now(),
                    },
                },
            },
            { new: true } // Ensures that the updated document is returned
        );

        if (entry && entry.redirectURL) {
            res.redirect(entry.redirectURL);
        } else {
            res.status(404).send('URL not found');
        }
    } catch (error) {
        console.error('Error processing the URL:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Handle unmatched routes
app.use((req, res) => {
    res.status(404).render('404', { message: 'Page not found' });
});

app.listen(PORT, () => {
    console.log("Server Started at PORT : " + PORT);
});

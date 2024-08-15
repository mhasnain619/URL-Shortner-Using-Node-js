const express = require("express");
const path = require('path');
const { connectToMongoDB } = require('./connect');
const URL = require('./models/url');
const staticRoutes = require('./routes/staticRouter');
const urlRoute = require('./routes/url');

const app = express();
const PORT = 8001;

connectToMongoDB('mongodb://localhost:27017/short-url')
    .then(() => {
        console.log('Mongodb Connected Successfully');
    });

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/url', urlRoute);
app.use('/', staticRoutes); // Corrected this line

app.get('/:shortId', async (req, res) => {
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
            // Handle the case where the entry was not found or redirectURL is not available
            res.status(404).send('URL not found');
        }
    } catch (error) {
        // Handle any other errors
        console.error('Error processing the URL:', error);
        res.status(500).send('Internal Server Error');
    }
});
app.listen(PORT, () => {
    console.log("Server Started at PORT : " + PORT);
});

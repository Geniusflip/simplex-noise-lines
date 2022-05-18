const express = require('express');
const fs = require('fs');

const app = express();
const PORT = 8000;
app.use('/script.js', express.static('./script.js'));
app.get('/', (req, res) => {
    res.send(fs.readFileSync('index.html', 'utf-8'))
})

app.listen(PORT, () => {
    console.log(`listening at http://localhost:${PORT}`);
})
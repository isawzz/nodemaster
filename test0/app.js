const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 2121;
const app = express();
app.use(express.static(path.join(__dirname, '..'))); //Serve public directory

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./index.html"));
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));













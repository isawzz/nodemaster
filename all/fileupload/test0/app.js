const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");

const { fileExtLimiter, filesPayloadExists, fileSizeLimiter } = require('../server/file');

const PORT = process.env.PORT || 4041;

const app = express();

app.use(express.static(path.join(__dirname, '..'))); //Serve public directory

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.post('/upload',
	fileUpload({ createParentPath: true }),
	//filesPayloadExists,
	//fileExtLimiter(['.png', '.jpg', '.jpeg']),
	//fileSizeLimiter,
	(req, res) => {
		const files = req.files
		console.log(files)

		Object.keys(files).forEach(key => {
			const filepath = path.join(__dirname, '../files', files[key].name)
			files[key].mv(filepath, (err) => {
				if (err) return res.status(500).json({ status: "error", message: err })
			})
		})

		return res.json({ status: 'success', message: Object.keys(files).toString() })
	}
)




app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const http = require('http')
const fs = require('fs')
const path = require('path')

const PORT = process.env.PORT || 3000
const STATIC_DIR = path.join(process.cwd(), '..', 'sdk')

const wichFile = pathName => {
	if (pathName === '/sdk.js') return path.join('dist', 'sdk.js')
	if (pathName === '/style.css') return path.join('dist', 'style.css')
	if (pathName === '/index.d.ts') return path.join('package', 'index.d.ts')
	if (pathName === '/types.d.ts') return path.join('package', 'types.d.ts')
	return 'THIS_FILE_DOES_NOT_EXIST'
}

const server = http.createServer((req, res) => {
	// Remove query parameters and decode the URL
	const filePath = path.join(
		STATIC_DIR,
		decodeURIComponent(wichFile(req.url))
	)

	fs.readFile(filePath, (err, data) => {
		if (err) {
			if (err.code === 'ENOENT') {
				res.writeHead(200, { 'Content-Type': 'text/plain' })
				res.end('for js: /sdk.js\nfor css: /style.css\nfor types: /index.d.ts or /types.d.ts')
			} else {
				res.writeHead(500, { 'Content-Type': 'text/plain' })
				res.end('500 Internal Server Error')
			}
		} else {
			const ext = path.extname(filePath)
			if (ext === '.js') {
				res.writeHead(200, { 'Content-Type': 'text/javascript' })
			} else if (ext === '.css') {
				res.writeHead(200, { 'Content-Type': 'text/css' })
			} else {
				res.writeHead(200, { 'Content-Type': 'text/plain' })
			}
			res.end(data)
		}
	})
})

server.listen(PORT, () => {
	console.log(`SDK delivery server running at http://localhost:${PORT}/`)
})

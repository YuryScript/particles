const fs = require('fs');

const buildPath = 'build/src/';
const files = ['README.md', 'package.json', 'LICENSE'];

copyReadmeIntoDistFolder();

function copyReadmeIntoDistFolder() {
	for (const file of files) {
		if (!fs.existsSync(file)) {
			throw new Error(`${file} does not exist`);
		} else {
			fs.copyFileSync(file, buildPath + file);
		}
	}
}
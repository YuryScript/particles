const fs = require('fs');

const BUILD_LIB_PATH = 'build/';
const README_PATH = 'README.md';
const PACKAGE_PATH = 'package.json';

const PATH_TO = BUILD_LIB_PATH + README_PATH;

copyReadmeIntoDistFolder();

function copyReadmeIntoDistFolder() {
	if (!fs.existsSync(README_PATH)) {
		throw new Error('README.md does not exist');
	} else {
		fs.copyFileSync(README_PATH, PATH_TO);
	}

	if (!fs.existsSync(PACKAGE_PATH)) {
		throw new Error('package.json does not exist');
	} else {
		fs.copyFileSync(PACKAGE_PATH, BUILD_LIB_PATH + PACKAGE_PATH);
	}
}
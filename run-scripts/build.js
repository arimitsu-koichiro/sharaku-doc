const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const md = require('markdown-it')();
const sharakuDocDir = path.join(__dirname, '../');
const filesBaseDir = path.join(sharakuDocDir, 'files');
const outputBaseDir = path.join(sharakuDocDir, 'dist');
const walkSync = (d) => fs.statSync(d).isDirectory() ? fs.readdirSync(d).map(f => walkSync(path.join(d, f))) : d;
function generateRec(here) {
    const isDir = fs.statSync(here).isDirectory();
    if (isDir) {
        fs.readdirSync(here).forEach(file => {
            generateRec(path.join(here, file));
        });
    } else {
        const hier = path.dirname(here).replace(filesBaseDir, '');
        const outputDir = path.join(outputBaseDir, hier);
        const fileName = path.join(outputDir, path.basename(here).replace('.md', '.html'));
        mkdirp.sync(outputDir);
        fs.writeFileSync(fileName, md.render(fs.readFileSync(here).toString()));
    }
}
generateRec(filesBaseDir);
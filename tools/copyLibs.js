const fs = require('fs-extra')
const path = require('path')

const libsPathList = [
    {
        path: path.join(
            __dirname,
            '../',
            'node_modules/react/umd/react.production.min.js'
        ),
        name: 'react.js'
    },
    {
        path: path.join(
            __dirname,
            '../',
            'node_modules/react-dom/umd/react-dom.production.min.js'
        ),
        name: 'react-dom.js'
    }
]

const savePath = path.join(__dirname, '../', 'src/libs/')

function copyPaste() {
    fs.emptyDirSync(savePath)
    libsPathList.forEach(item => {
        fs.copySync(item.path, savePath + item.name)
    })
}

copyPaste()

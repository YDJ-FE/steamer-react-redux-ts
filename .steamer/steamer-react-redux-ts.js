const fs = require('fs');
const path = require('path');


const files = [
    "config",
    "src",
    "tools",
    "typings",
    ".gitignore",
    ".npmrc",
    ".stylelintignore",
    ".stylelintrc.js",
    "package.json",
    "postcss.config.js",
    "qshell.json",
    "qshell.prod.json",
    "README.md",
    "tsconfig.json",
    "tslint.json"
]

module.exports = {
    files: files,
    beforeCopy: function(answers, folderPath) {
        if(!!answers.jest) {
            files.push('test', 'jest.config.js')
        }
    },
    beforeInstall: function(answers, folderPath) {
        if (!!answers.jest) {
            let pkg = this.getPkgJson(folderPath);
            pkg.dependencies = Object.assign({}, pkg.dependencies, {
                enzyme: "^3.3.0",
                jest: "^22.4.4"
            });
            pkg.devDependencies = Object.assign({}, pkg.devDependencies, {
                "@types/enzyme": "^3.1.10",
                "@types/jest": "^22.2.3",
                "enzyme-adapter-react-16": "^1.1.1",
            });
            pkg.scripts = Object.assign({}, pkg.scripts, {
                test: "jest",
                coverage: "jest --coverage"
            });
            fs.writeFileSync(path.join(folderPath, 'package.json'), JSON.stringify(pkg, null, 4), 'utf-8');
        }
    },
    options: [
        {
            type: "input",
            name: "webserver",
            message: "html url(//localhost:9000/)",
            default: "//localhost:9000/"
        },
        {
            type: "input",
            name: "cdn",
            message: "common cdn url(//ss.yidejia.com/)",
            default: "//ss.yidejia.com/"
        },
        {
            type: "input",
            name: "port",
            message: "development server port(9000)",
            default: "9000"
        },
        {
            type: "confirm",
            name: "jest",
            message: "wanna to use jest for your project?",
            default: false
        }
    ]
};

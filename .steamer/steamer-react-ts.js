const fs = require('fs')
const path = require('path')
const replaceReduxFilesToMobx = require('./replace-redux-files-to-mobx')
const supportSvgComponent = require('./support-svg-component')

const onInstall = function(folderPath, config) {
    const pkg = this.getPkgJson(folderPath)
    let pkgHasChanged = false
    if (!!config.mobx) {
        pkgHasChanged = true
        pkg.dependencies = Object.assign({}, pkg.dependencies, {
            mobx: '^5.0.0',
            'mobx-react': '^5.2.2',
            'mobx-react-router': '^4.0.4'
        })
        const rmMods = {
            dependencies: [
                'react-redux',
                'react-router-redux',
                'redux',
                'redux-immutable',
                'redux-saga',
                'reselect'
            ],
            devDependencies: ['@types/react-redux', '@types/react-router-redux']
        }
        for (const dep of Object.keys(rmMods)) {
            for (const mod of rmMods[dep]) {
                delete pkg[dep][mod]
            }
        }
        replaceReduxFilesToMobx.bind(this)(folderPath)
    }
    if (!!config.svg) {
        pkgHasChanged = true
        pkg.devDependencies = Object.assign({}, pkg.devDependencies, {
            '@svgr/webpack': '^2.1.1'
        })
        supportSvgComponent.bind(this)(folderPath)
    }
    if (!!config.jest) {
        pkgHasChanged = true
        pkg.dependencies = Object.assign({}, pkg.dependencies, {
            enzyme: '^3.3.0',
            jest: '^22.4.4'
        })
        pkg.devDependencies = Object.assign({}, pkg.devDependencies, {
            '@types/enzyme': '^3.1.10',
            '@types/jest': '^22.2.3',
            'enzyme-adapter-react-16': '^1.1.1'
        })
        pkg.scripts = Object.assign({}, pkg.scripts, {
            test: 'jest',
            coverage: 'jest --coverage'
        })
    }
    if (pkgHasChanged) {
        fs.writeFileSync(
            path.join(folderPath, 'package.json'),
            JSON.stringify(pkg, null, 4),
            'utf-8'
        )
    }
    this.walkAndReplace(
        folderPath,
        ['.js', '.jsx', '.ts', '.tsx', '.html', '.json'],
        {
            ProjectName: config.projectName.replace(/^[a-z]/, l =>
                l.toUpperCase()
            ),
            projectName: config.projectName.replace(/^[A-Z]/, L =>
                L.toLowerCase()
            )
        }
    )
}

module.exports = {
    files: [
        'config',
        'src',
        'tools',
        'typings',
        '.gitignore',
        '.lintstagedrc',
        '.npmrc',
        '.prettierrc',
        '.stylelintrc.js',
        'package.json',
        'postcss.config.js',
        'qshell.qa.json',
        'qshell.prod.json',
        'README.md',
        'tsconfig.json',
        'tsconfig.webpack.json',
        'tslint.json'
    ],
    beforeInstallCopy: function(answers, folderPath, files) {
        console.log('------------- beforeInstallCopy -------------')
        if (!!answers.jest) {
            files.push('test', 'jest.config.js')
        }
    },
    beforeInstallDep: function(answers, folderPath) {
        console.log('------------- beforeInstallDep -------------')
        onInstall.bind(this)(folderPath, answers)
    },
    beforeUpdateDep: function() {
        console.log('------------- beforeUpdateDep -------------')
        const folderPath = process.cwd()
        const answersConfig = this.readKitConfig(
            path.join(folderPath, 'config/steamer.config.js')
        )
        onInstall.bind(this)(folderPath, answersConfig)
    },
    options: [
        {
            type: 'input',
            name: 'webserver',
            message: 'dev server domain(//localhost)',
            default: '//localhost'
        },
        {
            type: 'input',
            name: 'cdn',
            message: 'common cdn domain(//ss.yidejia.com)',
            default: '//ss.yidejia.com'
        },
        {
            type: 'input',
            name: 'port',
            message: 'dev server port(9000)',
            default: '9000'
        },
        {
            type: 'confirm',
            name: 'jest',
            message: 'wanna use jest to unit test?(N)',
            default: false
        },
        {
            type: 'confirm',
            name: 'mobx',
            message: 'wanna use mobx instead of redux?(N)',
            default: false
        },
        {
            type: 'confirm',
            name: 'svg',
            message: 'support svg component?(N)',
            default: false
        }
    ]
}

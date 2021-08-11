const {logger, fs, path, globby} = require('@vuepress/shared-utils')
// const Vue = require('vue');


module.exports = ({}, context) => ({

    name : '@vuepress/latex',
    
    extendMarkdown: md => {
        md.set({ breaks: true })
        md.use(require('./markdown-it-latex'))
    },
    
})
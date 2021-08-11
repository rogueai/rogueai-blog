const {description} = require('../../package')

module.exports = {
    /**
     * Ref：https://v1.vuepress.vuejs.org/config/#title
     */
    title : 'Rogue.AI',
    /**
     * Ref：https://v1.vuepress.vuejs.org/config/#description
     */
    description : description,

    /**
     * Extra tags to be injected to the page HTML `<head>`
     *
     * ref：https://v1.vuepress.vuejs.org/config/#head
     */
    head : [
        [ 'meta', {name : 'theme-color', content : '#3eaf7c'} ],
        [ 'meta', {name : 'apple-mobile-web-app-capable', content : 'yes'} ],
        [ 'meta', {name : 'apple-mobile-web-app-status-bar-style', content : 'black'} ],
        [ "link", { rel: "stylesheet", href: "/css/katex.css" }],
        [ "link", { rel: "stylesheet", href: "/css/article.css" }],
        [ "link", { rel: "stylesheet", href: "/css/post.css" }],
        [ "script", {src : "/js/base.js"} ]
    ],

    /**
     * Theme configuration, here is the default theme configuration for VuePress.
     *
     * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
     */
    themeConfig : {
        repo : '',
        editLinks : false,
        docsDir : '',
        editLinkText : '',
        lastUpdated : false,

        nav : [
            {
                text : 'Posts',
                link : '/posts/',
            },
            {
                text : 'VuePress',
                link : 'https://v1.vuepress.vuejs.org'
            }
        ],
        sidebar : {
            '/posts/' : [
                {
                    title : 'Posts',
                    collapsable : false,
                    children : [
                        '',
                        'latex-async',
                        [ 'post', 'Post' ]
                    ]
                }
            ],
        }
    },

    /**
     * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
     */
    plugins : [
        require('./plugins/vuepress-plugin-latex'),
        '@vuepress/back-to-top',
        '@vuepress/plugin-back-to-top',
        '@vuepress/plugin-medium-zoom'
    ]
}

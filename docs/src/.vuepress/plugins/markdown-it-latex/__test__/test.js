/* eslint-env jest */
/* eslint-disable no-template-curly-in-string */

const markdownIt = require('markdown-it')
const markdownItLatex = require('../index')

function getMarkdownIt () {
    return markdownIt({
        html: false,
        xhtmlOut: true,
        typographer: true
    })
}

const commonMd = getMarkdownIt().use(markdownItLatex)

test('empty set', () => {
    const mdContent = '${latex:example.tex}';
    expect(commonMd.render(mdContent)).toBeDefined();
})

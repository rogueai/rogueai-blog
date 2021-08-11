'use strict';

const fs = require('fs');
const path = require('path');
const ljs = require('latex.ts')
const {createHTMLWindow} = require('svgdom')

function generateCss(generator) {
    let twp, mlwp, mrwp, mpwp;
    let model = {};

    let length = generator.getLength('textwidth');
    twp = 100 * length.ratio(generator.getLength('paperwidth'));
    mlwp = 100 * generator.getLength('oddsidemargin').add(new generator.length(1, "in")).ratio(generator.getLength('paperwidth'));
    mrwp = Math.max(100 - twp - mlwp, 0);
    let cssStyle = {
        'textwidth' : generator.round(twp) + "%",
        'size' : generator.getLength('@@size').value,
        'marginleftwidth' : generator.round(mlwp) + "%",
        'marginrightwidth' : generator.round(mrwp) + "%",
    }
    if (mrwp > 0) {
        mpwp = 100 * 100 * generator.getLength('marginparwidth').ratio(generator.getLength('paperwidth')) / mrwp;
        cssStyle['marginparwidth'] = generator.round(mpwp) + "%";
    } else {
        model.cssStyle['marginparwidth'] = "0px";
    }
    cssStyle['marginparsep'] = generator.getLength('marginparsep').value;
    cssStyle['marginparpush'] = generator.getLength('marginparpush').value;

    let cssFile = `
    .katex-post {
        --textwidth: ${cssStyle.textwidth};
        /*--size: ${cssStyle.size};*/
        --marginleftwidth: ${cssStyle.marginleftwidth};
        --marginrightwidth: ${cssStyle.marginrightwidth};
        --marginparwidth: ${cssStyle.marginparwidth};
        --marginparsep: ${cssStyle.marginparsep};
        --marginparpush: ${cssStyle.marginparpush};
    }


    @media (max-width: 720px) {
        .katex-post {
            --marginrightwidth: unset;
            --marginparwidth: unset;
        }
    }`;
    fs.writeFileSync('../public/css/post.css', cssFile);
}

function generateHtml(dir, file) {

    global.window = createHTMLWindow()
    global.document = window.document

    let latex = fs.readFileSync(path.join(dir, file)).toString();

    let generator = new ljs.HtmlGenerator({hyphenate : false})
    let doc = ljs.parse(latex, {generator : generator}).htmlDocument().body.innerHTML;

    // TODO FIXME we need to remove window, otherwise require('vue-template-compiler') fails
    delete global.window;
    delete global.document;

    return doc;
}

function latex_html(tokens, idx /*, options, env */) {
    return tokens[idx].content;
}

function create_rule(md, options) {
    const _root = options && options.root ? options.root : process.cwd()
    var arrayReplaceAt = md.utils.arrayReplaceAt;
    var ucm = md.utils.lib.ucmicro;
    var ZPCc = new RegExp([ ucm.Z.source, ucm.P.source, ucm.Cc.source ].join('|'));

    var replaceRE = /(\${latex:(.*\.tex)})/;
    var scanRE = /(\${latex:(.*\.tex)})/;

    function splitTextToken(text, level, Token) {
        var token, last_pos = 0, nodes = [];

        text.replace(replaceRE, function(match, offset, src) {

            // Add new tokens to pending list
            if (offset > last_pos) {
                token = new Token('text', '', 0);
                token.content = text.slice(last_pos, offset);
                nodes.push(token);
            }

            token = new Token('latex', '', 0);
            token.markup = 'latex';
            token.content = `
            <div class="katex-page katex-post">
            ${generateHtml(_root, src)}
            </div>
            `;
            nodes.push(token);

            last_pos = offset + match.length;
        });

        if (last_pos < text.length) {
            token = new Token('text', '', 0);
            token.content = text.slice(last_pos);
            nodes.push(token);
        }

        return nodes;
    }

    return function latex_replace(state) {
        var i, j, l, tokens, token,
            blockTokens = state.tokens,
            autolinkLevel = 0;

        for (j = 0, l = blockTokens.length; j < l; j++) {
            if (blockTokens[j].type !== 'inline') {
                continue;
            }
            tokens = blockTokens[j].children;

            // We scan from the end, to keep position when new tags added.
            // Use reversed logic in links start/end match
            for (i = tokens.length - 1; i >= 0; i--) {
                token = tokens[i];

                if (token.type === 'link_open' || token.type === 'link_close') {
                    if (token.info === 'auto') {
                        autolinkLevel -= token.nesting;
                    }
                }

                if (token.type === 'text' && autolinkLevel === 0 && scanRE.test(token.content)) {
                    // replace current node
                    blockTokens[j].children = tokens = arrayReplaceAt(
                        tokens, i, splitTextToken(token.content, token.level, state.Token)
                    );
                }
            }
        }
    };
}

module.exports = function latex_plugin(md, options) {
    md.renderer.rules.latex = latex_html;
    md.core.ruler.push('latex', create_rule(md, options));
};
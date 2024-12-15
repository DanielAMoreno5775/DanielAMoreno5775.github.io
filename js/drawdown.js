/**
 * drawdown.js
 * (c) Adam Leggett
 * 
 * List of features I added:
 *      *   ==lorem ipsum== for underlining
 *      *   [[{TOC}]] to auto-generate table of contents
 *              - Nested, unordered lists with each list item being a heading between H2 and H5, inclusive
 *      *   [[{FnT}]] to auto-generate list of figures and tables
 *              - Unordered list with each list item being the bolded tag of an image which must start with "Figure" or "Table" with that capitalization
 */


;function markdown(src) {

    var rx_lt = /</g;
    var rx_gt = />/g;
    var rx_space = /\t|\r|\uf8ff/g;
    var rx_escape = /\\([\\\|`*_{}\[\]()#+\-~])/g;
    var rx_hr = /^([*\-=_] *){3,}$/gm;
    var rx_blockquote = /\n *&gt; *([^]*?)(?=(\n|$){2})/g;
    var rx_list = /\n( *)(?:[*\-+]|((\d+)|([a-z])|[A-Z])[.)]) +([^]*?)(?=(\n|$){2})/g;
    var rx_listjoin = /<\/(ol|ul)>\n\n<\1>/g;
    var rx_span = /==([^_]+?)==/g;
    var rx_highlight = /(^|[^A-Za-z\d\\])(([*_])|(~)|(\^)|(--)|(\+\+)|`)(\2?)([^<]*?)\2\8(?!\2)(?=\W|_|$)/g;
    var rx_code = /\n((```|~~~).*\n?([^]*?)\n?\2|((    .*?\n)+))/g;
    var rx_link = /((!?)\[(.*?)\]\((.*?)( ".*")?\)|\\([\\`*_{}\[\]()#+\-.!~]))/g;
    var rx_table = /\n(( *\|.*?\| *\n)+)/g;
    var rx_thead = /^.*\n( *\|( *\:?-+\:?-+\:? *\|)* *\n|)/;
    var rx_row = /.*\n/g;
    var rx_cell = /\||(.*?[^\\])\|/g;
    var rx_heading = /(?=^|>|\n)([>\s]*?)(#{1,6}) (.*?)( #*)? *(?=\n|$)/g;
    var rx_para = /(?=^|>|\n)\s*\n+([^<]+?)\n+\s*(?=\n|<|$)/g;
    var rx_stash = /-\d+\uf8ff/g;
    var rx_toc = /\[\[\{TOC\}\]\]/g;
    var rx_fnt = /\[\[\{FnT\}\]\]/g;

    function replace(rex, fn) {
        src = src.replace(rex, fn);
    }

    function element(tag, content) {
        return '<' + tag + '>' + content + '</' + tag + '>';
    }

    function blockquote(src) {
        return src.replace(rx_blockquote, function(all, content) {
            return element('blockquote', blockquote(highlight(content.replace(/^ *&gt; */gm, ''))));
        });
    }

    function list(src) {
        return src.replace(rx_list, function(all, ind, ol, num, low, content) {
            var entry = element('li', highlight(content.split(
                RegExp('\n ?' + ind + '(?:(?:\\d+|[a-zA-Z])[.)]|[*\\-+]) +', 'g')).map(list).join('</li><li>')));

            return '\n' + (ol
                ? '<ol start="' + (num
                    ? ol + '">'
                    : parseInt(ol,36) - 9 + '" style="list-style-type:' + (low ? 'low' : 'upp') + 'er-alpha">') + entry + '</ol>'
                : element('ul', entry));
        });
    }

    var figures_and_tables = ""
    function highlight(src) {
        return src
            .replace(rx_span, function(_, content) {
                return element('span style="text-decoration:underline; font-style: italic;"', content);
            })
            .replace(rx_highlight, function(all, _, p1, emp, sub, sup, small, big, p2, content) {
                /*(
                    emp ? (console.log(content)) : ""
                )*/
                if (emp && (content.startsWith("Figure") || content.startsWith("Table"))) {
                    figures_and_tables += "* "
                    figures_and_tables += content
                    figures_and_tables += "\n"
                }

                return _ + element(
                    emp ? (p2 ? 'strong' : 'em')
                    : sub ? (p2 ? 's' : 'sub')
                    : sup ? 'sup'
                    : small ? 'small'
                    : big ? 'big'
                    : 'code',
                    highlight(content));
            });
    }

    function unesc(str) {
        return str.replace(rx_escape, '$1');
    }

    var stash = [];
    var si = 0;

    src = '\n' + src + '\n';

    replace(rx_lt, '&lt;');
    replace(rx_gt, '&gt;');
    replace(rx_space, '  ');

    // blockquote
    src = blockquote(src);

    // horizontal rule
    replace(rx_hr, '<hr/>');

    // list
    src = list(src);
    replace(rx_listjoin, '');

    // code
    replace(rx_code, function(all, p1, p2, p3, p4) {
        stash[--si] = element('pre', element('code', p3||p4.replace(/^    /gm, '')));
        return si + '\uf8ff';
    });

    // link or image
    replace(rx_link, function(all, p1, p2, p3, p4, p5, p6) {
        stash[--si] = p4
            ? p2
                ? '<img src="' + p4 + '" alt="' + p3 + '"/>'
                : '<a href="' + p4 + '">' + unesc(highlight(p3)) + '</a>'
            : p6;
        return si + '\uf8ff';
    });

    // table
    replace(rx_table, function(all, table) {
        var sep = table.match(rx_thead)[1];
        return '\n' + element('table',
            table.replace(rx_row, function(row, ri) {
                return row == sep ? '' : element('tr', row.replace(rx_cell, function(all, cell, ci) {
                    return ci ? element(sep && !ri ? 'th' : 'td', unesc(highlight(cell || ''))) : ''
                }))
            })
        )
    });

    // heading
    var table_of_contents = ""
    replace(rx_heading, function(all, _, p1, p2) { 
        if (p1.length == 2) {
            table_of_contents += "* "
            table_of_contents += unesc(highlight(p2))
            table_of_contents += "\n"
        }
        if (p1.length == 3) {
            table_of_contents += "    "
            table_of_contents += "* "
            table_of_contents += unesc(highlight(p2))
            table_of_contents += "\n"
        }
        if (p1.length == 4) {
            table_of_contents += "        "
            table_of_contents += "* "
            table_of_contents += unesc(highlight(p2))
            table_of_contents += "\n"
        }
        if (p1.length == 5) {
            table_of_contents += "            "
            table_of_contents += "* "
            table_of_contents += unesc(highlight(p2))
            table_of_contents += "\n"
        }
        return _ + element('h' + p1.length, unesc(highlight(p2))) 
    });
    toc_source = list("\n" + table_of_contents + "\n");
    replace(rx_listjoin, '');
    replace(rx_toc, toc_source);
    

    // paragraph
    replace(rx_para, function(all, content) { return element('p', unesc(highlight(content))) });

    // stash
    replace(rx_stash, function(all) { return stash[parseInt(all)] });

    fnt_source = list("\n" + figures_and_tables + "\n");
    replace(rx_listjoin, '');
    replace(rx_fnt, fnt_source);

    return src.trim();
};

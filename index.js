/*
 * Copyright (C) 2014 Scott Beck, all rights reserved
 *
 * Licensed under the MIT license
 *
 */
// # code-annotate-plugin-code-prettify
// highlight code in [code-annotate](https://github.com/bline/code-annotate)
// with [google-code-prettify](https://code.google.com/p/google-code-prettify/)
(function () {
  'use strict;';
  var _ = require('lodash');
  var path = require('path');
  var util = require('util');
  var plugin = require('code-annotate/plugin');
  function CodePrettify(annotate) {
    plugin.apply(this, arguments);
  }
  util.inherits(CodePrettify, plugin);
  CodePrettify.name = 'codePrettify';
  CodePrettify.defaults = {
    autoload: true,
    skin: 'Default',

    runPrettifyUrl: "https://google-code-prettify.googlecode.com/svn/loader/run_prettify.js",
  };

  CodePrettify.prototype.init = function (opt) {
    var that = this;
    plugin.prototype.init.apply(this, arguments);
    var url = opt.runPrettifyUrl, query = {};
    if (opt.style) opt.skin = opt.style;
    if (opt.skin && opt.skin.toLowerCase() !== 'default')
      query.skin = opt.skin;
    if (opt.autoload !== true)
      query.autoload = 'false';
    if (_.keys(query).length !== 0)
      url += '?' + _.map(query, function (k, v) { return k + '=' + v; }).join("&");

    this.emit('script', url);

    this.anno.on('section', function (section) {
      section.codeHl = this.highlight(section.lang, section.codeText, section.startLine);
    });
    this.anno.plugins.emit('plugin-highlighter', this);
  };
  CodePrettify.prototype.highlight = function (lang, code, startLine) {
    var html = '<?prettify';
    if (_.isNumber(startLine))
      html += ' linenums=' + startLine;
    html += ' lang-' + lang + '><pre class="prettyprint">' + _.escape(code) + '</pre>';
    return html;
  };

  module.exports = CodePrettify;
})();

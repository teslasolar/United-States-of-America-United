const markdownIt = require('markdown-it');
const markdownItAttrs = require('markdown-it-attrs');

module.exports = function(eleventyConfig) {

  // Markdown configuration
  const md = markdownIt({
    html: true,
    breaks: true,
    linkify: true,
    typographer: true
  }).use(markdownItAttrs);

  eleventyConfig.setLibrary('md', md);

  // Passthrough copy for assets
  eleventyConfig.addPassthroughCopy('src/assets/img');
  eleventyConfig.addPassthroughCopy('src/assets/audio');
  eleventyConfig.addPassthroughCopy('src/assets/video');
  eleventyConfig.addPassthroughCopy('src/assets/js');
  eleventyConfig.addPassthroughCopy({'node_modules/alpinejs/dist/cdn.min.js': 'assets/js/alpine.min.js'});
  eleventyConfig.addPassthroughCopy({'node_modules/lunr/lunr.js': 'assets/js/lunr.js'});

  // Collections
  eleventyConfig.addCollection('storyNodes', function(collectionApi) {
    return collectionApi.getFilteredByGlob('src/story/**/*.md').sort((a, b) => {
      const aId = a.data.nodeId || '';
      const bId = b.data.nodeId || '';
      return aId.localeCompare(bId);
    });
  });

  eleventyConfig.addCollection('decisions', function(collectionApi) {
    return collectionApi.getFilteredByGlob('src/story/**/*.md').filter(item => {
      return item.data.type === 'decision';
    });
  });

  eleventyConfig.addCollection('endings', function(collectionApi) {
    return collectionApi.getFilteredByGlob('src/story/**/*.md').filter(item => {
      return item.data.type === 'ending';
    });
  });

  // Filters
  eleventyConfig.addFilter('json', function(value) {
    return JSON.stringify(value, null, 2);
  });

  eleventyConfig.addFilter('jsonInline', function(value) {
    return JSON.stringify(value);
  });

  eleventyConfig.addFilter('slug', function(value) {
    if (!value) return '';
    return value.toString().toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  });

  eleventyConfig.addFilter('nodeUrl', function(nodeId) {
    if (!nodeId) return '/United-States-of-America-United/';
    return `/United-States-of-America-United/story/${nodeId}/`;
  });

  // Shortcodes
  eleventyConfig.addShortcode('year', function(year) {
    return `<span class="text-americana-gold font-mono text-sm">${year}</span>`;
  });

  eleventyConfig.addShortcode('nodeLink', function(nodeId, text) {
    return `<a href="/United-States-of-America-United/story/${nodeId}/" class="text-americana-crimson hover:text-americana-gold transition-colors">${text || nodeId}</a>`;
  });

  // Paired shortcode for decision choices
  eleventyConfig.addPairedShortcode('choice', function(content, choiceId, nextNode) {
    return `<button
      class="choice-btn"
      data-choice-id="${choiceId}"
      data-next-node="${nextNode}"
      x-on:click="makeChoice('${choiceId}', '${nextNode}')"
    >${content}</button>`;
  });

  // Watch targets
  eleventyConfig.addWatchTarget('src/assets/css/');
  eleventyConfig.addWatchTarget('src/assets/js/');

  // Browser sync config
  eleventyConfig.setBrowserSyncConfig({
    files: './_site/assets/css/**/*.css',
    open: true
  });

  return {
    pathPrefix: '/United-States-of-America-United/',
    dir: {
      input: 'src',
      output: '_site',
      includes: '_includes',
      data: '_data'
    },
    templateFormats: ['md', 'njk', 'html'],
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    dataTemplateEngine: 'njk'
  };
};

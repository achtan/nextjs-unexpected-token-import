const gulp     = require('gulp')
const plugins  = require('gulp-load-plugins')
const rimraf   = require('rimraf')
const panini   = require('panini')
const yargs    = require('yargs')
const lazypipe = require('lazypipe')
const inky     = require('inky')
const fs       = require('fs')
const siphon   = require('siphon-media-query')

const $ = plugins();

// Look for the --production flag
const PRODUCTION = !!(yargs.argv.production);
const EMAIL = yargs.argv.to;

// Declar var so that both AWS and Litmus task can use it.
var CONFIG;

const buildEmails = gulp.series(clean, pages, sass, images, inline)

// Delete the "dist" folder
// This happens every time a build starts
function clean(done) {
  rimraf('static/emails', done);
}

// Compile layouts, pages, and partials into flat HTML files
// Then parse using Inky templates
function pages() {
  return gulp.src('emails/pages/**/*.html')
    .pipe(panini({
      root: 'emails/pages',
      layouts: 'emails/layouts',
      partials: 'emails/partials',
      helpers: 'emails/helpers'
    }))
    .pipe(inky())
    .pipe(gulp.dest('static/emails'));
}

// Compile Sass into CSS
function sass() {
  return gulp.src('emails/assets/scss/app.scss')
    .pipe($.if(!PRODUCTION, $.sourcemaps.init()))
    .pipe($.sass({
      includePaths: ['node_modules/foundation-emails/scss']
    }).on('error', $.sass.logError))
    .pipe($.if(PRODUCTION, $.uncss(
      {
        html: ['static/emails/**/*.html']
      })))
    .pipe($.if(!PRODUCTION, $.sourcemaps.write()))
    .pipe(gulp.dest('static/emails/css'));
}

// Copy and compress images
function images() {
  return gulp.src('emails/assets/img/**/*')
    .pipe($.imagemin())
    .pipe(gulp.dest('./static/emails/assets/img'));
}

// Inline CSS and minify HTML
function inline() {
  return gulp.src('static/emails/**/*.html')
    .pipe($.if(PRODUCTION, inliner('static/emails/css/app.css')))
    .pipe(gulp.dest('static/emails'));
}

// Inlines CSS into HTML, adds media query CSS into the <style> tag of the email, and compresses the HTML
function inliner(css) {
  var css = fs.readFileSync(css).toString();
  var mqCss = siphon(css);

  var pipe = lazypipe()
    .pipe($.inlineCss, {
      applyStyleTags: false,
      removeStyleTags: true,
      preserveMediaQueries: true,
      removeLinkTags: false
    })
    .pipe($.replace, '<!-- <style> -->', `<style>${mqCss}</style>`)
    .pipe($.replace, '<link rel="stylesheet" type="text/css" href="css/app.css">', '')
    .pipe($.htmlmin, {
      collapseWhitespace: true,
      minifyCSS: true
    });

  return pipe();
}

module.exports = buildEmails
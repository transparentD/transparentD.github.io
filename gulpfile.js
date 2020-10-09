const https         = require('https')
const fs           = require('fs')
const gulp         = require('gulp')
const pug          = require("gulp-pug")
const sass         = require("gulp-sass")
// const minifyCSS    = require('gulp-minify-css')
// const concat       = require('gulp-concat')
// const uglify       = require('gulp-uglify')
const rename       = require("gulp-rename")
const frontMatter  = require('gulp-front-matter')
// const autoprefixer = require('gulp-autoprefixer')
const webserver    = require('gulp-webserver')
const markdown     = require('gulp-markdown')
const extender     = require('gulp-html-extend')
const replace      = require('gulp-replace')
const sitemap = require('gulp-sitemap')
const changed = require('gulp-changed')

function swallowError (error) {
  console.log(error.toString())
  this.emit('end')
}

gulp.task('build', ['pug', 'sass'], () => {  
  console.log("build...")
})

gulp.task('pug', () => {  
  gulp.src('./src/pug/*.pug') 
    .pipe(pug({
      pretty: true
    }))
    .on('error', swallowError)
    .pipe(gulp.dest('./'))
})

gulp.task('sass', () => {  
  gulp.src('./src/sass/*.sass') 
    .pipe(sass())
    .on('error', swallowError)
    .pipe(gulp.dest('./dest/css')) 
})

gulp.task('autoprefixer', () => {  
  gulp.src('./dest/css/*.css') 
    .pipe(autoprefixer({
      cascade: false
    }))
    .on('error', swallowError)
    .pipe(gulp.dest('./dest/css')) 
})

gulp.task('extend', () => {
  gulp.src('./src/articles/html/**/*')
    .pipe(changed('./src/articles/html/**/*', {
      extension: '.html'
    }))
    .pipe(extender({annotations:false,verbose:false}))
    .pipe(gulp.dest('./dest/articles/'))
})

gulp.task('sitemap', function () {
  gulp.src('./dest/articles/**/*.html', {
          read: false
      })
      .pipe(sitemap({
          siteUrl: 'https://berglas.github.io/dest/articles'
      }))
      .pipe(gulp.dest('./'));
});

// 將md編譯成html、json
gulp.task('markdown', () => {
  fs.readdir('./src/articles/md/', function(err, files) {
    let pageList = [] 
    files.forEach((file, i) => {
      let data = {}
      let imgUrlList = []
      let content = fs.readFileSync('./src/articles/md/' + file, 'utf8')
      //讀取內文中所有圖片路徑
      content.split('![]').forEach(e => {
        if (e.substring(1, 21) === 'https://i.imgur.com/') {
          imgUrlList.push(e.replace('(', '').split(')')[0])
        }
      })
      // 讀取frontMatter部分
      content.split('---')[1].split('\n').forEach(e => {        
        
        if (e != '' && e != undefined && e != null && e.trim() != '') {
          data[(e.split(':')[0]).toString()] = (e.split(':')[1]).toString().trim()
        }
      })
      
      data.tag = data.tag.replace('[', '').replace(']', '').split(',').map(e=> {
        return e.trim()
      })
      data.site = '/dest/articles/' + (new Date(data.date).getFullYear()) + '/' + (new Date(data.date).getMonth() + 1) + '/' + data.title + '.html'
      data.index = i
      let cp = imgUrlList[0].split('/')      
      data.img = '/dest/articles/' + (new Date(data.date).getFullYear()) + '/' + (new Date(data.date).getMonth() + 1) + '/' + cp[cp.length - 1]
      data.rawDepiction = data.depiction
      if (data.depiction.length > 60) {
        data.depiction = data.depiction.substring(0, 60) + '...'
      }
      pageList.push(data)      
      imgUrlList.forEach(e => {
        let s = e.split('/')
        if (!fs.existsSync('./dest/articles/' + (new Date(data.date).getFullYear()))) {
          fs.mkdirSync('./dest/articles/' + (new Date(data.date).getFullYear()))
          if (!fs.existsSync('./dest/articles/' + (new Date(data.date).getFullYear()) + '/' + (new Date(data.date).getMonth() + 1))) {
            fs.mkdirSync('./dest/articles/' + (new Date(data.date).getFullYear()) + '/' + (new Date(data.date).getMonth() + 1))
          }
        } else if (!fs.existsSync('./dest/articles/' + (new Date(data.date).getFullYear()) + '/' + (new Date(data.date).getMonth() + 1))) {
          fs.mkdirSync('./dest/articles/' + (new Date(data.date).getFullYear()) + '/' + (new Date(data.date).getMonth() + 1))
        }
        const file = fs.createWriteStream('./dest/articles/' + (new Date(data.date).getFullYear()) + '/' + (new Date(data.date).getMonth() + 1) + '/' + s[s.length - 1]);
        const request = https.get(e, function(response) {
          response.pipe(file)
        })
      })
      gulp.src('./src/articles/md/'+ file)
        .pipe(frontMatter({
            remove: true
          }))
        .pipe(changed('./src/articles/md', {
          extension: '.html'
        }))
        .pipe(markdown({
          headerIds: false
        }))
        .pipe(rename(function (path) {
          path.extname = ".html"
        }))
        .pipe(replace('https://i.imgur.com', '.'))
        .pipe(replace('@@depiction', data.rawDepiction))
        .pipe(replace('@@cTitle', data.cTitle))
        .pipe(replace('@@title', data.title))
        .pipe(replace('@@date', data.date))
        .pipe(replace('@@site', 'https://berglas.github.io/dest/articles/'+ (new Date(data.date).getFullYear()) + '/' + (new Date(data.date).getMonth() + 1) + '/' + data.title))
        .pipe(gulp.dest('./src/articles/html/'+ (new Date(data.date).getFullYear()) + '/' + (new Date(data.date).getMonth() + 1)))      
    })

    fs.writeFile('./dest/articles/pageList.json', JSON.stringify(pageList), function (err) {
      if (err)
        console.log(err)
      else
        console.log('Write operation complete.')
    })
  })
});

// gulp.task('uglify', () => {
//   return gulp.src('./frontend/src/js/*.js')
//     .pipe(uglify())
//     .pipe(rename(function(path) {
//       path.basename += ".min"
//       path.extname = ".js"
//     }))
//     .pipe(gulp.dest('./frontend/dest/js/'))
// })

// gulp.task('concat', () => {
//   return gulp.src('./frontend/src/css/*.css')
//     .pipe(concat('all.css'))
//     .pipe(gulp.dest('./frontend/dest/css/'))
// })

// gulp.task('minify-css',['concat'], () => {
//   return gulp.src('./frontend/dest/css/all.css')
//     .pipe(minifyCSS({
//        keepBreaks: true,
//     }))
//     .pipe(rename(function(path) {
//       path.basename += ".min"
//       path.extname = ".css"
//     }))
//     .pipe(gulp.dest('./frontend/dest/css/'))
// })

gulp.task('watch', () => {
  // 監看的路徑檔案以及執行less這項task
  gulp.watch('./src/**/*.*',['build'])
})

gulp.task('webserver', () => {
  gulp.src('./')
    .pipe(webserver({
      port: 443,
      livereload: true,
      directoryListing: false,
      open: true,
      fallback: 'index.html'
    }))
})

// default要執行的Task
gulp.task('default',['watch', 'webserver'])
gulp.task('extend_html',['extend'])
gulp.task('compile_markdown',['markdown'])
gulp.task('compile_pug',['pug'])
gulp.task('compile_sass',['sass'])
gulp.task('compile_json2html',['json2html'])
gulp.task('compile_sitemap', ['sitemap'])
const gulp = require("gulp")
const less = require("gulp-less")

/* ----------------------------------------- */
/*  Compile LESS
/* ----------------------------------------- */

function compileLESS() {
  return gulp.src("styles/rafales.less").pipe(less()).pipe(gulp.dest("./"))
}
const css = gulp.series(compileLESS)

/* ----------------------------------------- */
/*  Watch Updates
/* ----------------------------------------- */

function watchUpdates() {
  gulp.watch(["styles/*.less"], css)
}

/* ----------------------------------------- */
/*  Export Tasks
/* ----------------------------------------- */

exports.default = gulp.series(gulp.parallel(css), watchUpdates)
exports.css = css

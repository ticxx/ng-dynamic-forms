const gulp        = require("gulp"),
      runSequence = require("run-sequence"),
      pkg         = require("./package.json");

const TASK_BUNDLE              = require("./build/tasks/bundle"),
      TASK_CLEAN               = require("./build/tasks/clean"),
      TASK_COPY                = require("./build/tasks/copy"),
      TASK_NGC                 = require("./build/tasks/ngc"),
      TASK_DELETE_LINES        = require("./build/tasks/delete-lines"),
      TASK_INLINE_NG_TEMPLATES = require("./build/tasks/inline-ng-templates"),
      TASK_PREPROCESS          = require("./build/tasks/preprocess"),
      TASK_TRANSPILE           = require("./build/tasks/transpile"),
      TASK_TSLINT              = require("./build/tasks/tslint"),
      TASK_TYPEDOC             = require("./build/tasks/typedoc"),
      TASK_VERSION             = require("./build/tasks/version");

const NPM_SCOPE      = "@ng-dynamic-forms",
      SRC_PATH       = "./packages",
      DIST_BASE_PATH = "./dist",
      DIST_PATH      = `${DIST_BASE_PATH}/${NPM_SCOPE}`,
      NPM_BASE_PATH  = "./node_modules",
      NPM_PATH       = `${NPM_BASE_PATH}/${NPM_SCOPE}`,
      TEST_PATH      = "./test",
      PACKAGES_NAMES = [
          "core",
          // "ui-basic",
          // "ui-bootstrap",
          // "ui-foundation",
          // "ui-ionic",
          // "ui-kendo",
          // "ui-material",
          "ui-ng-bootstrap",
          // "ui-primeng"
      ];


/**
 * Tasks for building single packages
 */
PACKAGES_NAMES.forEach(packageName => {

    const PACKAGE_SRC_PATH  = `${SRC_PATH}/${packageName}`,
          PACKAGE_DIST_PATH = `${DIST_PATH}/${packageName}`;

    const TASK_NAME_LINT                = `lint:${packageName}`,
          TASK_NAME_CLEAN               = `clean:${packageName}`,
          TASK_NAME_COMPILE             = `compile:${packageName}`,
          TASK_NAME_COPY                = `copy:${packageName}`,
          TASK_NAME_PREPROCESS          = `preprocess:${packageName}`,
          TASK_NAME_INLINE_NG_TEMPLATES = `inline-ng-templates:${packageName}`,
          TASK_NAME_BUNDLE              = `bundle:${packageName}`,
          TASK_NAME_REMOVE_MODULE_ID    = `remove-module-id:${packageName}`,
          TASK_NAME_CLEANUP             = `cleanup:${packageName}`,
          TASK_NAME_DOC                 = `doc:${packageName}`,
          TASK_NAME_BUILD               = `build:${packageName}`;

    gulp.task(TASK_NAME_LINT,
        TASK_TSLINT([`${PACKAGE_SRC_PATH}/**/*.ts`], "./tslint.json"));

    gulp.task(TASK_NAME_CLEAN,
        TASK_CLEAN([`${PACKAGE_DIST_PATH}/**/*`]));

    gulp.task(TASK_NAME_COMPILE,
        TASK_NGC(`${PACKAGE_SRC_PATH}/tsconfig.json`));

    gulp.task(TASK_NAME_COPY,
        TASK_COPY([`${PACKAGE_SRC_PATH}/package.json`, `${PACKAGE_SRC_PATH}/**/*.@(html|md)`], PACKAGE_DIST_PATH));

    gulp.task(TASK_NAME_PREPROCESS,
        TASK_PREPROCESS(`${PACKAGE_DIST_PATH}/**/*.js`, PACKAGE_DIST_PATH));

    gulp.task(TASK_NAME_INLINE_NG_TEMPLATES,
        TASK_INLINE_NG_TEMPLATES([`${PACKAGE_DIST_PATH}/**/*.js`], PACKAGE_DIST_PATH));

    gulp.task(TASK_NAME_BUNDLE,
        TASK_BUNDLE(`${PACKAGE_SRC_PATH}/rollup.config.js`));

    gulp.task(TASK_NAME_REMOVE_MODULE_ID,
        TASK_DELETE_LINES([`${PACKAGE_DIST_PATH}/**/*`], PACKAGE_DIST_PATH, [/moduleId: module.id/]));

    gulp.task(TASK_NAME_CLEANUP,
        TASK_CLEAN([`${PACKAGE_DIST_PATH}/*.js?(.map)`, `${PACKAGE_DIST_PATH}/src/**/*.js?(.map)`]));

    gulp.task(TASK_NAME_DOC,
        TASK_TYPEDOC([`${PACKAGE_SRC_PATH}/src/**/!(*.spec).ts`], {
            exclude: `**/*+(${packageName}|module).ts`,
            excludeExternals: true,
            experimentalDecorators: true,
            externalPattern: `${PACKAGE_DIST_PATH}/**/*.*`,
            ignoreCompilerErrors: true,
            includeDeclarations: true,
            module: "commonjs",
            name: `@ng-dynamic-forms/${packageName}`,
            out: `docs/${packageName}`,
            readme: "none",
            target: "es6",
            theme: "minimal"
        })
    );

    gulp.task(TASK_NAME_BUILD, done => {
        runSequence(
            TASK_NAME_LINT,
            TASK_NAME_CLEAN,
            TASK_NAME_COMPILE,
            TASK_NAME_COPY,
            TASK_NAME_PREPROCESS,
            TASK_NAME_INLINE_NG_TEMPLATES,
            TASK_NAME_BUNDLE,
            TASK_NAME_REMOVE_MODULE_ID,
            TASK_NAME_CLEANUP,
            done
        );
    });
});


gulp.task("build:packages", done => {
    runSequence(...PACKAGES_NAMES.map(packageName => `build:${packageName}`), done)
});

gulp.task("doc:packages", done => {
    runSequence(...PACKAGES_NAMES.map(packageName => `doc:${packageName}`), done)
});


/**
 * Tasks for building unit tests
 */
gulp.task("clean:tests",
    TASK_CLEAN([`${TEST_PATH}/**/*`]));

gulp.task("copy:tests",
    TASK_COPY([`${SRC_PATH}/**/*.{html,ts}`], TEST_PATH));

gulp.task("transpile:tests",
    TASK_TRANSPILE([`${TEST_PATH}/**/*.ts`], TEST_PATH, "./tsconfig.tests.json", "commonjs"));

gulp.task("build:tests", done => {
    runSequence("clean:tests", "copy:tests", "transpile:tests", done);
});


gulp.task("build", done => {
    runSequence("build:packages", "build:tests", done);
});


/**
 * Tasks for incrementing version number
 */
gulp.task("version:major",
    TASK_VERSION(pkg, ["./package.json", "./package-lock.json", `${SRC_PATH}/**/package.json`], "MAJOR", SRC_PATH));

gulp.task("version:minor",
    TASK_VERSION(pkg, ["./package.json", "./package-lock.json", `${SRC_PATH}/**/package.json`], "MINOR", SRC_PATH));

gulp.task("version:patch",
    TASK_VERSION(pkg, ["./package.json", "./package-lock.json", `${SRC_PATH}/**/package.json`], "PATCH", SRC_PATH));


/**
 * Miscellaneous Tasks
 */
gulp.task("lint:packages",
    TASK_TSLINT([`${SRC_PATH}/**/*.ts`], "./tslint.json"));

gulp.task("clean:dist",
    TASK_CLEAN([`${DIST_BASE_PATH}/**/*`]));

gulp.task("clean:npm-dist",
    TASK_CLEAN([`${NPM_PATH}/**/*`]));

gulp.task("copy:npm-dist",
    TASK_COPY([`${DIST_BASE_PATH}/**/*.*`], NPM_BASE_PATH));

gulp.task("watch:packages", () => {
    gulp.watch([`${SRC_PATH}/**/*.*`], ["build:packages"]);
});
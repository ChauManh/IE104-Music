const trackRouter = require('./track');
const NewReleasesRouter = require('./newReleases');

function router(app) {
  app.use('/track', trackRouter);
  app.use('/new-releases', NewReleasesRouter);
}

module.exports = router;

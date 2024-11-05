const trackRouter = require('./track');
const NewReleasesRouter = require('./newReleases');
const playlistRouter = require('./playlist');

function router(app) {
  app.use('/track', trackRouter);
  app.use('/new-releases', NewReleasesRouter);
  app.use('/playlist', playlistRouter);
}

module.exports = router;

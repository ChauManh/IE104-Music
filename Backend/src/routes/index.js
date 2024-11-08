const trackRouter = require('./track');
const albumRouter = require('./album');
const playlistRouter = require('./playlist');

function router(app) {
  app.use('/track', trackRouter);
  app.use('/album', albumRouter);
  app.use('/playlist', playlistRouter);
}

module.exports = router;

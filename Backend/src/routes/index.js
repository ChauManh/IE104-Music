const trackRouter = require('./track');
const albumRouter = require('./album');
const playlistRouter = require('./playlist');
const authRouter = require('./auth');

function router(app) {
  app.use('/track', trackRouter);
  app.use('/album', albumRouter);
  app.use('/playlist', playlistRouter);
  app.use('/auth', authRouter);
}

module.exports = router;

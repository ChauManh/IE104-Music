const trackRouter = require('./track');
const albumRouter = require('./album');
const playlistRouter = require('./playlist');
const webPlaybackSdkRouter = require('./webplaybacksdk'); // Thêm router mới
// const authRouter = require('./auth');

function router(app) {
  app.use('/track', trackRouter);
  app.use('/album', albumRouter);
  app.use('/playlist', playlistRouter);
  app.use('/api/webplaybacksdk', webPlaybackSdkRouter);
  // app.use('/auth', authRouter);
}

module.exports = router;

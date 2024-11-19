const trackRouter = require('./track');
const albumRouter = require('./album');
const playlistRouter = require('./playlist');
const authRouter = require('./auth');
const userRouter = require('./userApi');

function router(app) {
  app.use('/track', trackRouter);
  app.use('/album', albumRouter);
  app.use('/playlist', playlistRouter);
  app.use('/auth/spotify', authRouter);
  app.use('/v1/api', userRouter); // Add user router for authentication endpoints
}

module.exports = router;

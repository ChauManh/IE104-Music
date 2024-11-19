const trackRouter = require('./track');
const albumRouter = require('./album');
const playlistRouter = require('./playlist');
const authRouter = require('./auth');
const userRouter = require('./userApi');
const searchRouter = require('./search');

function router(app) {
  app.use('/track', trackRouter);
  app.use('/album', albumRouter);
  app.use('/playlist', playlistRouter);
  app.use('/auth', authRouter);
  app.use('/v1/api', userRouter); 
  app.use('/search', searchRouter);
}

module.exports = router;

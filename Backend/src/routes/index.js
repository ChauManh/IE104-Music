const trackRouter = require('./track');
const albumRouter = require('./album');
const playlistRouter = require('./playlist');
const spotifyAuthRouter = require('./spotifyAuth');
const authRoter = require('./auth');
const searchRouter = require('./search');
const authMiddleware = require('../middleware/auth');
const userRouter = require('./user');
const artistRouter = require('./artist');

function router(app) {
  app.use('/track', trackRouter);
  app.use('/album', albumRouter);
  app.use('/playlist', playlistRouter);
  app.use('/spotify_auth', spotifyAuthRouter);
  app.use('/auth', authRoter); 
  app.use('/search', searchRouter);
  app.use('/user', authMiddleware, userRouter);
  app.use('/artist', artistRouter);
}

module.exports = router;

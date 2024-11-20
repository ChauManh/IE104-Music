const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use('/auth/**', 
        createProxyMiddleware({ 
            target: 'http://localhost:3000', // Cấu hình backend API ở đây
            changeOrigin: true,
            secure: false,
        })
    );
};


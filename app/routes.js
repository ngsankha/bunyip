var multer = require('multer'),
    upload = multer({ dest: 'uploads/' });

function setup(app, handlers) {
  app.get('/', handlers.index.index);
  app.post('/v1/upload', upload.single('image'), handlers.v1.upload);
}

exports.setup = setup;

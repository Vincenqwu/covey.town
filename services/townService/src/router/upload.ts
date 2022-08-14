import express from 'express';
import multer from 'multer';
import verifyJWT from '../middleware/verifyJWT';

const uploadRouter: express.Router = express.Router();

const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    cb(null, './public/images');
  },
  
  filename(req, _file, cb) {
    cb(null, req.body.name);
  },
});


const fileFilter = (_req, file, cb) => {
  if (file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Image uploaded is not of type jpg/jpeg or png'), false);
  }
};
const upload = multer({ storage, fileFilter });


uploadRouter.post('/', verifyJWT, upload.single('file'), async (_req, res) => {
  try {
    res.status(200).json({
      message: 'Uploaded the file successfully ',
    });

  } catch (err) {
    res.status(500).json({
      message: `Could not upload the file: ${err}`,
    },
    );
  }

});

export default uploadRouter;

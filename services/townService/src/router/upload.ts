import express from 'express';
import multer from 'multer';
import verifyJWT from '../middleware/verifyJWT';
import uploadFile from '../s3';

interface MulterRequest extends Request {
  file: any;
}

const uploadRouter: express.Router = express.Router();

// const storage = multer.memoryStorage({
//   destination(_req, _file, cb) {
//     cb(null, './public/images');
//   },
  
//   filename(req, _file, cb) {
//     cb(null, req.body.name);
//   },
// });
const storage = multer.memoryStorage();

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


uploadRouter.post('/', verifyJWT, upload.single('file'), async (req, res) => {
  try {
    const fileObject = (req as multer.Request).file;
    const filename = req.body.name;
    await uploadFile(fileObject, filename);
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

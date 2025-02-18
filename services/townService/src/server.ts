import Express from 'express';
import * as http from 'http';
import CORS from 'cors';
import { AddressInfo } from 'net';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import addTownRoutes from './router/towns';
import CoveyTownsStore from './lib/CoveyTownsStore';
import userRouter from './router/users';
import uploadRouter from './router/upload';
import loadTownsFromDB from './townsLoader';


dotenv.config();

mongoose.connect(
  process.env.MONGO_URL || '',
).then(() => {
  console.log('Connected to MongoDB');
  loadTownsFromDB();
}).catch((err) => {
  console.log(err);
});

const app = Express();
app.use(CORS());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.use('/public', Express.static('public'));
const server = http.createServer(app);

app.use('/users', userRouter);
app.use('/upload', uploadRouter);
addTownRoutes(server, app);

server.listen(process.env.PORT || 8081, () => {
  const address = server.address() as AddressInfo;
  // eslint-disable-next-line no-console
  console.log(`Listening on ${address.port}`);
  if (process.env.DEMO_TOWN_ID) {
    CoveyTownsStore.getInstance()
      .createTown(process.env.DEMO_TOWN_ID, false);
  }
});

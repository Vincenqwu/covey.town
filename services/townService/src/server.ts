import Express from 'express';
import * as http from 'http';
import CORS from 'cors';
import { AddressInfo } from 'net';
import addTownRoutes from './router/towns';
import CoveyTownsStore from './lib/CoveyTownsStore';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
const userRoute = require("./router/users");
var bodyParser = require('body-parser')


dotenv.config();

mongoose.connect(
  process.env.MONGO_URL!,
).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
  console.log(err);
});

const app = Express();
app.use(CORS());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

const server = http.createServer(app);

app.use('/users', userRoute);
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

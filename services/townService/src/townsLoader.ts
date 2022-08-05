import Town from './models/town';
import { townExtractHandler } from './requestHandlers/CoveyTownRequestHandlers';

export default async function loadTownsFromDB() {
  const allTowns = await Town.find({});
  for (let i = 0; i < allTowns.length; i += 1) {
    const town = allTowns[i];
    // console.log(town);
    const request = {
      coveyTownID: town.coveyTownId,
      coveyTownPassword: town.townUpdatePassword,
      friendlyName: town.friendlyName,
      isPubliclyListed: town.isPublic,
    };
    townExtractHandler(request);
  }
}
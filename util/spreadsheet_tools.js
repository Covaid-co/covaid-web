const { GoogleSpreadsheet } = require("google-spreadsheet");
exports.addUserToSpreadsheet = async (user, ID, spreadsheetID) => {
  var creds;
  if (process.env.GOOGLE_PRIVATE_KEY) {
    const config = require("../config/client_secret").config;
    config["private_key"] = process.env.GOOGLE_PRIVATE_KEY.replace(
      /\\n/gm,
      "\n"
    );
    creds = JSON.parse(JSON.stringify(config));
  } else {
    creds = require("../config/client_secret.json");
  }
  const doc = new GoogleSpreadsheet(spreadsheetID);
  await doc.useServiceAccountAuth({
    client_email: creds.client_email,
    private_key: creds.private_key,
  });

  await doc.loadInfo(); // loads document properties and worksheets

  // create a sheet and set the header row
  const volunterSheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id]

  // append rows
  await volunterSheet.addRow({
    ID: ID,
    Timestamp:
      new Date().toDateString() + " " + new Date().toLocaleTimeString(),
    AvailabilityStatus: user.availability.toString(),
    Name: user.first_name + " " + user.last_name,
    Email: user.email,
    Phone: user.phone,
    Languages: user.languages.join(", "),
    Neighborhood: user.offer.neighborhoods.join(", "),
    Details: user.offer.details,
    Resource: user.offer.tasks.join(", "),
    Car: user.offer.car.toString(),
    TimeOfAvailability: user.offer.timesAvailable.join(", "),
    Phone: user.phone,
    AvailabilityStatus: user.availability.toString(),
    Agreement: true,
  });
};

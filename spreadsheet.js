const {GoogleSpreadsheet }= require('google-spreadsheet')
const creds = require('./client_secret.json')

const SPREADSHEET_ID = '1l2kVGLjnk-XDywbhqCut8xkGjaGccwK8netaP3cyJR0'
const doc = new GoogleSpreadsheet(SPREADSHEET_ID);

async function accessSpreadsheet() {
    await doc.useServiceAccountAuth({
      client_email: creds.client_email,
      private_key: creds.private_key,
    });
  
    await doc.loadInfo(); // loads document properties and worksheets

    // create a sheet and set the header row
    const sheet = await doc.addSheet({ headerValues: ['name', 'email'] });
    
    // append rows
    const larryRow = await sheet.addRow({ name: 'Larry Page', email: 'larry@google.com' });
    const moreRows = await sheet.addRows([
    { name: 'Sergey Brin', email: 'sergey@google.com' },
    { name: 'Eric Schmidt', email: 'eric@google.com' },
    ]);
    
    // read rows
    const rows = await sheet.getRows(); // can pass in { limit, offset }
    // read/write row values
    console.log(rows[0].name); // 'Larry Page'
    rows[1].email = 'sergey@abc.xyz'; // update a value
    await rows[1].save(); // save updates


  }
accessSpreadsheet()
//Original code by JD Maresco - http://jd.mares.co/tutorials/2015/09/20/slack-google-apps-script-stand-ups.html
//Modified by Menglin Ruan

function doPost(req) {
  
  var params = req.parameters;


  if (params.token == "MZgHXDUraLGcVwgtDK4k0adQ") {

    // DETERMINE IF IS INDUSTRY COMP 
    var is_industry = String(params.text).match(/^\s*ic\s*:\s*/i); //check if industry comp
    var textRaw, industry;
    if (is_industry) {
      textRaw = String(params.text).replace(/^\s*ic\s*:*\s*/gi,'');
      industry = "Y";
    }else {
      textRaw = String(params.text).replace(/^\s*add\s*:*\s*/gi,'');
      industry = "N";
    }
    
    //BREAK UP TEXT INTO NAMES & PLUS1
    var names = textRaw.split(/\s*;\s*/g);
    var length = names.length;
    var plusone = [];
    var temp;
    for (var i = 0; i < length; i++) {
      temp = names[i].split(/\s*\+\s*/g);
      names[i] = temp[0] || "No Name Specified";
      plusone.push((temp[1] || "0"));
    }
    
    addRows(params.user_name, industry, names, plusone);


  } else {
    return;
  }
}

//calls the sheets to add a row
function addRows(username, industry, guestnames, plusone) {
  
  var sheets = SpreadsheetApp.openById('1Z4-q4rSEmQKbEWw8zMvk8JYGoQuZoI2KuOtBUVCav-g');
  
  var nR = getNextRow(sheets) + 1;
  var length = guestnames.length;
  
  for (var i = 0; i < length; i++) {

    // RECORD TIMESTAMP AND USER NAME IN SPREADSHEET
    sheets.getRangeByName('timestamp').getCell(nR,1).setValue(new Date());
    sheets.getRangeByName('user').getCell(nR,1).setValue(username);

    // RECORD UPDATE INFORMATION INTO SPREADSHEET
    sheets.getRangeByName('industry').getCell(nR,1).setValue(industry);
    sheets.getRangeByName('guestname').getCell(nR,1).setValue(guestnames[i]);
    sheets.getRangeByName('plus1').getCell(nR,1).setValue(plusone[i]);
    
    nR = nR + 1;
  }
}


//LOOKS FOR LAST ADDED NAME & RETURNS THAT ROW NUMBER
function getNextRow(sheets) {
  var guestnames = sheets.getRangeByName('guestname').getValues();
  for (i in guestnames) {
    if(guestnames[i][0] == "") {
      return Number(i);
      break;
    }
  }
}
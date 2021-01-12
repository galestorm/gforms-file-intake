function onFormSubmit(e) {
  
  var responseArray = {name: e.values[0],
                       email: e.values[1], project: e.values[6],
                       category: e.values[4], section: e.values[3], url: e.values[8]
  };

  // found this on stackoverflow.com, seems to work -- I don't speak regex
  function getIdFromUrl(url) { return url.match(/[-\w]{25,}/); }
  
  var INTAKE_FOLDER_URL = "REPLACE WITH URL OF INTAKE FOLDER"
  var gdrive_url = responseArray['url'];
  var name = responseArray['name'];
  var email = responseArray['email'];
  var project = responseArray['project'];
  var category = responseArray['category'];
  var section = responseArray['section'];
  
  var gdrive_id = getIdFromUrl(gdrive_url);
  var gdrive_file = DriveApp.getFileById(gdrive_id);
  var gdrive_creationDate = gdrive_file.getDateCreated();
  var gdrive_bytesize = gdrive_file.getSize();
  var gdrive_filename = gdrive_file.getName();
  
  var intake_folder_id = getIdFromUrl(INTAKE_FOLDER_URL);
  var intake_folder = DriveApp.getFolderById(intake_folder_id)
  

  // Send a confirmation email
  var subject = "Upload Recieved"
  
     var htmlBody = '<div>';
     htmlBody += '<p>'
     htmlBody += 'Hi ' + name + '!';
     htmlBody += '</p>'
     htmlBody += '<p>' + "We have received your file for the " + '<strong>' + project + '</strong>' + " Project!" + '</p>'
     htmlBody += '<li>' + "Original File Name: " + gdrive_filename + '</li>';
     htmlBody += '<li>' + "Section: " + section + '</li>';
     htmlBody += '<li>' + "Category: " + category + '</li>';
     htmlBody += '<li>' + "File Size: " + gdrive_bytesize + ' bytes' + '</li>';
     htmlBody += '<li>' + "Uploaded on: " + gdrive_creationDate + '</li>';
     htmlBody += '<p>' + "Thank you so much for participating! We couldn't do it without you!" + '</p>'
     htmlBody += '<hr />'
     htmlBody += '<i>' + "This message was automatically generated, replies are not monitored." + '</i>'

     htmlBody += '</div>';
   
  
  GmailApp.sendEmail(email, subject, '', {htmlBody:htmlBody}); 

  var file=DriveApp.getFileById(gdrive_id);
  var t=Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd_HHmmss");

  // Rename the file to something useful
  if (category.indexOf('Intro') >-1) {
    file.setName( project + "-" + category + "-" + name + "_" + t)
  } else {
    file.setName( project + "-" + category + "-" + section + "-" + name + "_" + t);
  }

  // Add the new filename to the last column in our spreadsheet
  var new_filename = file.getName();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var s = ss.getActiveSheet();
  var r = s.getLastRow();
  var c = s.getLastColumn();
  var range = s.getRange(r, c)
  var offset = range.offset(0, 1)
  offset.setValue(new_filename)



 //Create folder if does not exists only (this section copied wholesale from here: 
 // https://yagisanatode.com/2018/07/08/google-apps-script-how-to-create-folders-in-directories-with-driveapp/ )
  function createFolder(folderID, folderName){
    var parentFolder = DriveApp.getFolderById(folderID);
    var subFolders = parentFolder.getFolders();
    var doesntExists = true;
    var newFolder = '';
  
    // Check if folder already exists.
    while(subFolders.hasNext()){
      var folder = subFolders.next();
    
      //If the name exists return the id of the folder
      if(folder.getName() === folderName){
        doesntExists = false;
        newFolder = folder;
        return newFolder.getId();
      };
    };
    //If the name doesn't exists, then create a new folder
    if(doesntExists == true){
      //If the file doesn't exists
      newFolder = parentFolder.createFolder(folderName);
      return newFolder.getId();
    };
  };

  var myFolderID = createFolder(intake_folder_id, project);
  var myFolder = DriveApp.getFolderById(myFolderID)
  // Wait for processing
  Utilities.sleep(1000)
  file.moveTo(myFolder);



   
}

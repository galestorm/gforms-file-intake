function onFormSubmit(e) {
  // Comment out line 3 and uncomment line 4 to debug
  const submission = new SubmissionData(e);
  // const submission = getDebugSubmission();
  submission.setGDriveFilename();
  uploadFileToIntakeFolder(submission);
  sendConfirmationEmail(submission);
  completeTrackingSpreadsheet(submission);
}

class SubmissionData {
  constructor(submissionEvent) {
    this.rawFormValues = {
      name: submissionEvent.values[2],
      email: submissionEvent.values[1],
      project: submissionEvent.values[6],
      category: submissionEvent.values[4],
      section: submissionEvent.values[3],
      uploadType: submissionEvent.values[7],
      url: submissionEvent.values[8]
    };

    this.gdriveFile = DriveApp.getFileById(getIdFromUrl(this.rawFormValues.url));
    this.originalFileName = this.gdriveFile.getName();
  }

  getRawFormValues() {
    return this.rawFormValues;
  }

  getGDriveFile() {
    return this.gdriveFile;
  }

  getOriginalFileName() {
    return this.originalFileName;
  }

  setGDriveFilename() {
      // Rename the file to something useful
    const introModifier = this.rawFormValues.category.indexOf('Intro') > -1 ? '' : `-${this.rawFormValues.section}`;
    const formattedTime=Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd_HHmmss');
    this.gdriveFile.setName(`${this.rawFormValues.project}-${this.rawFormValues.category}${introModifier}-${this.rawFormValues.name}_${formattedTime}`);
  }
};

// Gets the final 25 characters of the url, which should be the id
function getIdFromUrl(url) {
  return url.match(/[-\w]{25,}/);
}

function uploadFileToIntakeFolder(submission) {
  const INTAKE_FOLDER_ID = 'REPLACE WITH INTAKE FOLDER URL';
  const intakeFolderId = getIdFromUrl(INTAKE_FOLDER_ID);
  const subFolder = getProjectSubFolder(intakeFolderId, submission.getRawFormValues().project);
  submission.getGDriveFile().moveTo(subFolder);
}

// Gets the project subfolder, creating one if it doesn't already exist. Adapted from:
 // https://yagisanatode.com/2018/07/08/google-apps-script-how-to-create-folders-in-directories-with-driveapp/ )
function getProjectSubFolder(parentFolderId, projectName) {
  const parentFolder = DriveApp.getFolderById(parentFolderId);
  const subFolders = parentFolder.getFolders();

  while (subFolders.hasNext()) {
    const subFolder = subFolders.next();

    if (subFolder.getName() === projectName) {
      return subFolder;
    }
  }

  return parentFolder.createFolder(projectName);
};

function sendConfirmationEmail(submission) {
  const rawFormValues = submission.getRawFormValues();
  const subject = 'Upload Recieved';
  const htmlBody = `
    <div>
      <p>
        Hi ${rawFormValues.name}!
      </p>
      <p>
        We have received your file for the <strong>${rawFormValues.project}</strong> project!
      </p>
      <li>Original File Name: ${submission.getOriginalFileName()}</li>
      <li>Section: ${rawFormValues.section}</li>
      <li>Category: ${rawFormValues.category}</li>
      <li>File Size: ${submission.getGDriveFile().getSize()}</li>
      <li>Uploaded On: ${submission.getGDriveFile().getDateCreated()}</li>
      <p>
        Thank you so much for participating! We couldn't sparkle without you!
      </p>
      <hr/>
      <i>This message was automatically generated.</i>
    </div>`
  ;

  GmailApp.sendEmail(rawFormValues.email, subject, '', { htmlBody: htmlBody });
}

function completeTrackingSpreadsheet(submission) {
  const TRACKING_SPREADSHEET_ID = 'REPLACE WITH SPREADSHEET ID FROM URL';
  const spreadsheet = SpreadsheetApp.openById(TRACKING_SPREADSHEET_ID);
  const sheet = spreadsheet.getSheets()[0];
  if (submission.getRawFormValues().category == 'Chorus') {
    const insertionCell = findInsertionCell(sheet, submission);
    sheet.getRange(insertionCell).setValue(1);
  }
}

function findInsertionCell(sheet, submission) {
  const memberFinder = sheet.getRange(1, 1, sheet.getLastRow()).createTextFinder(submission.getRawFormValues().name);
  const songFinder = sheet.getRange(1, 1 ,1 , sheet.getLastColumn()).createTextFinder(submission.getRawFormValues().project);

  const memberCellCoords = memberFinder.findNext().getA1Notation();
  const songAudioCellCoords = songFinder.findNext().getA1Notation();
  const songVideoCellCoords = songFinder.findNext().getA1Notation();

  const column = submission.getRawFormValues().uploadType === 'Audio' ? songAudioCellCoords.replace(/[0-9]/g, '') : songVideoCellCoords.replace(/[0-9]/g, '');
  const row = memberCellCoords.replace(/[^0-9]/g, '');
  return `${column}${row}`;
}

function getDebugSubmission() {
  return new SubmissionData({
    values:[
      '3/3/2021 20:12:15',
      'REPLACE WITH EMAIL',
      'REPLACE WITH NAME',
      'Soprano',
      'Band',
      'Trombone',
      'I Believe',
      'Audio',
      'REPLACE WITH FILE URL',
      'I love forms!']
  });
}

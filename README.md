# gforms-file-intake
Support script for sorting and acknowledging Google Forms file uploads.

This was created as part of a virtual choir project for the Northwest Firelight Chorale, allowing 60+ members to upload their audio and video files to a central location and track submissions.
Files are uploaded to the form, which immediately renames the file based on form responses.
The script then creates a child folder in the intake folder based on the project name (if one does not exist) and moves the file there.

SETUP:

- Create new Google Form with inputs for responder's email, name, section, category, and file upload section.
- Make sure receiving Drive folder has sufficient space. Ideally this should be a shared volume on G Suite without a space limitation.
- Add forms.gs to tracking spreadsheet via Tools/Script Editor
- In script editor, add onFormSubmit trigger
- Replace INTAKE_FOLDER_URL with the url of your intake folder
- Attach response tracking spreadsheet and note which columns correspond to which responses
- Ensure responseArray references correct columns and correct if necessary (remember arrays start at 0, timestamp is always the first column)
- Personalize response email


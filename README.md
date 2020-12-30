# gforms-file-intake
Support script for sorting and acknowledging Google Forms file uploads.

This was created as part of a virtual choir project for the Northwest Firelight Chorale, allowing 60+ members to upload their audio and video files to a central location and track submissions.

SETUP:

- Create new Google Form with inputs for responder's email, name, section, category, and file upload section. Make sure receiving Drive folder has sufficient space
- Replace INTAKE_FOLDER_URL with the url of your intake folder 
- Attach response tracking spreadsheet and note which columns correspond to which responses
- Ensure responseArray references correct columns and correct if necessary (remember arrays start at 0, timestamp is always the first column)
- Personalize response email


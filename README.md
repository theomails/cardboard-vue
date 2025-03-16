# cardboard-vue
Cards View for Custom JIRA Tracking

## Running this project

Note some quirks

 - The real cloud function URL is hardcoded.. so emulator is not configured even for local testing
 - Firestore is also configured to connect to production only.. and again emulator is not configured for local testing
 - The HTML part of the project is done with Vue 3 cli

 ### Steps to run

To push all changes to the cloud use:

firestore deploy 

To push only changes in functions to the cloud use:

firestore deploy --only functions

To push only the changes in the static website to the cloud use:

firestore deploy --only hosting

For running just the static site locally, firebase hosting emulator can be used (port 5000):

firebase emulators:start --only hosting
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const createNotification = ((notification) => {
  return admin.firestore().collection('notifications')
    .add(notification)
    .then(doc => console.log('notification added', doc));
});


exports.projectCreated = functions.firestore
  .document('projects/{projectId}')
  .onCreate(doc => {

    const project = doc.data();
    const notification = {
      content: 'Added a new project',
      user: `${project.authorFirstName} ${project.authorLastName}`,
      time: admin.firestore.FieldValue.serverTimestamp()
    }

    return createNotification(notification);

});

exports.newUserJoin = functions.firestore.document('users/{userID}').onCreate((snap, context) => {
  const user = snap.data();
  const displayName = `${user.firstName} ${user.lastName}`;   
  console.log(user, 'user');
   
  const notification = {
      content: 'New user join our project',
      user: displayName ,
      time: admin.firestore.FieldValue.serverTimestamp()
  }
  return createNotification(notification)
})
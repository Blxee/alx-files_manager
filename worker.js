const Queue = require('bull');
const dbClient = require('./utils/db');

const userQueue = new Queue('send welcome email');

userQueue.process((job, done) => {
  dbClient.client.db().collection('users').findOne({ _id: job.data.userId })
    .then((user) => {
      console.log(`Welcome ${user.email}!`);
      done();
    });
});

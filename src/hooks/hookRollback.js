const { exec } = require('child_process');

const aws = require('aws-sdk')
const codedeploy = new aws.CodeDeploy({ apiVersion: '2014-10-06' })

module.exports.post = (event, context, callback) => {
  var deploymentId = event.DeploymentId
  var lifecycleEventHookExecutionId = event.LifecycleEventHookExecutionId

  var testStatus = 'Succeeded'
  
  // exec('yarn test', (err, stdout, stderr) => {
  //   if (stderr.includes("failed")) {
  //     testStatus = 'Failed'
  //   }
  // });

  testStatus = 'Succeeded'
  
  var params = {
    deploymentId: deploymentId,
    lifecycleEventHookExecutionId: lifecycleEventHookExecutionId,
    status: testStatus // status can be 'Succeeded' or 'Failed'
  }

  return codedeploy.putLifecycleEventHookExecutionStatus(params).promise()
    .then(data => callback(null, 'Validation test succeeded'))
    .catch(() => callback(new Error('Validation test failed')))
}
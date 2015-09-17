var AWS = require('aws-sdk');

// configure AWS security tokens
AWS.config.update({accessKeyId: "AKIAILZRYR4YW2UJXBVA", 
  secretAccessKey: "w8Dx+Tkl1xL48ngy6oiUzYh1g+BaN6yZFybXXt8L"});

// Set your region for future requests.
AWS.config.update({region: 'us-west-1'});

var ec2 = new AWS.EC2();

var params = {
  ImageId: 'ami-a38b4ee7', // Amazon Linux AMI x86_64 EBS
  InstanceType: 't1.micro',
  KeyName: 'DevOpsHW1',
  MinCount: 1, MaxCount: 1
};

// Create the instance
ec2.runInstances(params, function(err, data) {
  if (err) { console.log("Could not create instance", err); return; }

  var instanceId = data.Instances[0].InstanceId;
  console.log("Created instance", instanceId);
});
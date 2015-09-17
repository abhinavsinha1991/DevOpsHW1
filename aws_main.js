var AWS = require('aws-sdk');
var fs = require('fs');
var HWconfig = require('./hw1.json');

// configure AWS security tokens
var ansibleLocation = HWconfig.ansibleLocation;
AWS.config.update({accessKeyId: HWconfig.awsaccessKeyId, 
  secretAccessKey: HWconfig.secretAccessKey});

// Set your region for future requests.
AWS.config.update({region: 'us-west-1'});

var ec2 = new AWS.EC2();

var params = {
  ImageId: 'ami-a38b4ee7', // Amazon Linux AMI x86_64 EBS
  InstanceType: 't1.micro',
  KeyName: 'DevOpsHW1',
  MinCount: 1, MaxCount: 1
};

ec2.runInstances(params, function(err, data) {
	if (err) { 
		console.log("Could not create instance", err); return; 
	}
	//store instance id to get ip address later
	var instanceId = data.Instances[0].InstanceId;
	console.log("\nAWS instance Created with instanceId:" , instanceId);

	var params = {
	  InstanceIds: [ instanceId ]
	};

	console.log("Waiting for AWS instance to get started...");
	var sleep = require('sleep');
    sleep.sleep(80);
	console.log("AWS instance is up and running...Getting details of AWS instance");

	// Getting description of info
	ec2.describeInstances(params, function(err, data) 
	{
	  	if (err) 
	  	{
	  		console.log(err, err.stack); // an error occurred
	  	}
		else 
		{ //write ip address to inventory file
			var ipAddress = data.Reservations[0].Instances[0].PublicIpAddress;
			console.log("IP address of AWS instance: " + ipAddress);
			var inventoryContent = "node1 ansible_ssh_host=" + ipAddress
							+ " ansible_ssh_user=ubuntu"
							+ " ansible_ssh_private_key_file=" + ansibleLocation + "/keys/DevOpsHW1.pem\n";

			fs.appendFile(ansibleLocation + "/inventory", inventoryContent, function(fileErr) 
			{
				if(fileErr) 
				{
			        	return console.log("Error writing in inventory file:\n" + fileErr);
				}
				console.log("inventory file updated!");
			});
		}	          
    });
}); 
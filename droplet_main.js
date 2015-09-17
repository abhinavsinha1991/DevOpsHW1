var needle = require("needle");
var os   = require("os");
var fs = require('fs');
var sleep = require('sleep');

var ansibleLocation = "~/devops/HW1/ansible";
var config = {};
config.token = "dd8ff05f3b798c730b22810598eec41070abceec36c86853b38829f1d3cbcdad";

var headers =
{
	'Content-Type':'application/json',
	Authorization: 'Bearer ' + config.token
};

var client =
{

	createDroplet: function (dropletName, region, imageName, onResponse)
	{
		var data = 
		{
			"name": dropletName,
			"region":region,
			"size":"512mb",
			"image":imageName,
			// Id to ssh_key already associated with account.
			"ssh_keys":[1355963],
			"backups":false,
			"ipv6":false,
			"user_data":null,
			"private_networking":null
		};

		console.log("Attempting to create: "+ JSON.stringify(data) );

		needle.post("https://api.digitalocean.com/v2/droplets", data, {headers:headers,json:true}, onResponse );
	},
	getDropletInfo: function( dropletId1, callback )
	{
		needle.get("https://api.digitalocean.com/v2/droplets/" + dropletId1, {headers:headers}, callback);
	},

	deleteDroplet: function( dropletId1, callback)
	{
		var data = null;
		needle.delete("https://api.digitalocean.com/v2/droplets/" + dropletId1, data, {headers:headers}, callback);
	}
};



// #############################################
// #3 Create an droplet with the specified name, region, and image

var name = "chpawar-"+ "DevOpsDroplet";
var region = "nyc1"; // Fill one in from #1
var image = "13089493"; // Fill one in from #2
var dropletId = "";
client.createDroplet(name, region, image, function(err, resp, body)
{
	console.log("Creating droplet on digitalocean...\n");

	// StatusCode 202 - Means server accepted request.
	if(!err && resp.statusCode == 202)
	{
		console.log( JSON.stringify( body, null, 3 ) );
	}
	else {
		console.log("Droplet created...");
		// Write down/copy droplet id.
		dropletId = body.droplet.id;
		console.log("Waiting for droplet to get started...");
		sleep.sleep(80);
		console.log("Droplet is initiated...Getting details of droplet");

		// calling API getDropletInfo method
		client.getDropletInfo(dropletId, function(error, response) 
		{
			if(error) {
				console.log("error:" + error);
			}
			var data = response.body;
			var ipAddress = "";
			if( data.droplet )
			{
					console.log("Dropletinfo: " + "id:" + data.droplet.id);
					console.log("name:" + data.droplet.name);
					console.log("memory:" + data.droplet.memory);
					console.log("disk:" + data.droplet.disk);
					console.log("region:" + data.droplet.region);
					console.log("created_at:" + data.droplet.created_at);
					if(data.droplet.networks) {
						console.log("IPv4 address:" + data.droplet.networks.v4[0].ip_address);
						ipAddress = data.droplet.networks.v4[0].ip_address;
					}
					console.log("\n");
			}
			// Write down/copy ip address to add in inventory file.
			var ipAddress = data.droplet.networks.v4[0].ip_address;
			var inventoryContent = "[Servers]\nnode0 ansible_ssh_host=" + ipAddress
						+ " ansible_ssh_user=root"
						+ " ansible_ssh_private_key_file=" + ansibleLocation + "/keys/Node0.key\n";
			fs.writeFile(ansibleLocation + "/inventory", inventoryContent, function(fileErr) {
				if(fileErr) {
			        	return console.log("Error creating inventory file:\n" + fileErr);
				}
				console.log("inventory file was created!");
			});
		});
	}
});

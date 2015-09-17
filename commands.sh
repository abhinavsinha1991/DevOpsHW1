#!/bin/sh
export ANSIBLE_HOST_KEY_CHECKING=False
rm ./ansible/inventory
node ./droplet_main.js
node ./aws_main.js
ansible-playbook ./ansible/playbook.yml -i ./ansible/inventory
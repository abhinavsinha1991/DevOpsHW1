# DevOpsHW1
HW1 for CSC591 course DevOps

###### Server provisioning using ansible
1] creating droplet on digitalocean
2] creating EC2 instance on AWS
3] installing enginx web server on both the machines

###### ansible-playbook contents:
<pre><code>
---
- hosts: Servers
  tasks:
    - name: Installs nginx web server
      apt: pkg=nginx state=installed update_cache=true
      sudo: true
      notify:
        - start nginx

  handlers:
    - name: start nginx
      service: name=nginx state=started
</code></pre>

[Video for demo](https://youtu.be/tBokADo-W_Y)

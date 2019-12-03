# AutoMake Project Deployment
### 1. Environment settings

Start by updating the packages list by typing:
```sh
sudo apt update
```
Install ```nodejs``` and ```npm``` using the apt package manager from the NodeSource repository:
```sh
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
```
Once the NodeSource repository is enabled, install Node.js and npm by typing:
```sh
sudo apt install nodejs
```
Verify that the Node.js and npm were successfully installed is by printing their versions:
```sh
node --version
```
```sh
Output
v10.13.0
```
```sh
npm --version
```
```sh
Output
6.4.1
```
and then install ```git``` 
```sh
sudo apt install git
```
Verify that the git successfully installed is by printing their versions:
```sh
git --version
```
```sh
Output
git version 2.17.1
```
and then install ```nginx```
```sh
sudo apt install nginx
```
At the end of the installation process, Ubuntu 18.04 starts Nginx. The web server should already be up and running.
We can check with the ```systemd``` init system to make sure the service is running by typing:
```sh
systemctl status nginx
```
```sh
Output
nginx.service - A high performance web server and a reverse proxy server
   Loaded: loaded (/lib/systemd/system/nginx.service; enabled; vendor preset: enabled)
   Active: active (running) since Fri 2018-04-20 16:08:19 UTC; 3 days ago
     Docs: man:nginx(8)
 Main PID: 2369 (nginx)
    Tasks: 2 (limit: 1153)
   CGroup: /system.slice/nginx.service
           ├─2369 nginx: master process /usr/sbin/nginx -g daemon on; master_process on;
           └─2380 nginx: worker process
```
- #### Managing the Nginx Process
To stop your web server, type:
```sh
sudo systemctl stop nginx
```
To start the web server when it is stopped, type:
```sh
sudo systemctl start nginx
```
To stop and then start the service again, type:
```sh
sudo systemctl restart nginx
```
If you are simply making configuration changes, Nginx can often reload without dropping connections. To do this, type:
```sh
sudo systemctl reload nginx
```
By default, Nginx is configured to start automatically when the server boots. If this is not what you want, you can disable this behavior by typing:
```sh
sudo systemctl disable nginx
```
To re-enable the service to start up at boot, you can type:
```sh
sudo systemctl enable nginx
```
- #### Nginx Config
Install ```nano``` to edit config
```sh
sudo apt-get install nano
```
and then edit ```config``` in
```sh
sudo nano /etc/nginx/sites-available/default
```
then edit this to
```sh
server {
        listen 80;
        listen [::]:80;

        root http://localhost:8080;

        # Add index.php to the list if you are using PHP
        index index.html index.htm index.nginx-debian.html;

        server_name _;

        location / {
                # First attempt to serve request as file, then
                # as directory, then fall back to displaying a 404.
                try_files $uri $uri @backend;
        }
        location @backend {
                proxy_pass http://localhost:8080;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header Host $http_host;
                proxy_http_version 1.1;
                proxy_set_header X-NginX-Proxy true;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection "upgrade";
                proxy_cache_bypass $http_upgrade;
                proxy_redirect off;
                proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
```
then ```Ctrl + X``` and then ```Ctrl + Y``` to save config

### 2. Clone project from github
Clone project from repositories
```sh
git clone https://github.com/vtandroid/auto_make.git automake
```

### 3. Install package
Move to the folder above
```sh
cd automake
```

# then
install ```@angular/cli```
```sh
sudo npm install -g @angular/cli
```

and then ```install package```

```sh
npm install --save
```

and then install ```pm2``` to start the project:
```sh
npm install pm2 -g
```

# then
create file `.env`
```
PORT = 8080
API_V1 = http://xx.xx.xx.xx:xxxx
TOKEN = Token xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
MAKE = http://xx.xx.xx.xx:xxxx
GOOGLE_API_KEY = AIzaSyBE4o11lhLuqOLwk6-OBUPPFBmZ1jGps9E
```

# then
creator log
```sh
sudo pm2 ecosystem simple
```
and then edit file ```ecosystem.config.js```
```
sudo nano ecosystem.config.js
```
edit it into
```
module.exports = {
  apps : [{
    name   : "AutoMake",
    script : "./local.js",
    log_date_format : "YYYY-MM-DD HH:mm Z",
    error_file : "./logs/error_log/error_log_automake.log",
    out_file : "./logs/out_log/out_log_automake.log"
  }]
}
```
then ```Ctrl + X``` and then ```Ctrl + Y``` to save edit

install ```logrotate```
```
sudo pm2 install pm2-logrotate
```

config ```logrotate```
```
sudo pm2 set pm2-logrotate:retain 7
sudo pm2 set pm2-logrotate:compress false
sudo pm2 set pm2-logrotate:dateFormat YYYY-MM-DD_HH-mm-ss
sudo pm2 set pm2-logrotate:max_size 128M
sudo pm2 set pm2-logrotate:rotateInterval '0 0 * * * '
sudo pm2 set pm2-logrotate:rotateModule true
sudo pm2 set pm2-logrotate:workerInterval 30
```

### 4. Build project

Before running the project, you need to build it with the command:
```sh
sudo npm run build:prod
```

and then success, we need to launch the project with ```pm2``` using the command:
```sh
sudo pm2 start ecosystem.config.js
```

and then restart ```nginx```:
```sh
sudo systemctl restart nginx
```

### 5. View logs

Log ```error```

```sh
cd automake/logs/error_log
```

Log ```success```

```sh
cd automake/logs/out_log
```

## Done!
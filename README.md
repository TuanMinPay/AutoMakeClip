# Command

clone project
```
git clone https://github.com/Tuannvd00538/AutoMakeClip.git automake
```
then
```
cd automake
```
then

```
npm install --save
```

# then
create file `.env`
```
PORT = 8080
API_V1 = http://xx.xx.xx.xx:xxxx
TOKEN = Token xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

# then
creater log
```
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
    name   : "AutoFarm",
    script : "./local.js",
    log_date_format : "YYYY-MM-DD HH:mm Z",
    error_file : "./logs/error_log/error_log_autofarm.log",
    out_file : "./logs/out_log/out_log_autofarm.log"
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

```
npm run build:prod
```

```
sudo pm2 start ecosystem.config.js
```
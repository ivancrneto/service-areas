#!/bin/bash
pid=`ps aux | grep fcgi | grep port=8099`;
arr=(`echo $pid | cut -d " "  --output-delimiter=" " -f 1-`);
echo "pid: ${arr[1]}";
kill -9 ${arr[1]};
python manage.py runfcgi method=threaded host=127.0.0.1 port=8099;

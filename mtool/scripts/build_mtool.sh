#!/bin/bash
ROOT_DIR=$(readlink -f $(dirname $0))
cd $ROOT_DIR
cd ..

rm -r dist

pipenv run pyinstaller --hidden-import=eventlet.hubs.epolls --hidden-import=eventlet.hubs.kqueue --hidden-import=eventlet.hubs.selects --hidden-import=dns.asyncbackend --hidden-import=dns.asyncquery --hidden-import=dns.asyncresolver --hidden-import=dns.e164 --hidden-import=dns.namedict --hidden-import=dns.tsigkeyring --hidden-import=dns.zone --hidden-import=engineio.async_drivers.aiohttp --hidden-import=engineio.async_drivers.eventlet --onefile rest/app.py > /dev/null 2>&1

mkdir dist/bin
mv dist/app dist/bin
cp -r public dist
rm -r public/log
mkdir public/log
#touch public/log/README.md
mkdir dist/log
#touch dist/log/README.md

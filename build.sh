#!/bin/bash
ver="$(cat package.json| grep '"version":' | awk -F":" '{print $2}' | awk -F'"' '$0=$2')"
program="scanner"

git add .
git commit -m "Deploy $program ver $ver"
git push
commit="$(git log | grep commit | head -n 1 | awk -F " " '{print $2}')"

echo "Build new release ver "$ver

react-scripts build

echo "coping folder"
cp -R build $program.$ver

echo $commit > $program.$ver/commit.txt

echo "create the TARBALL"
tar -cvf $program.$ver.tar $program.$ver

echo "Remove folder"
rm -Rf $program.$ver

echo "Copy to remote server"
scp $program.$ver.tar pi@192.168.0.2:/home/pi

echo "Remove local TarBall"
rm $program.$ver.tar

echo "Deploy to remote server"
ssh pi@192.168.0.2 "echo pi | sudo -S /home/pi/deploy.sh $program.$ver.tar"

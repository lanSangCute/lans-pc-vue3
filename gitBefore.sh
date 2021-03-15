#/bin/sh
# add
git add .
# commit
git commit -am '发版前确认提交代码，以防version冲突'
# pull
git pull
# push
git push

echo "完成"
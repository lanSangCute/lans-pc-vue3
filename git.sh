#/bin/sh
echo -e "\033[42;30m npm版本发布完成 \033[0m"
jsonpath='package.json'
appcode=''
versioncode=''
if [ ! -f $jsonpath ]; 
  then echo "file not exist"
  exit 0
fi
while read line
do  
   #contain keywords
  [[ $line =~ '"version"'  ]] && {
  
    appcode=${line:12:50}
    versioncode=${appcode%%\"*}
    echo $versioncode
    echo 'npm publish 版本:'$versioncode
  } 
done < $jsonpath
 
if [ ! -n :"$appcode" ]; then
  # empty 
  exit 0
fi
# add
git add .
# commit
git commit -am 'npm publish 版本更新:'$versioncode
# pull
git pull
# push
git push

# 新建分支
git checkout -b $versioncode
# 提交之远程分支
git push origin $versioncode
# 切换回dev分支
git checkout dev

echo -e "\033[42;30m git版本分支保存完成 \033[0m"
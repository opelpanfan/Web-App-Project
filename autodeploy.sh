[ "$1" == "force" ] && force=y
echo $force
while true	
do
	result=$(git pull)
	echo $result
	if [ "$force" = "y" ]; then
		donow=y
	fi
	if [ ! "$result" = "Already up-to-date." ]; then
		donow=y
	fi
	if [ "$donow" = "y" ]; then
		echo "we should do"
		(
			cd frontend;
			echo 'start frontend npm build'
			npm ci  --unsafe-perm
				(npm run build) &
				(npm run storybook:build)
		) &
		(
			cd backend;
			echo "start backend build"
			npm ci --unsafe-perm
		) 
	fi
	unset force
	unset donow
	sleep 5
done

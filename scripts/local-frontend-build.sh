set -e
cd frontend
echo 'Start NPM I in frontend'
npm i > /dev/null
echo 'Start NPM run build in frontend'
npm run build > /dev/null
echo 'Start NPM run storyboook:build in frontend'
npm run storybook:build > /dev/null
echo 'finishs'
@echo off
echo Adding changes to git...
git add .

set /p commit_msg="Enter commit message (or press enter for default 'Update'): "
if "%commit_msg%"=="" set commit_msg=Update

echo Committing changes...
git commit -m "%commit_msg%"

echo Pushing changes...
git push

echo.
echo All done!
pause

@echo off
git add .
git commit -m "feat:wallet connect and improvement frontend 30/03/2026"
git branch -M main
git remote add origin https://github.com/HiyokoXeno-git/presale-react.git 2>NUL
git remote set-url origin https://github.com/HiyokoXeno-git/presale-react.git
git push -u origin main

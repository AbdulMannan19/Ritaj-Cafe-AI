ngrok http 5000 --domain=tortoise-working-naturally.ngrok-free.app

cd API
python -m venv .venv
.venv\Scripts\activate
python.exe -m pip install --upgrade pip
pip install -r requirements.txt
python app.py

cd UI
npm install
npm start

python.exe -m pip install --upgrade

git status
git add .
git commit -m "quick commit"
git push

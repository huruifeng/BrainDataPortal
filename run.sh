printf "Installing backend dependencies ...\n"
pip install -r backend/requirements.txt

printf "Installing frontend dependencies ...\n"
cd frontend || exit
npm install
cd ..

printf "Staring backend ...\n"
./run_backend.sh

printf "Staring frontend ...\n"
./run_frontend.sh

printf "Done ^_^\n"

nohup python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000 >> backend.log 2>&1 &
# lsof -i:8000
# kill -9 $(lsof -t -i:8000)

## pid: 600190


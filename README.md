## BrainDataPortal

- This is project designed for the brain data analysis and visualization.
- The data assays include: scRNAseq, scATACseq, ChIPseq, Spatial Transcriptomics and other omics data.
- The backend is using [FastAPI](https://fastapi.tiangolo.com/) and [uvicorn](https://www.starlette.io/).
- The frontend is using [React](https://react.dev/) and [Vite](https://vitejs.dev/).
- The data is stored in [Redis](https://redis.io/) database.
- Use zustand for state management, and us material ui for design
- Use [React Router](https://reactrouter.com/) for routing.
- Use [React Query](https://react-query.tanstack.com/) for data fetching.
- Use [React Hook Form](https://react-hook-form.com/) for form validation.
- Use [React Toastify](https://fkhadra.github.io/react-toastify/) for notification.
- Use [React Hook Form](https://react-hook-form.com/) for form validation.

### How to use

1. Clone the repository.
2. Install dependencies.
   - In the frontend directory.
   
       ```npm install```
   - In the backend directory.

       ```pip install -r requirements.txt```
3. Run the backend, change to backend directory.

   ```python3 main.py```
4. Run the frontend, change to frontend directory.

   ```npm run dev```
6. Use the frontend.


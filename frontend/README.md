## React + Vite
- This is project designed for the brain data analysis and visualization. 
- The data assays include: scRNAseq, scATACseq, ChIPseq, Spatial Transcriptomics and other omics data.
- The backend is using [FastAPI](https://fastapi.tiangolo.com/)
- The frontend is using [Vite](https://vitejs.dev/) and [React](https://reactjs.org/)
- Use zustand for state management, and us material ui for design

## Features
- Login and Registration
  - designed protected routes, some pages are only accessible to logged in users, otherwise redirect to login page.
- Navigation bar
- Footer
- Landing page (Home page)
- Data page
- Analysis page
- Help page
  - Help page includes: How to use, FAQ, REST API
- About page

### Home page
- this is a landing page for the website. 
- At the top there is a navigation bar, where you can navigate to different pages.
  - On the left of the nav bar, there is a logo and name(BrainDataPortal) for the website, followed by the navigation links.
  - The nav items are: About, Data, Analysis, Help, Help is a dropdown menu with "How to use", "FAQ", and "REST API". "REST API" separated by a line.
  - On the right of the nav bar, there is registration and login functions.
- The middle is the main content.
  - First, there is a title and description of the website.
  - Second, there is a picture of the brain.  (I have prepared a picture, each picture has one brain region).
    - The the brain picture is interactive, when hovering over it, it will show the corresponding brain region with colored highlight (I have prepared pictures with highlight regions, each picture has one colored brain region).
    - To the left of the picture, it is the cell lines and regions list.
    - To the right of the picture, it is the data assay list (scRNAseq, scATACseq, ChIPseq, Spatial Transcriptomics).
    - When clicking on the region in the picture, it will update the data assay list.
    - There are three buttons below the picture, they are: "Healthy Control", "Parkinson's Disease", and "Alzheimer's Disease". When clicking on the button, it will update the cell lines/region list, and the data assay list.
_ After the picture, there is a data statistics table/Horizontal list 
- At the bottom there is a footer, where you can find the contact information.

## Data page
- This page is used to show the data.
- on the left there are a set of filters, which can be used to filter the data.
- on the right is show the data, we provide three ways to show the data:
  - table: show the data in a table
  - list: show the data in a list
  - data matrix like the encode project: show the data in a matrix
  - user can choose which way to show the data.
- on the bottom there is a pagination, which can be used to page the data.
- on the top there is a search bar, which can be used to search the data.

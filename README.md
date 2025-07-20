# WaterlooDates
This project was created for and submitted to Hack the 6ix 2025 by Andrew, Andrew, Dylan, and Eric. 6️⃣

## Setup
Clone the repository onto your local machine. For the frontend, be sure to `cd` into `frontend/waterloodates`. This is the root directory of the Next.js app. Then, run `npm install` to acquire the necessary Node modules to run the app. Moreover, to have Auth0 running, you will want to follow this guide: https://auth0.com/docs/quickstart/webapp/nextjs/01-login. Once that's done, you are ready to get up and running! Simply enter `npm run dev` to start the development server!

For the backend, set up the `.env` file in the root level of the project containing the Vellum API key and MongoDB URI. Create a python virtual environment by doing `python -m venv venv`, do `venv/Scripts/activate` to activate it, then do `pip install -r requirements.txt` to install the dependencies. To run the backend server, create a separate terminal from the frontend, and run `python backend/app.py` to start the flask server.

## What is WaterlooDates?
WaterlooDates is inspired by Waterloo's notorious co-op board: WaterlooWorks. 💵

Users authenticate by email/password or through Google oAuth, and begin building their profile. The profile consists of two main parts: the Rizzumé and the Wingman.

### Rizzumé 📄
The rizzumé is like your résumé. It details your basic information and your relevant qualities. This is the main document that you will present and review when trying to match with others. It contains information ranging from your name, to your sexual orientation, to your career, building a strong and comprehensive profile for others to match with. 🤝

### Wingman 🤖
The wingman is your personal AI assistant for dating. Your wingman acts as your personal secretary, screening people through live calls before they reach you directly. You may customize your wingman to prioritize certain qualities/prefer certain answers to specific questions to your heart's content, ensuring that your love interest is really the one for you. 💖 

## Technologies Used 💻
Our project consists of two main layers: the frontend and the backend.

### Frontend 📱
The frontend is a Next.js web app, written in Typescript and styled with TailwindCSS. The first point of entry for the user is the landing page, where they may enter the app. 

#### Auth0 🔒
Every other site is protected behind Auth0, courtesy of the Auth0 Next.js SDK. Every single page apart from the landing page is protected behind Auth0, requiring users to sign up/log in, after which there will be a callback leading to the dashboard page, which displays the users' sent and received applications to match with others.

The Auth0 tenant was configured on the Auth0 Dashboard, and their provided login page was made use of for our app. Callback URLs, logout URLs, and web origins were configured to control the flow of traffic into the app.

### Backend 🖴
The backend is a Python Flask server. It consists of a custom REST API to enable requests from the frontend to the backend, retreiving information from MongoDB, Ribbon AI, Vellum, and Gemini in the backend.

#### MongoDB Atlas 🍃
MongoDB Atlas was used to store user data, applications, 

#### AI


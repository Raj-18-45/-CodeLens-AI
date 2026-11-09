CodeLens AI 🚀

AI-Powered Code Review Assistant

CodeLens AI is an AI-powered code review application that analyzes source code and provides intelligent feedback, identifies potential bugs, suggests improvements, and generates optimized code using Google’s Gemini AI.

The goal of CodeLens AI is to help developers write cleaner, more efficient, readable, and maintainable code.

✨ Features

* AI-Powered Code Review: Analyze source code using Google Gemini AI.
* Bug Detection: Identify potential bugs and logical errors.
* Code Optimization: Get suggestions to improve code efficiency and performance.
* Code Suggestions: Receive improved versions of your code.
* Syntax Highlighting: Write and view code with syntax highlighting.
* Interactive Code Editor: Enter, edit, and review code.
* Loading Indicators: Get feedback while AI processes your code.
* Easy-to-Use Interface: Simple and clean user experience.

🛠️ Tech Stack

Frontend

* React.js
* Vite
* JavaScript
* Axios
* PrismJS
* React Simple Code Editor
* React Markdown

Backend

* Node.js
* Express.js
* JavaScript
* Google Gemini AI
* Google GenAI SDK
* dotenv
* CORS

📁 Project Structure
``` text

CODE-REVIEW/
│
├── BackEnd/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── ai.controller.js
│   │   ├── routes/
│   │   │   └── ai.routes.js
│   │   ├── services/
│   │   │   └── ai.service.js
│   │   └── app.js
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── .gitignore
```

⚙️ Installation and Setup

Follow these steps to run CodeLens AI locally.

1. Clone the Repository

git clone https://github.com/Raj-18-45-/-CodeLens-AI.git
cd -CodeLens-AI

2. Backend Setup

Navigate to the backend directory:

cd BackEnd

Install dependencies:

npm install

3. Configure Environment Variables

Create a .env file inside the BackEnd directory.

Add your Gemini API key:

GOOGLE_GEMINI_KEY=your_gemini_api_key

Replace your_gemini_api_key with your actual Google Gemini API key.

Important: Never share or upload your actual API key to GitHub.

4. Start the Backend Server

npm run dev

The backend server will run at:

http://localhost:3000

5. Frontend Setup

Open another terminal and navigate to the frontend directory:

cd frontend

Install dependencies:

npm install

Start the frontend development server:

npm run dev

The frontend will run at:

http://localhost:5173

Open the URL in your browser to use CodeLens AI.

🔗 API Endpoint

The backend provides an API endpoint for AI-powered code reviews.

Method	Endpoint	Description
POST	/api/ai/get-review	Analyzes submitted code and generates an AI review

Example Request
```test
{
  "code": "function add(a, b) { return a + b; }"
}
```
🔄 Application Workflow
``` text

       User
         |
         v
  Enter Source Code
         |
         v
   React Frontend
         |
         v
    Axios Request
         |
         v
  Express Backend
         |
         v
    API Controller
         |
         v
     AI Service
         |
         v
    Google Gemini
         |
         v
   Generate Review
         |
         v
   Return Response
         |
         v
  Display AI Review
  ```

🔮 Future Improvements

* Support for multiple programming languages.
* More detailed code quality analysis.
* Security vulnerability detection.
* Code complexity analysis.
* User authentication and review history.
* Downloadable code review reports.
* Integration with GitHub repositories.

🤝 Contributing

Contributions, suggestions, and feedback are welcome!

If you would like to contribute:

1. Fork this repository.
2. Create a new branch.
3. Make your changes.
4. Commit your changes.
5. Submit a Pull Request.

👨‍💻 Author

Sumit Raj

GitHub: Raj-18-45-

⸻

⭐ If you find CodeLens AI useful, consider giving this repository a star!
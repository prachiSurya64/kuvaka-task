# React + Vite/kuvaka-task-from-prachi (You can check the live demo here:https://my-kuvaka-task.netlify.app/)

This project is a React-based AI Chat Application integrating Google Gemini API to provide real-time AI-powered chat responses.
It includes modern UI features like dark mode, message throttling, pagination, and infinite scrolling for smooth chat history navigation.

https://github.com/prachiSurya64/kuvaka-task - github
npm install
.env=> VITE_GEMINI_API_KEY=AIzaSyC6IvZMgets6Vb42p0RWze4pQr7Kzcit5Y (after some days i'll be change/delete this key becuase of security perpose)
start dv server = npm run dev
run build = npm run build

Folder Structure =>
src/
├── api/                 # API calls and services
│   └── countriesApi.js
│
├── assets/              # Images, icons, and static assets
│
├── components/          # Reusable UI components
│   ├── ChatInput.jsx
│   ├── ChatMsg.jsx
│   ├── CopyClip.jsx
│   └── DarkModeToggle.jsx
│
├── hooks/               # Custom React hooks
│   └── useDebounce.js
│
├── pages/               # Page-level components
│   ├── ChatRoom.jsx
│   ├── DashboardPage.jsx
│   └── LoginPage.jsx
│
├── store/               # Zustand state management
│   ├── authStore.js
│   ├── chatRoomStore.js
│   ├── chatStore.js
│   ├── index.js
│   └── msgStore.js
│
├── styles/              # CSS styling files
│   ├── chatRoom.css
│   └── main.css
│
├── utils/               # Utility/helper functions
│   ├── copyToClipboard.js
│   ├── fakeApi.js
│   └── localStorage.js
│
├── App.jsx              # Main application component
├── index.js             # React app entry point
└── main.jsx             # Vite entry file

Implemented Features :
1. Throttling
Controlled message sending and AI response generation using delays to avoid API overuse.

2. Pagination
Loads chat history in pages to improve performance.

3. Infinite Scroll
Implements reverse infinite scroll to load older messages when the user scrolls to the top.

4. Form Validation
Built with React Hook Form + Zod schema validation.
Displays inline error messages for invalid inputs.

6. Dark Mode
Toggles chat interface between light and dark themes using Zustand state.

Note:-
Due to time constraints in my daily office routine, I was not able to create a dedicated backend for this project.
For demonstration purposes, I have integrated Gemini/Google APIs. I am aware that this approach is not secure for production applications, but it allowed me to complete the assignment within the limited time frame.
At this stage, my primary focus was to finish the core assignment requirements (throttling, pagination, infinite scroll, form validation, etc.) rather than polishing the UI or adding extra features.
You can check the live demo here:https://my-kuvaka-task.netlify.app/

ThankYou!!!






Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

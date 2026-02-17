# MediRemind - Smart Medication Reminder Application

A cross-platform web application that helps users manage their medications, set reminders, and track adherence.

![MediRemind](https://img.shields.io/badge/React-18-blue) ![Vite](https://img.shields.io/badge/Vite-5-purple) ![License](https://img.shields.io/badge/License-MIT-green)

---

## 🚀 Quick Start (Running Locally)

### Prerequisites

Before you begin, make sure you have the following installed on your computer:

- **Node.js** (version 16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)

To check if you have them installed, open your terminal and run:

```bash
node --version
npm --version
```

### Installation Steps

1. **Clone or Download the Project**
   
   If you have Git installed:
   ```bash
   git clone <repository-url>
   cd mediremind
   ```
   
   Or simply download and extract the project folder.

2. **Install Dependencies**
   
   Open a terminal in the project folder and run:
   ```bash
   npm install
   ```
   This will download all the required packages (may take 1-2 minutes).

3. **Start the Application**
   ```bash
   npm run dev
   ```

4. **Open in Browser**
   
   Once the server starts, you'll see:
   ```
   VITE ready in XXX ms
   ➜  Local:   http://localhost:5173/
   ```
   
   Open your web browser and go to: **http://localhost:5173**

### Stopping the Application

Press `Ctrl + C` in the terminal to stop the server.

---

## 📖 User Guide

### 1. Getting Started

#### Creating an Account
1. Open the app and click **"Create one here"** on the login page
2. Fill in your details:
   - Full Name
   - Email Address
   - Password (minimum 6 characters)
   - Confirm Password
3. Click **"Sign Up"**

#### Logging In
1. Enter your email and password
2. Click **"Log In"**

#### Demo Account
For testing, you can use the demo credentials:
- **Email:** `demo@example.com`
- **Password:** `password123`

Click **"Use Demo Account"** to auto-fill these credentials.

---

### 2. Dashboard Overview

After logging in, you'll see the main dashboard with:

| Section | Description |
|---------|-------------|
| **Header** | Shows your name, current date, and logout button |
| **Progress Bar** | Displays how many medications you've taken today |
| **Next Reminder** | Highlights your upcoming medication |
| **Add Medication** | Button to add new medications |
| **Today's Medications** | List of all your medications for the day |

---

### 3. Managing Medications

#### Adding a New Medication
1. Click the **"+ Add Medication"** button
2. Fill in the form:
   - **Medication Name** - e.g., "Lisinopril", "Vitamin D"
   - **Time to Take** - Select when to take it
   - **Dosage** - e.g., "10 mg", "1 tablet", "500 mg"
3. Click **"Save Medication"**

#### Editing a Medication
1. Find the medication in your list
2. Click the **pencil icon** (✏️) next to it
3. Update the details
4. Click **"Update Medication"**

#### Deleting a Medication
1. Click the **trash icon** (🗑️) next to the medication
2. Confirm by clicking **"Delete"**

---

### 4. Taking Medications

#### Marking as Taken
- Click the **"Take"** button next to any medication
- The button will turn green and show **"Taken"**
- The medication card will be highlighted in green

#### Unmarking (Made a Mistake?)
- Click the **"Taken"** button again to unmark it

---

### 5. Reminders

#### Viewing Reminders
- The **"Today's Next Reminder"** card shows your upcoming medication
- It displays the medication name, scheduled time, and dosage

#### Getting Notifications
1. Click **"Show Reminder"** on the reminder card
2. Allow browser notifications when prompted
3. You'll receive an alert with the medication details

> **Note:** Browser notifications require permission. Make sure to allow notifications for the best experience.

---

### 6. Tracking Progress

The **progress bar** at the top shows your daily adherence:
- Displays "X of Y taken" (e.g., "2 of 5 taken")
- The bar fills up as you take more medications
- Helps you track your daily medication compliance

---

## 🔧 Troubleshooting

### Common Issues

| Problem | Solution |
|---------|----------|
| Page won't load | Make sure the server is running (`npm run dev`) |
| "Port already in use" | Another app is using port 5173. Stop it or change the port |
| Login not working | Check email/password. Try the demo account first |
| Changes not saving | Data is stored in browser. Don't clear browser data |

### Clearing Data (Fresh Start)
If you want to reset everything:
1. Open browser Developer Tools (F12)
2. Go to Application → Local Storage
3. Delete all `mediremind_*` entries

---

## 📁 Project Structure

```
mediremind/
├── public/              # Static assets
├── src/
│   ├── context/         # React context (auth, medications)
│   ├── pages/           # Page components
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── Dashboard.jsx
│   │   └── AddMedication.jsx
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── index.html
├── package.json
└── README.md
```

---

## 🛠️ Technologies Used

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Navigation
- **Lucide React** - Icons
- **CSS Modules** - Scoped styling
- **LocalStorage** - Data persistence

---

## 📝 Notes

- All data is stored locally in your browser (localStorage)
- No internet connection required after initial setup
- Data persists between sessions but is browser-specific
- For production use, consider adding a backend database

---

## 📄 License

This project is for educational purposes (BSc Software Engineering Final Year Project).

---

## 👤 Author

**Aliyu Hassan**  
BSc Software Engineering  
Student Number: 2515006

---

*MediRemind - Helping you stay on track with your medications* 💊

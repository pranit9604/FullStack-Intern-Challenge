👥 User Roles & Functionalities 1️⃣ System Administrator Can add new stores, normal users, and admin users.

Has access to a dashboard displaying:

✅ Total number of users

✅ Total number of stores

✅ Total number of submitted ratings

Can add new users with:

📝 Name, Email, Password, Address

Can view a list of stores with:

🏬 Name, Email, Address, Rating

Can view a list of users (normal/admin) with:

👤 Name, Email, Address, Role

Can apply filters on all listings (Name, Email, Address, Role).

Can view details of all users (Store Owners also show ratings).

Can log out from the system.

2️⃣ Normal User Can sign up and log in to the platform.

Signup Form Fields:

📝 Name, Email, Address, Password

Can update password after logging in.

Can view all registered stores.

Can search stores by Name & Address.

Store listings display:

🏪 Store Name

📍 Address

⭐ Overall Rating

🔎 User's Submitted Rating

✍️ Option to submit/modify a rating

Can submit ratings (between 1 to 5).

Can log out.

3️⃣ Store Owner Can log in and update their password.

Dashboard shows:

✅ List of users who rated their store

⭐ Average rating of their store

Can log out.

📂 Project Structure

/frontend
├── /src
│ ├── /components (UI Components)
│ ├── /pages (AdminDashboard, Home, UserDashboard)
│ ├── /context (AuthContext for authentication)
│ ├── App.js
│ ├── index.js
├── package.json
├── README.md

/backend
├── /routes (API Endpoints)
├── /controllers (Business Logic)
├── /models (Database Schema)
├── server.js
├── package.json
├── .env

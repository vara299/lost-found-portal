🎒 College Lost & Found Portal

A full-stack MERN web application that helps students report, search, and recover lost items within a college campus through a centralized digital platform.

Developed as part of Full Stack Development (22CSE612) – Semester 6 at Woxsen University – School of Technology. 

LostFoundPortal_Presentation 1

📌 Project Overview

Educational institutions are busy environments where students frequently misplace personal belongings such as phones, ID cards, wallets, books, and keys. Traditional lost-and-found systems rely on manual records or notice boards, which makes item recovery inefficient.

The College Lost & Found Portal digitizes this process by allowing users to:

- Report lost items
- Post found items
- Upload item images
- Search and filter items
- Claim recovered belongings

The platform creates a centralized and transparent system for managing lost and found items across campus.

🚀 Key Features
🔐 User Authentication

- Secure JWT-based authentication
- Password hashing using bcryptjs
- Protected routes for authenticated users

📦 Lost Item Reporting

Report lost items with:

- Title
- Description
- Category
- Location
- Date
- Contact details
- Image upload support

View and manage personal reports

🔎 Found Item Posting

- Post found items with details and location
- Finder contact information displayed
- Claim system for item recovery
- Status tracking: Available / Claimed

🔍 Smart Search & Filtering

- Live keyword search
- Category filtering (Electronics, Books, Keys, etc.)
- Sort by newest or oldest items

📱 Responsive User Interface

- Built with React + Tailwind CSS
- Works across desktop, tablet, and mobile devices

🏗 System Architecture

The project follows a three-tier client-server architecture:

Frontend Layer
- React.js + Vite
- React Context API
- Axios HTTP client
- React Router v6
- Tailwind CSS

Backend Layer
- Node.js + Express.js
- RESTful APIs
- JWT authentication middleware
- Multer for image uploads

Database Layer
- MongoDB Atlas (Cloud NoSQL Database)
- Mongoose ODM for schema modeling

🧰 Technology Stack

| Category    | Technology                                   |
|-------------|----------------------------------------------|
| Frontend    | React.js, Vite, Tailwind CSS                |
| Routing     | React Router v6                             |
| HTTP Client | Axios                                       |
| Backend     | Node.js, Express.js                         |
| Database    | MongoDB Atlas                               |
| ORM         | Mongoose                                    |
| Authentication | JWT, bcryptjs                            |
| File Upload | Multer                                      |

📡 API Endpoints

**Authentication**

| Method | Endpoint            | Access  | Description          |
|--------|---------------------|---------|----------------------|
| POST   | /api/auth/register  | Public  | Register new user    |
| POST   | /api/auth/login     | Public  | Login user           |

**Lost Items**

| Method | Endpoint  | Access  | Description                    |
|--------|-----------|---------|--------------------------------|
| GET    | /api/lost | Public  | Fetch all lost items           |
| POST   | /api/lost | Private | Create lost item report        |

**Found Items**

| Method | Endpoint             | Access  | Description             |
|--------|----------------------|---------|-------------------------|
| PUT    | /api/found/:id/claim | Private | Claim a found item      |
| DELETE | /api/found/:id       | Private | Delete item             |

🗄 Database Schema

**Users**
- name: String
- email: String (unique)
- password: String (hashed)
- role: user | admin

**LostItems**
- title
- description
- category
- location
- date
- contactInfo
- image
- postedBy → User

**FoundItems**
- title
- description
- category
- status (available | claimed)
- claimedBy → User
- finderContact

🧪 Testing

The system was tested with multiple scenarios including authentication, item reporting, search functionality, and claim operations.

All major test cases passed successfully, confirming correct system functionality.

Tested features include:

- User registration and login
- Lost item reporting with image upload
- Found item posting
- Live search filtering
- Item claim system
- Access control for deleting items

📈 Future Enhancements

Potential improvements for future versions include:

- 📱 Mobile application using React Native
- 🔔 Email and push notifications for matched items
- 🤖 AI-based image matching using TensorFlow.js
- 📊 Admin dashboard with recovery analytics
- QR code tagging for physical item tracking
- Integration with college ERP / student ID system

# 🛒 Vibe Commerce - E-Commerce Shopping Cart

A full-stack e-commerce application built with the MERN stack, featuring a complete shopping cart system with product management, cart functionality, and mock checkout.

![Vibe Commerce Banner]

## 🚀 Live Demo
- **GitHub Repository:** https://github.com/darkNIGHT669/vibe-ecommerce
- **Demo Video:** [Add your Loom video link here]

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [Video Walkthrough](#video-walkthrough)

## ✨ Features

### Core Functionality
- ✅ **Product Catalog:** Browse 12+ products with images, descriptions, and prices (INR)
- ✅ **Shopping Cart:** Add, update quantity, and remove items
- ✅ **Cart Management:** Real-time total calculation
- ✅ **Mock Checkout:** Complete checkout process with order receipt
- ✅ **Responsive Design:** Mobile-friendly UI with Tailwind CSS
- ✅ **Database Persistence:** MongoDB integration for data storage
- ✅ **Error Handling:** Comprehensive error handling across frontend and backend

### Bonus Features Implemented
- 🎯 Database persistence with MongoDB
- 🎯 Complete error handling with user-friendly messages
- 🎯 Category-based product organization
- 🎯 Product ratings and stock management
- 🎯 Form validation on checkout

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Router** - Navigation (if applicable)

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment configuration

## 📁 Project Structure

```
vibe-ecommerce/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── models/
│   │   ├── Product.js            # Product schema
│   │   ├── Cart.js               # Cart schema
│   │   └── Order.js              # Order schema
│   ├── routes/
│   │   ├── productRoutes.js      # Product API routes
│   │   ├── cartRoutes.js         # Cart API routes
│   │   └── checkoutRoutes.js     # Checkout API routes
│   ├── seed.js                   # Database seeding script
│   ├── server.js                 # Express server entry point
│   ├── package.json              # Backend dependencies
│   └── .env                      # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ProductCard.jsx   # Product display component
│   │   │   ├── Cart.jsx          # Cart component
│   │   │   ├── Checkout.jsx      # Checkout form
│   │   │   └── Receipt.jsx       # Order receipt modal
│   │   ├── App.jsx               # Main application component
│   │   ├── main.jsx              # Application entry point
│   │   └── index.css             # Global styles
│   ├── package.json              # Frontend dependencies
│   └── vite.config.js            # Vite configuration
│
├── screenshots/                  # Application screenshots
├── README.md                     # Project documentation
└── .gitignore                    # Git ignore rules
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager

### Step 1: Clone the Repository
```bash
git clone https://github.com/darkNIGHT669/vibe-ecommerce.git
cd vibe-ecommerce
```

### Step 2: Backend Setup
```bash
cd backend
npm install

# Create .env file with the following:
# MONGODB_URI=your_mongodb_connection_string
# PORT=5000

# Seed the database with sample products
npm run seed

# Start the backend server
npm run dev
```

Backend will run on: `http://localhost:5000`

### Step 3: Frontend Setup
```bash
cd frontend
npm install

# Start the development server
npm run dev
```

Frontend will run on: `http://localhost:5173`

### Step 4: Access the Application
Open your browser and navigate to `http://localhost:5173`

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### Products

**GET /api/products**
- Description: Retrieve all products
- Response: Array of product objects

```json
[
  {
    "_id": "product_id",
    "name": "Wireless Headphones",
    "description": "Premium noise-cancelling headphones",
    "price": 18999,
    "category": "Electronics",
    "image": "image_url",
    "stock": 45,
    "rating": 4.7
  }
]
```

#### Cart

**POST /api/cart**
- Description: Add item to cart
- Request Body:
```json
{
  "productId": "product_id",
  "quantity": 1
}
```
- Response: Updated cart object

**GET /api/cart**
- Description: Get all cart items with total
- Response:
```json
{
  "items": [...],
  "total": 25999
}
```

**PUT /api/cart/:id**
- Description: Update cart item quantity
- Request Body:
```json
{
  "quantity": 2
}
```

**DELETE /api/cart/:id**
- Description: Remove item from cart
- Response: Success message

#### Checkout

**POST /api/checkout**
- Description: Process checkout and generate receipt
- Request Body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "cartItems": [...]
}
```
- Response:
```json
{
  "orderId": "order_id",
  "total": 25999,
  "timestamp": "2025-11-08T10:30:00Z",
  "items": [...],
  "customerName": "John Doe",
  "customerEmail": "john@example.com"
}
```

## 📸 Screenshots

### 1. Products Page
![Products Grid](./ScreenShot\products-page.png)
*Browse all available products with "Add to Cart" functionality*

### 2. Shopping Cart
![Shopping Cart](./ScreenShot\Cart.png)
*View cart items, update quantities, and see real-time total*

### 3. Checkout Form
![Checkout Form](./ScreenShot\checkout.png)
*Enter customer details for order processing*


## 🎥 Video Walkthrough

📹 **Watch the 2-minute demo:** [Add your Loom video link]

The video demonstrates:
- Product browsing and filtering by categories
- Adding multiple items to cart
- Updating cart quantities
- Removing items from cart
- Checkout process with form validation
- Order receipt generation
- Responsive design on different screen sizes

## 💡 Key Implementation Highlights

### Frontend
- **State Management:** React hooks (useState, useEffect) for managing application state
- **API Integration:** Axios for making HTTP requests to backend
- **Responsive Design:** Tailwind CSS utility classes for mobile-first design
- **User Experience:** Loading states, error handling, and success notifications
- **Form Validation:** Client-side validation for checkout form

### Backend
- **RESTful API:** Clean, organized REST endpoints
- **Database Models:** Mongoose schemas for Products, Cart, and Orders
- **Error Handling:** Try-catch blocks with meaningful error messages
- **CORS Configuration:** Proper CORS setup for frontend-backend communication
- **Environment Variables:** Secure configuration management with dotenv

### Database
- **MongoDB Collections:** Separate collections for products, cart items, and orders
- **Data Relationships:** Proper referencing between collections
- **Seeding Script:** Automated database population with sample data

## 🔧 Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/vibe-commerce
# or MongoDB Atlas URI
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vibe-commerce

PORT=5000
NODE_ENV=development
```

## 🧪 Testing the Application

1. **Start both servers** (backend on 5000, frontend on 5173)
2. **Browse products** - View all available products
3. **Add to cart** - Click "Add to Cart" on multiple products
4. **View cart** - Check cart page to see added items
5. **Update quantity** - Increase/decrease quantities
6. **Remove items** - Remove items from cart
7. **Checkout** - Fill form and complete checkout
8. **View receipt** - See generated order receipt with details

## 🚧 Known Issues & Future Enhancements

### Future Enhancements
- User authentication and login system
- Product search and filtering
- Wishlist functionality
- Order history for users
- Payment gateway integration
- Product reviews and ratings
- Admin dashboard for product management

## 👨‍💻 Developer

**Name:** Harsh 
**GitHub:** [@darkNIGHT669](https://github.com/darkNIGHT669)  
**Email:** harshbn2004@gmail.com

## 📝 Assignment Completion

This project was completed as part of the Vibe Commerce internship screening assignment.

### Requirements Met:
- ✅ Backend APIs: All 5 required endpoints implemented
- ✅ Frontend: Complete React UI with all required features
- ✅ Database: MongoDB integration with persistence
- ✅ Cart Functionality: Add, remove, update, view with totals
- ✅ Checkout: Mock checkout with receipt generation
- ✅ Responsive Design: Mobile-friendly interface
- ✅ Error Handling: Comprehensive error handling
- ✅ GitHub Repository: Well-organized with clear structure
- ✅ Documentation: Complete README with setup instructions
- ✅ Demo Video: 2-minute walkthrough

**Submission Date:** November 8, 2025

## 📄 License

This project is created for educational purposes as part of an internship assignment.

---

**⭐ If you found this project helpful, please consider giving it a star!**
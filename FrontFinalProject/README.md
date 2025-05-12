👟 Shoe Store Web Application
🧾 Overview
This is a shoe store web application built using React, Flowbite, TypeScript, and Node.js. The application features both an Admin and User role, with distinct functionalities for each. Users can browse and purchase shoes, while the admin can manage inventory, user status, and order details.

--------------------------------------------------------------------------

🚀 Features
👤 User Features
🗂️ Browse Shoes by Categories
Shoes are categorized into Women, Men, and Children.

Users can view shoes with details such as Name, Brand, Price, and Image.

📄 Product Details
Clicking on a shoe shows detailed information, including available sizes and whether they are in stock.

Users can add shoes to their shopping cart with the available sizes.

🛒 Shopping Cart
Users can view, modify, and remove items from the shopping cart.

Options to increase/decrease quantity, remove items, and clear the cart are available.

💳 Checkout
Users must provide personal details (Name, Address, Phone) to complete the purchase.

Users can review their cart and total before making the payment.

The cart is preserved until payment is completed.


--------------------------------------------------------------------------


🛠️ Admin Features
👥 User Management
Admin can view all users in a CRM section and change their status between Personal and Business.

📦 Product Management
Admin can view, add, edit, or delete shoes from the product catalog.

For each product, admin can adjust inventory and other details (price, sizes, etc.).

📊 View Shoe Inventory
Admin can see the complete list of shoes, including stock status.


--------------------------------------------------------------------------


🔐 Authentication
Only registered users can make purchases.

Admin has special permissions to manage users and products.

Users who are not logged in can only browse shoes.


--------------------------------------------------------------------------


🧰 Tech Stack
🎨 Frontend
React for building the UI components

Flowbite for UI components and styling

TypeScript for type safety

Redux for state management (shopping cart, user data)

Axios for API requests

SweetAlert2 for displaying user-friendly alerts

⚙️ Backend
Node.js with Express for the server-side logic

MongoDB for storing user and product data

JWT for user authentication

Mongoose for MongoDB schema definitions


--------------------------------------------------------------------------

The search bar works in the crm admin page , (search by users)

--------------------------------------------------------------------------


🛒 Cart Router (/api/cart)

GET /: Fetch the user's cart.

POST /:shoeId/add: Add a shoe to the cart.

PUT /:shoeId/:size/increase: Increase the quantity of a shoe in the cart.

PUT /:shoeId/:size/decrease: Decrease the quantity of a shoe in the cart.

DELETE /:shoeId/:size/remove: Remove a shoe from the cart.

DELETE /clear: Clear the cart.

POST /checkout: Proceed with checkout and create an order.

Role-based access is enforced through authentication.

--------------------------------------------------------------------------


👟 Shoes Router (/api/shoes)

GET /: Fetch all shoes.

GET /:id: Fetch a shoe by ID.

POST /: Add a new shoe (Business user only).

PUT /:id: Update a shoe (Admin only).

DELETE /:id: Delete a shoe (User only).

Implements role-based access control with isBusiness, isAdmin, and isUser middleware for secure access.


--------------------------------------------------------------------------


👤 Users Router (/api/users)

GET /: Fetch all users (Admin only).

GET /:id: Fetch a user by ID (accessible to the user or Admin).

POST /register: Register a new user.

POST /login: Login and receive JWT token.

DELETE /:id: Delete a user (accessible to the user or Admin).

PUT /:id: Update user details (accessible to the user or Admin).

PATCH /:id: Change a user's auth level (Admin only).

Implements role-based access control and input validation for registration and login.



--------------------------------------------------------------------------


🛡️ Middleware and Token Handling
auth middleware correctly verifies JWT and assigns req.user

User roles (admin, business, user) are stored in the database and used in access control logic


--------------------------------------------------------------------------


📦 package.json
Development tools like nodemon and dotenv are properly included

Libraries such as bcrypt, joi, jsonwebtoken, and lodash are solid choices for validation, authentication, and data handling
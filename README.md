# 🌴 Travel Nest Admin Dashboard

<div align="center">
  <img src="/api/placeholder/900/300" alt="Travel Nest Admin Dashboard Banner" />
  
  <p align="center">
    <a href="#live-demo">View Demo</a>
    ·
    <a href="#features">Features</a>
    ·
    <a href="#installation">Installation</a>
    ·
    <a href="#usage">Usage</a>
    ·
    <a href="#license">License</a>
  </p>
</div>

## ✨ Overview

Travel Nest Admin Dashboard is a powerful, modern administrative interface for managing a travel booking platform. Built with Laravel, Inertia.js, and React, this dashboard provides a seamless experience for administrators to manage users, destinations, bookings, and content.

![GitHub stars](https://img.shields.io/github/stars/username/travel-nest-admin?style=social)
![GitHub forks](https://img.shields.io/github/forks/username/travel-nest-admin?style=social)
![GitHub issues](https://img.shields.io/github/issues/username/travel-nest-admin)
![GitHub license](https://img.shields.io/github/license/username/travel-nest-admin)

## 🔥 Features

- **🔐 Authentication & Authorization** - Secure login and role-based access control
- **👥 User Management** - View, create, edit, and manage user accounts
- **📍 Destination Management** - Create and manage travel destinations
- **💰 Special Offers** - Create and track promotional offers
- **💬 Message Management** - Handle customer inquiries and messages
- **📊 Analytics Dashboard** - View key metrics and performance indicators
- **🖼️ Content Management** - Manage hero sections and website content
- **📱 Responsive Design** - Works seamlessly across desktop and mobile devices

## 🖥️ Tech Stack

- **Backend:** Laravel 10+
- **Frontend:** React, Inertia.js
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Authentication:** Laravel Sanctum

## 📷 Screenshots

<div align="center">
  <img src="/api/placeholder/400/250" alt="Dashboard Overview" width="400" />
  <img src="/api/placeholder/400/250" alt="Users Management" width="400" />
  <img src="/api/placeholder/400/250" alt="Destinations" width="400" />
  <img src="/api/placeholder/400/250" alt="Messages" width="400" />
</div>

## 🚀 Installation

### Prerequisites

- PHP 8.1+
- Composer
- Node.js 16+
- MySQL or PostgreSQL

### Step 1: Clone the repository

```bash
git clone https://github.com/username/travel-nest-admin.git
cd travel-nest-admin
```

### Step 2: Install dependencies

```bash
# Install PHP dependencies
composer install

# Install Node.js dependencies
npm install
```

### Step 3: Configure environment

```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure your database in .env
```

### Step 4: Run migrations and seeders

```bash
# Run database migrations
php artisan migrate

# Seed the database with initial data
php artisan db:seed
```

### Step 5: Build assets and start server

```bash
# Build frontend assets
npm run dev

# Start Laravel development server
php artisan serve
```

Visit http://localhost:8000/admin to access the dashboard.

## 🔧 Usage

### Admin Access

Use the following credentials to access the admin dashboard:

- **Email:** admin@travelnest.com
- **Password:** password

### Key Features

#### Dashboard Overview

The dashboard provides a comprehensive overview of your Travel Nest platform:
- User statistics
- Latest messages
- Revenue metrics
- Popular destinations
- Special offers

#### User Management

Manage user accounts with:
- User creation and editing
- Role assignment
- Account status management
- Activity tracking

#### Destination Management

Create and manage travel destinations with:
- Name, description, and images
- Pricing information
- Availability settings
- Featured status

## 📁 Project Structure

```
travel-nest-admin/
│
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── Admin/
│   │   │       ├── AdminDashboardController.php
│   │   │       ├── AdminUserController.php
│   │   │       └── ...
│   │   ├── Middleware/
│   │   │   └── AdminMiddleware.php
│   │   └── ...
│   ├── Models/
│   │   ├── User.php
│   │   ├── Destination.php
│   │   ├── Message.php
│   │   └── ...
│   └── ...
│
├── resources/
│   ├── js/
│   │   ├── Components/
│   │   │   └── AdminSidebar.jsx
│   │   ├── Pages/
│   │   │   └── Admin/
│   │   │       └── Dashboard.jsx
│   │   └── ...
│   └── ...
│
└── routes/
    └── web.php
```

## 🛣️ Roadmap

- [ ] Add booking management
- [ ] Implement advanced analytics
- [ ] Add multi-language support
- [ ] Integrate payment tracking
- [ ] Implement user reviews management

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Contact

Your Name - [@your_twitter](https://twitter.com/your_twitter) - email@example.com

Project Link: [https://github.com/username/travel-nest-admin](https://github.com/username/travel-nest-admin)

## 🙏 Acknowledgements

- [Laravel](https://laravel.com)
- [Inertia.js](https://inertiajs.com)
- [React](https://reactjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Lucide Icons](https://lucide.dev)

# MUSLIM MART - Mart Management Software

A complete web-based Mart Management System built with HTML, Tailwind CSS, and vanilla JavaScript (ES6).

## Features

### 1. Authentication
- User Registration with validation
- Secure Login system
- Session management with local storage
- Demo account for testing

### 2. Sales / Billing Module
- Customer name tracking
- Product selection with real-time pricing
- Quantity input with stock validation
- Automatic price calculation
- Discount and Tax calculation
- Delivery option toggle
- Paid amount and return amount tracking
- Real-time transaction history

### 3. Inventory Management
- Add, Edit, Delete products
- Track product quantities
- Low stock alerts
- Stock auto-deduction after sale
- Category and subcategory organization
- 23 pre-loaded products

### 4. Profit & Loss Reports
- Buy Price vs Sell Price tracking
- Daily profit/loss summary
- Monthly profit/loss summary
- Overall profit/loss tracking
- Item-wise detailed reports
- Transaction counting

### 5. Product Categories (Hierarchical)
- GARMENTS: Gents, Ladies, Kids
- FOOD ITEMS: Fruits, Vegetables, Snacks, Drinks, Meat, Cereals, Dairy
- SHOES: Company, Gents, Ladies, Kids
- ELECTRONICS: Company products
- HOME APPLIANCES
- CAFETERIA: Snacks, Coffee, Fast Food
- PLAY AREA
- MEDICINES: Antibiotics, Homeopathics, Cosmetics

### 6. Dashboard
- Total products available
- Total products sold
- Total sales amount
- Total profit/loss tracking
- Category-wise summary
- Low stock indicators

## Project Structure

```
/
├── index.html            (Dashboard)
├── register.html         (User Registration)
├── login.html           (User Login)
├── products.html        (Product Management)
├── sales.html          (POS / Billing)
├── reports.html        (Profit & Loss Reports)
├── js/
│   ├── data.js         (Data management & storage)
│   └── auth.js         (Authentication & session)
└── README.md
```

## Getting Started

### 1. Extract Files
- Place all files in a directory

### 2. Open in Browser
- Open `register.html` to create a new account
- Or use demo credentials:
  - Email: demo@muslimmart.com
  - Password: demo123

### 3. Navigate Dashboard
- Dashboard: View all metrics and summaries
- Products: Manage inventory
- Sales/POS: Create sales transactions
- Reports: View P&L statements

## Data Storage

All data is stored in browser's LocalStorage:
- User credentials
- Products inventory
- Sales transactions
- Categories

*Note: Data persists across browser sessions*

## Key Features

### Authentication System
- Registration validation
- Email uniqueness check
- Password confirmation
- Session persistence

### Product Management
- CRUD operations
- Buy/Sell price tracking
- Category organization
- Minimum stock levels
- Search and filter

### Sales Processing
- Real-time calculations
- Discount & tax support
- Customer tracking
- Stock auto-update
- Return amount calculation

### Reports & Analytics
- Daily summaries
- Monthly summaries
- Overall reports
- Item-wise breakdown
- Profit/Loss tracking

## Technical Stack

- **HTML5**: Semantic markup
- **Tailwind CSS**: Utility-first styling
- **Vanilla JavaScript (ES6)**: Pure JavaScript logic
- **LocalStorage**: Client-side data persistence

## Browser Compatibility

- Chrome (Latest)
- Firefox (Latest)
- Safari (Latest)
- Edge (Latest)

## Notes

- No external dependencies or frameworks
- Production-ready code with clean architecture
- Modular JavaScript for maintainability
- Responsive design for all devices
- Password encoding (basic, use proper encryption in production)

## Future Enhancements

- Backend integration (Node.js/Express)
- Database storage (MongoDB/MySQL)
- User roles and permissions
- Multi-store support
- Mobile app version
- Advanced reporting with charts
- Invoice printing
- Barcode scanning
- SMS notifications

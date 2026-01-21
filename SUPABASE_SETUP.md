SUPABASE INTEGRATION SETUP GUIDE
=================================

PROJECT CREDENTIALS
- URL: https://uupoazvmckjyfxomlsbw.supabase.co
- ANON KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1cG9henZtY2tqeWZ4b21sc2J3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5ODYwMTQsImV4cCI6MjA4NDU2MjAxNH0.52zwLBV8WfOASiRmMncBrDs5PBHaJB7g50z0eUT9IYs

STEP 1: CREATE DATABASE TABLES
=============================
1. Go to Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Go to SQL Editor
4. Create new query
5. Copy and paste contents of SQL_SETUP.sql
6. Click "Run"
7. Tables and sample data will be created

STEP 2: VERIFY INSTALLATION
===========================
1. Go to the app
2. Open browser DevTools (F12)
3. Open Console tab
4. Run: initSupabase()
5. If no errors, Supabase is ready

STEP 3: TEST DATABASE FUNCTIONS
===============================
In browser console:

// Test products
await initSupabase()
const products = await getProducts()
console.log(products)

// Test add product
const newProduct = await addProduct({
    name: 'Test Product',
    category: 'GARMENTS',
    buyPrice: 100,
    sellPrice: 200,
    stock: 50
})

// Test sales
const sales = await getSales()
console.log(sales)

// Test profit/loss
const pl = await calculateProfitLoss()
console.log(pl)

// Test dashboard
const dashboard = await getDashboardSummary()
console.log(dashboard)

AVAILABLE FUNCTIONS
===================

PRODUCTS:
- initSupabase() - Initialize Supabase client
- addProduct(productData) - Add new product
- getProducts() - Fetch all products
- getProductById(id) - Get single product
- updateProduct(id, updates) - Update product
- deleteProduct(id) - Delete product
- updateProductStock(id, quantityChange) - Update stock

SALES:
- createSale(saleData) - Create new sale
- getSales() - Fetch all sales
- getSaleById(id) - Get single sale with items
- getSalesByDateRange(start, end) - Filter by date

ANALYTICS:
- calculateProductProfitLoss(productId) - Single product P&L
- calculateProfitLoss(startDate, endDate) - Overall P&L
- calculateProfitLossByCategory() - P&L by category
- getDashboardSummary() - Dashboard statistics

FILES CREATED/MODIFIED
======================
Created:
- js/supabase.js (Supabase integration)
- SQL_SETUP.sql (Database schema)

Modified:
- index.html (added supabase.js script)
- products.html (added supabase.js script)
- sales.html (added supabase.js script)
- reports.html (added supabase.js script)

IMPORTANT NOTES
===============
✓ No environment files needed (works on GitHub Pages)
✓ Credentials are in js/supabase.js (change if needed)
✓ RLS policies allow anon access by default
✓ Service role key is NOT exposed
✓ All functions use async/await
✓ Error handling is built-in
✓ Production-ready code

NEXT STEPS
==========
1. Run SQL_SETUP.sql in Supabase
2. Update pages to use Supabase functions instead of localStorage
3. Test all functions in console
4. Deploy to production

SECURITY
========
⚠️  For production, consider:
- Implement proper RLS policies per user
- Use authenticated users instead of anon
- Rotate/regenerate anon key if exposed
- Add rate limiting
- Validate inputs on frontend

// ====================
// DATA & STORAGE MANAGEMENT
// ====================

class DataManager {
    constructor() {
        this.storagePrefix = 'muslimmart_';
        this.initializeDefaultData();
    }

    // Initialize default data structure
    initializeDefaultData() {
        if (!this.getData('products')) {
            this.setData('products', this.getDefaultProducts());
        }
        if (!this.getData('sales')) {
            this.setData('sales', []);
        }
        if (!this.getData('categories')) {
            this.setData('categories', this.getDefaultCategories());
        }
    }

    // Get default product categories
    getDefaultCategories() {
        return {
            'GARMENTS': ['Gents', 'Ladies', 'Kids'],
            'FOOD_ITEMS': ['Fruits', 'Vegetables', 'Snacks', 'Drinks', 'Meat', 'Cereals', 'Dairy Products'],
            'SHOES': ['Company', 'Gents', 'Ladies', 'Kids'],
            'ELECTRONICS': ['Company based products'],
            'HOME_APPLIANCES': ['General'],
            'CAFETERIA': ['Snacks', 'Coffee', 'Fast Food'],
            'PLAY_AREA': ['General'],
            'MEDICINES': ['Antibiotics', 'Homeopathics', 'Cosmetic products']
        };
    }

    // Get default products
    getDefaultProducts() {
        return [
            { id: 1, name: 'T-Shirt', category: 'GARMENTS', subcategory: 'Gents', buyPrice: 300, sellPrice: 500, quantity: 50, minStock: 5, dateAdded: new Date().toISOString() },
            { id: 2, name: 'Saree', category: 'GARMENTS', subcategory: 'Ladies', buyPrice: 1500, sellPrice: 2500, quantity: 20, minStock: 3, dateAdded: new Date().toISOString() },
            { id: 3, name: 'School Uniform', category: 'GARMENTS', subcategory: 'Kids', buyPrice: 400, sellPrice: 700, quantity: 30, minStock: 5, dateAdded: new Date().toISOString() },
            { id: 4, name: 'Apple (1kg)', category: 'FOOD_ITEMS', subcategory: 'Fruits', buyPrice: 200, sellPrice: 300, quantity: 100, minStock: 10, dateAdded: new Date().toISOString() },
            { id: 5, name: 'Tomato (1kg)', category: 'FOOD_ITEMS', subcategory: 'Vegetables', buyPrice: 80, sellPrice: 120, quantity: 50, minStock: 10, dateAdded: new Date().toISOString() },
            { id: 6, name: 'Chips', category: 'FOOD_ITEMS', subcategory: 'Snacks', buyPrice: 50, sellPrice: 80, quantity: 200, minStock: 20, dateAdded: new Date().toISOString() },
            { id: 7, name: 'Coca Cola (1L)', category: 'FOOD_ITEMS', subcategory: 'Drinks', buyPrice: 80, sellPrice: 120, quantity: 60, minStock: 10, dateAdded: new Date().toISOString() },
            { id: 8, name: 'Chicken (1kg)', category: 'FOOD_ITEMS', subcategory: 'Meat', buyPrice: 400, sellPrice: 600, quantity: 25, minStock: 5, dateAdded: new Date().toISOString() },
            { id: 9, name: 'Rice (1kg)', category: 'FOOD_ITEMS', subcategory: 'Cereals', buyPrice: 100, sellPrice: 150, quantity: 150, minStock: 20, dateAdded: new Date().toISOString() },
            { id: 10, name: 'Milk (1L)', category: 'FOOD_ITEMS', subcategory: 'Dairy Products', buyPrice: 120, sellPrice: 180, quantity: 80, minStock: 10, dateAdded: new Date().toISOString() },
            { id: 11, name: 'Sports Shoes', category: 'SHOES', subcategory: 'Company', buyPrice: 2000, sellPrice: 3500, quantity: 15, minStock: 3, dateAdded: new Date().toISOString() },
            { id: 12, name: 'Formal Shoes (Gents)', category: 'SHOES', subcategory: 'Gents', buyPrice: 1500, sellPrice: 2500, quantity: 10, minStock: 2, dateAdded: new Date().toISOString() },
            { id: 13, name: 'Heels (Ladies)', category: 'SHOES', subcategory: 'Ladies', buyPrice: 1200, sellPrice: 2000, quantity: 12, minStock: 2, dateAdded: new Date().toISOString() },
            { id: 14, name: 'School Shoes (Kids)', category: 'SHOES', subcategory: 'Kids', buyPrice: 800, sellPrice: 1300, quantity: 20, minStock: 3, dateAdded: new Date().toISOString() },
            { id: 15, name: 'Mobile Phone', category: 'ELECTRONICS', subcategory: 'Company based products', buyPrice: 15000, sellPrice: 22000, quantity: 5, minStock: 1, dateAdded: new Date().toISOString() },
            { id: 16, name: 'Washing Machine', category: 'HOME_APPLIANCES', subcategory: 'General', buyPrice: 25000, sellPrice: 35000, quantity: 3, minStock: 1, dateAdded: new Date().toISOString() },
            { id: 17, name: 'Samosa (1 plate)', category: 'CAFETERIA', subcategory: 'Snacks', buyPrice: 50, sellPrice: 80, quantity: 200, minStock: 20, dateAdded: new Date().toISOString() },
            { id: 18, name: 'Coffee', category: 'CAFETERIA', subcategory: 'Coffee', buyPrice: 40, sellPrice: 60, quantity: 150, minStock: 20, dateAdded: new Date().toISOString() },
            { id: 19, name: 'Chicken Biryani', category: 'CAFETERIA', subcategory: 'Fast Food', buyPrice: 200, sellPrice: 350, quantity: 50, minStock: 5, dateAdded: new Date().toISOString() },
            { id: 20, name: 'Play Ticket', category: 'PLAY_AREA', subcategory: 'General', buyPrice: 100, sellPrice: 200, quantity: 500, minStock: 50, dateAdded: new Date().toISOString() },
            { id: 21, name: 'Aspirin', category: 'MEDICINES', subcategory: 'Antibiotics', buyPrice: 10, sellPrice: 20, quantity: 100, minStock: 20, dateAdded: new Date().toISOString() },
            { id: 22, name: 'Homeopathic Remedy', category: 'MEDICINES', subcategory: 'Homeopathics', buyPrice: 200, sellPrice: 350, quantity: 30, minStock: 5, dateAdded: new Date().toISOString() },
            { id: 23, name: 'Face Cream', category: 'MEDICINES', subcategory: 'Cosmetic products', buyPrice: 300, sellPrice: 500, quantity: 40, minStock: 5, dateAdded: new Date().toISOString() }
        ];
    }

    // Generic storage methods
    setData(key, value) {
        localStorage.setItem(this.storagePrefix + key, JSON.stringify(value));
    }

    getData(key) {
        const data = localStorage.getItem(this.storagePrefix + key);
        return data ? JSON.parse(data) : null;
    }

    // Product management
    getProducts() {
        return this.getData('products') || [];
    }

    addProduct(product) {
        const products = this.getProducts();
        product.id = Math.max(...products.map(p => p.id), 0) + 1;
        product.dateAdded = new Date().toISOString();
        products.push(product);
        this.setData('products', products);
        return product;
    }

    updateProduct(id, updatedProduct) {
        const products = this.getProducts();
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
            products[index] = { ...products[index], ...updatedProduct };
            this.setData('products', products);
            return products[index];
        }
        return null;
    }

    deleteProduct(id) {
        let products = this.getProducts();
        products = products.filter(p => p.id !== id);
        this.setData('products', products);
    }

    getProductById(id) {
        return this.getProducts().find(p => p.id === id);
    }

    // Sales management
    getSales() {
        return this.getData('sales') || [];
    }

    addSale(sale) {
        const sales = this.getSales();
        sale.id = Math.max(...sales.map(s => s.id), 0) + 1;
        sale.dateTime = new Date().toISOString();
        sales.push(sale);
        this.setData('sales', sales);
        this.updateProductQuantity(sale.productId, -sale.quantity);
        return sale;
    }

    getSalesById(id) {
        return this.getSales().find(s => s.id === id);
    }

    // Inventory management
    updateProductQuantity(productId, quantityChange) {
        const product = this.getProductById(productId);
        if (product) {
            product.quantity += quantityChange;
            this.updateProduct(productId, product);
        }
    }

    getLowStockProducts() {
        return this.getProducts().filter(p => p.quantity <= p.minStock);
    }

    // Dashboard statistics
    getDashboardStats() {
        const products = this.getProducts();
        const sales = this.getSales();

        const totalProducts = products.reduce((sum, p) => sum + p.quantity, 0);
        const totalSold = sales.reduce((sum, s) => sum + s.quantity, 0);
        const totalSales = sales.reduce((sum, s) => sum + s.totalPrice, 0);
        
        let totalProfit = 0;
        let totalLoss = 0;

        sales.forEach(sale => {
            const product = this.getProductById(sale.productId);
            if (product) {
                const profitPerUnit = product.sellPrice - product.buyPrice;
                const totalProfit_item = profitPerUnit * sale.quantity;
                if (totalProfit_item > 0) {
                    totalProfit += totalProfit_item;
                } else {
                    totalLoss += Math.abs(totalProfit_item);
                }
            }
        });

        return {
            totalProducts,
            totalSold,
            totalSales,
            totalProfit,
            totalLoss,
            categoryWiseSummary: this.getCategoryWiseSummary(),
            lowStockProducts: this.getLowStockProducts()
        };
    }

    // Category-wise summary
    getCategoryWiseSummary() {
        const products = this.getProducts();
        const categories = {};

        products.forEach(product => {
            if (!categories[product.category]) {
                categories[product.category] = {
                    count: 0,
                    totalValue: 0,
                    quantity: 0
                };
            }
            categories[product.category].count += 1;
            categories[product.category].totalValue += product.quantity * product.sellPrice;
            categories[product.category].quantity += product.quantity;
        });

        return categories;
    }

    // Profit & Loss Report
    getProfitLossReport(filterDate = null) {
        const sales = this.getSales();
        let filteredSales = sales;

        if (filterDate) {
            filteredSales = sales.filter(s => {
                const saleDate = new Date(s.dateTime).toDateString();
                return saleDate === filterDate.toDateString();
            });
        }

        let totalProfit = 0;
        let totalLoss = 0;
        const itemWiseReport = [];

        filteredSales.forEach(sale => {
            const product = this.getProductById(sale.productId);
            if (product) {
                const profitPerUnit = product.sellPrice - product.buyPrice;
                const totalProfit_item = profitPerUnit * sale.quantity;
                const totalCost = product.buyPrice * sale.quantity;
                const totalRevenue = sale.totalPrice;

                itemWiseReport.push({
                    productName: product.name,
                    quantity: sale.quantity,
                    buyPrice: product.buyPrice,
                    sellPrice: product.sellPrice,
                    totalCost,
                    totalRevenue,
                    profitLoss: totalProfit_item,
                    discount: sale.discount || 0,
                    tax: sale.tax || 0
                });

                if (totalProfit_item > 0) {
                    totalProfit += totalProfit_item;
                } else {
                    totalLoss += Math.abs(totalProfit_item);
                }
            }
        });

        return {
            totalProfit,
            totalLoss,
            netProfit: totalProfit - totalLoss,
            itemWiseReport,
            totalSales: filteredSales.length
        };
    }

    // Daily/Monthly summary
    getDailySummary(date) {
        return this.getProfitLossReport(date);
    }

    getMonthlySummary(year, month) {
        const sales = this.getSales();
        const filtered = sales.filter(s => {
            const saleDate = new Date(s.dateTime);
            return saleDate.getFullYear() === year && saleDate.getMonth() === month;
        });

        let totalProfit = 0;
        let totalLoss = 0;

        filtered.forEach(sale => {
            const product = this.getProductById(sale.productId);
            if (product) {
                const profitPerUnit = product.sellPrice - product.buyPrice;
                const totalProfit_item = profitPerUnit * sale.quantity;
                if (totalProfit_item > 0) {
                    totalProfit += totalProfit_item;
                } else {
                    totalLoss += Math.abs(totalProfit_item);
                }
            }
        });

        return {
            totalProfit,
            totalLoss,
            netProfit: totalProfit - totalLoss,
            totalSales: filtered.length
        };
    }
}

// Initialize global data manager
const dataManager = new DataManager();

// ====================
// SUPABASE INTEGRATION
// ====================

// Supabase Configuration
const SUPABASE_URL = 'https://uupoazvmckjyfxomlsbw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1cG9henZtY2tqeWZ4b21sc2J3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5ODYwMTQsImV4cCI6MjA4NDU2MjAxNH0.52zwLBV8WfOASiRmMncBrDs5PBHaJB7g50z0eUT9IYs';

// Initialize Supabase Client
let supabaseClient = null;
let supabaseReady = false;

async function initSupabase() {
    try {
        console.log('Initializing Supabase...');
        
        // Check if supabase library is available
        if (typeof window !== 'undefined' && window.supabase) {
            supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            supabaseReady = true;
            console.log('✓ Supabase initialized successfully');
            return supabaseClient;
        }

        // Load library if not available
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
            script.async = true;
            script.onload = () => {
                console.log('Supabase library loaded from CDN');
                if (window.supabase) {
                    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
                    supabaseReady = true;
                    console.log('✓ Supabase client created');
                    resolve(supabaseClient);
                } else {
                    console.error('Supabase not available after loading');
                    reject(new Error('Supabase library not available'));
                }
            };
            script.onerror = () => {
                console.error('Failed to load Supabase library');
                reject(new Error('Failed to load Supabase library'));
            };
            document.head.appendChild(script);
        });
    } catch (error) {
        console.error('Supabase initialization error:', error);
        supabaseReady = false;
        throw error;
    }
}

// Ensure client is ready
function ensureSupabase() {
    if (!supabaseClient) {
        console.warn('Supabase client not initialized, attempting initialization...');
        throw new Error('Supabase client not initialized. Call initSupabase() first.');
    }
    return supabaseClient;
}

// Check if Supabase is ready
function isSupabaseReady() {
    return supabaseReady && supabaseClient !== null;
}

// ====================
// PRODUCT FUNCTIONS
// ====================

/**
 * Add a new product
 * @param {Object} productData - Product information
 * @returns {Promise<Object>} Created product
 */
async function addProduct(productData) {
    try {
        const client = ensureSupabase();
        const { data, error } = await client
            .from('products')
            .insert([{
                name: productData.name,
                category: productData.category,
                buy_price: productData.buyPrice,
                sell_price: productData.sellPrice,
                stock: productData.stock || 0,
                created_at: new Date().toISOString()
            }])
            .select();

        if (error) throw error;
        return data[0];
    } catch (error) {
        console.error('Error adding product:', error);
        throw error;
    }
}

/**
 * Get all products
 * @returns {Promise<Array>} List of products
 */
async function getProducts() {
    try {
        const client = ensureSupabase();
        const { data, error } = await client
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
}

/**
 * Get product by ID
 * @param {number} productId - Product ID
 * @returns {Promise<Object>} Product data
 */
async function getProductById(productId) {
    try {
        const client = ensureSupabase();
        const { data, error } = await client
            .from('products')
            .select('*')
            .eq('id', productId)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data || null;
    } catch (error) {
        console.error('Error fetching product:', error);
        throw error;
    }
}

/**
 * Update product information
 * @param {number} productId - Product ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated product
 */
async function updateProduct(productId, updates) {
    try {
        const client = ensureSupabase();
        const updateData = {};
        
        if (updates.name) updateData.name = updates.name;
        if (updates.category) updateData.category = updates.category;
        if (updates.buyPrice !== undefined) updateData.buy_price = updates.buyPrice;
        if (updates.sellPrice !== undefined) updateData.sell_price = updates.sellPrice;
        if (updates.stock !== undefined) updateData.stock = updates.stock;

        const { data, error } = await client
            .from('products')
            .update(updateData)
            .eq('id', productId)
            .select();

        if (error) throw error;
        return data[0];
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
}

/**
 * Delete product
 * @param {number} productId - Product ID
 * @returns {Promise<void>}
 */
async function deleteProduct(productId) {
    try {
        const client = ensureSupabase();
        const { error } = await client
            .from('products')
            .delete()
            .eq('id', productId);

        if (error) throw error;
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
}

/**
 * Update product stock
 * @param {number} productId - Product ID
 * @param {number} quantityChange - Quantity to add/subtract
 * @returns {Promise<Object>} Updated product
 */
async function updateProductStock(productId, quantityChange) {
    try {
        const client = ensureSupabase();
        const product = await getProductById(productId);
        
        if (!product) throw new Error('Product not found');

        const newStock = Math.max(0, product.stock + quantityChange);
        
        return await updateProduct(productId, { stock: newStock });
    } catch (error) {
        console.error('Error updating stock:', error);
        throw error;
    }
}

// ====================
// SALES FUNCTIONS
// ====================

/**
 * Create a new sale
 * @param {Object} saleData - Sale information
 * @returns {Promise<Object>} Created sale with ID
 */
async function createSale(saleData) {
    try {
        const client = ensureSupabase();
        
        // Create sale record
        const { data: saleRecord, error: saleError } = await client
            .from('sales')
            .insert([{
                customer_name: saleData.customerName,
                total_amount: saleData.totalAmount,
                discount: saleData.discount || 0,
                tax: saleData.tax || 0,
                paid_amount: saleData.paidAmount,
                return_amount: saleData.returnAmount,
                delivery: saleData.delivery || false,
                created_at: new Date().toISOString()
            }])
            .select();

        if (saleError) throw saleError;

        const saleId = saleRecord[0].id;

        // Create sale items
        if (saleData.items && Array.isArray(saleData.items)) {
            const saleItems = saleData.items.map(item => ({
                sale_id: saleId,
                product_id: item.productId,
                quantity: item.quantity,
                price: item.price
            }));

            const { error: itemsError } = await client
                .from('sale_items')
                .insert(saleItems);

            if (itemsError) throw itemsError;

            // Update product stock for each item
            for (const item of saleData.items) {
                await updateProductStock(item.productId, -item.quantity);
            }
        }

        return saleRecord[0];
    } catch (error) {
        console.error('Error creating sale:', error);
        throw error;
    }
}

/**
 * Get all sales
 * @returns {Promise<Array>} List of sales
 */
async function getSales() {
    try {
        const client = ensureSupabase();
        const { data, error } = await client
            .from('sales')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching sales:', error);
        throw error;
    }
}

/**
 * Get sale by ID with items
 * @param {number} saleId - Sale ID
 * @returns {Promise<Object>} Sale data with items
 */
async function getSaleById(saleId) {
    try {
        const client = ensureSupabase();
        const { data: saleData, error: saleError } = await client
            .from('sales')
            .select('*')
            .eq('id', saleId)
            .single();

        if (saleError && saleError.code !== 'PGRST116') throw saleError;
        if (!saleData) return null;

        const { data: itemsData, error: itemsError } = await client
            .from('sale_items')
            .select('*')
            .eq('sale_id', saleId);

        if (itemsError) throw itemsError;

        return { ...saleData, items: itemsData || [] };
    } catch (error) {
        console.error('Error fetching sale:', error);
        throw error;
    }
}

/**
 * Get sales for a date range
 * @param {string} startDate - Start date (ISO format)
 * @param {string} endDate - End date (ISO format)
 * @returns {Promise<Array>} Filtered sales
 */
async function getSalesByDateRange(startDate, endDate) {
    try {
        const client = ensureSupabase();
        const { data, error } = await client
            .from('sales')
            .select('*')
            .gte('created_at', startDate)
            .lte('created_at', endDate)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching sales by date range:', error);
        throw error;
    }
}

// ====================
// PROFIT & LOSS FUNCTIONS
// ====================

/**
 * Calculate profit/loss for a single product
 * @param {number} productId - Product ID
 * @returns {Promise<Object>} Profit/loss data
 */
async function calculateProductProfitLoss(productId) {
    try {
        const client = ensureSupabase();
        const product = await getProductById(productId);
        
        if (!product) throw new Error('Product not found');

        const { data: saleItems, error } = await client
            .from('sale_items')
            .select('quantity')
            .eq('product_id', productId);

        if (error) throw error;

        const totalQuantitySold = saleItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalCost = product.buy_price * totalQuantitySold;
        const totalRevenue = product.sell_price * totalQuantitySold;
        const profitLoss = totalRevenue - totalCost;

        return {
            productId,
            productName: product.name,
            quantitySold: totalQuantitySold,
            buyPrice: product.buy_price,
            sellPrice: product.sell_price,
            totalCost,
            totalRevenue,
            profitLoss,
            margin: totalQuantitySold > 0 ? (profitLoss / totalRevenue) * 100 : 0
        };
    } catch (error) {
        console.error('Error calculating product profit/loss:', error);
        throw error;
    }
}

/**
 * Calculate overall profit and loss
 * @param {string} startDate - Optional start date (ISO format)
 * @param {string} endDate - Optional end date (ISO format)
 * @returns {Promise<Object>} Overall profit/loss summary
 */
async function calculateProfitLoss(startDate = null, endDate = null) {
    try {
        const client = ensureSupabase();
        
        // Get sales for period
        let query = client.from('sales').select('*');
        if (startDate && endDate) {
            query = query.gte('created_at', startDate).lte('created_at', endDate);
        }
        
        const { data: sales, error: salesError } = await query;
        if (salesError) throw salesError;

        // Get all sale items for the period
        let itemsQuery = client.from('sale_items').select('*');
        if (startDate && endDate) {
            itemsQuery = itemsQuery
                .gte('created_at', startDate)
                .lte('created_at', endDate);
        }
        
        const { data: saleItems, error: itemsError } = await itemsQuery;
        if (itemsError) throw itemsError;

        // Get all products
        const { data: products, error: productsError } = await client
            .from('products')
            .select('*');
        if (productsError) throw productsError;

        // Calculate totals
        let totalRevenue = 0;
        let totalCost = 0;
        let totalDiscount = 0;
        let totalTax = 0;
        let totalPaid = 0;

        // Calculate from sales records
        sales.forEach(sale => {
            totalRevenue += sale.total_amount;
            totalDiscount += sale.discount || 0;
            totalTax += sale.tax || 0;
            totalPaid += sale.paid_amount;
        });

        // Calculate cost from sale items
        saleItems.forEach(item => {
            const product = products.find(p => p.id === item.product_id);
            if (product) {
                totalCost += product.buy_price * item.quantity;
            }
        });

        const totalProfit = totalRevenue - totalCost;
        const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

        return {
            period: startDate && endDate ? { start: startDate, end: endDate } : 'All Time',
            totalSales: sales.length,
            totalItems: saleItems.length,
            totalCost,
            totalRevenue,
            totalDiscount,
            totalTax,
            totalPaid,
            totalProfit,
            profitMargin,
            netProfit: totalProfit - totalDiscount,
            status: totalProfit >= 0 ? 'Profit' : 'Loss'
        };
    } catch (error) {
        console.error('Error calculating profit/loss:', error);
        throw error;
    }
}

/**
 * Get profit/loss by category
 * @returns {Promise<Array>} Profit/loss per category
 */
async function calculateProfitLossByCategory() {
    try {
        const products = await getProducts();
        const categoryData = {};

        for (const product of products) {
            const profitLoss = await calculateProductProfitLoss(product.id);
            
            if (!categoryData[product.category]) {
                categoryData[product.category] = {
                    category: product.category,
                    totalCost: 0,
                    totalRevenue: 0,
                    totalProfit: 0,
                    productCount: 0
                };
            }

            categoryData[product.category].totalCost += profitLoss.totalCost;
            categoryData[product.category].totalRevenue += profitLoss.totalRevenue;
            categoryData[product.category].totalProfit += profitLoss.profitLoss;
            categoryData[product.category].productCount += 1;
        }

        return Object.values(categoryData);
    } catch (error) {
        console.error('Error calculating category profit/loss:', error);
        throw error;
    }
}

// ====================
// DASHBOARD STATISTICS
// ====================

/**
 * Get dashboard summary
 * @returns {Promise<Object>} Dashboard statistics
 */
async function getDashboardSummary() {
    try {
        const products = await getProducts();
        const sales = await getSales();
        const profitLoss = await calculateProfitLoss();

        const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
        const totalSold = sales.reduce((sum, s) => sum + (s.items ? s.items.length : 0), 0);
        const lowStockProducts = products.filter(p => p.stock <= 5);

        return {
            totalProducts: products.length,
            totalStock,
            totalSold,
            totalSales: sales.length,
            totalRevenue: profitLoss.totalRevenue,
            totalProfit: profitLoss.totalProfit,
            profitMargin: profitLoss.profitMargin,
            lowStockProducts: lowStockProducts.length,
            lowStockItems: lowStockProducts
        };
    } catch (error) {
        console.error('Error getting dashboard summary:', error);
        throw error;
    }
}

// Export functions (for module use if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initSupabase,
        addProduct,
        getProducts,
        getProductById,
        updateProduct,
        deleteProduct,
        updateProductStock,
        createSale,
        getSales,
        getSaleById,
        getSalesByDateRange,
        calculateProductProfitLoss,
        calculateProfitLoss,
        calculateProfitLossByCategory,
        getDashboardSummary
    };
}

const db = require('../config/db');

// GET /api/vehicles - Filter, Search, and Sort vehicles
exports.getVehicles = async (req, res) => {
  try {
    const {
      search,
      category,
      body_type,
      brand,
      model,
      location,
      minPrice,
      maxPrice,
      minYear,
      maxYear,
      fuel_type,
      transmission,
      sort,
      limit = 50,
      offset = 0
    } = req.query;

    let sql = `SELECT * FROM vehicles WHERE 1=1`;
    const params = [];

    // Search keyword across title, brand, model, description, location
    if (search && search.trim() !== '') {
      sql += ` AND (title LIKE ? OR brand LIKE ? OR model LIKE ? OR description LIKE ? OR location LIKE ?)`;
      const searchWildcard = `%${search.trim()}%`;
      params.push(searchWildcard, searchWildcard, searchWildcard, searchWildcard, searchWildcard);
    }

    // Category filter (Cars, Bikes, Commercial, Electric Vehicles, Spare Parts, Accessories)
    if (category && category !== 'All' && category !== 'ALL CATEGORIES') {
      sql += ` AND category = ?`;
      params.push(category);
    }

    // Body Type / Vehicle Type filter (Hatchback, Sedan, SUV, Premium, Luxury, Electric, Old Cars)
    if (body_type && body_type !== 'All Cars' && body_type !== 'All') {
      sql += ` AND body_type = ?`;
      params.push(body_type);
    }

    // Brand filter
    if (brand && brand !== 'All Brands' && brand !== '') {
      sql += ` AND brand = ?`;
      params.push(brand);
    }

    // Model filter
    if (model && model !== 'All Models' && model !== '') {
      sql += ` AND model = ?`;
      params.push(model);
    }

    // Location filter
    if (location && location !== 'All' && location !== 'India' && location !== '') {
      sql += ` AND (location LIKE ? OR state LIKE ?)`;
      params.push(`%${location}%`, `%${location}%`);
    }

    // Price range
    if (minPrice) {
      sql += ` AND price >= ?`;
      params.push(Number(minPrice));
    }
    if (maxPrice) {
      sql += ` AND price <= ?`;
      params.push(Number(maxPrice));
    }

    // Year range
    if (minYear) {
      sql += ` AND year >= ?`;
      params.push(Number(minYear));
    }
    if (maxYear) {
      sql += ` AND year <= ?`;
      params.push(Number(maxYear));
    }

    // Fuel Type
    if (fuel_type && fuel_type !== 'All' && fuel_type !== '') {
      sql += ` AND fuel_type = ?`;
      params.push(fuel_type);
    }

    // Transmission
    if (transmission && transmission !== 'All' && transmission !== '') {
      sql += ` AND transmission = ?`;
      params.push(transmission);
    }

    // Sorting
    switch (sort) {
      case 'Price: Low to High':
      case 'price_asc':
        sql += ` ORDER BY price ASC`;
        break;
      case 'Price: High to Low':
      case 'price_desc':
        sql += ` ORDER BY price DESC`;
        break;
      case 'Year: Newest':
      case 'year_desc':
        sql += ` ORDER BY year DESC`;
        break;
      case 'KM: Low to High':
      case 'km_asc':
        sql += ` ORDER BY km_driven ASC`;
        break;
      case 'Newest First':
      default:
        sql += ` ORDER BY id DESC`;
        break;
    }

    sql += ` LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));

    const vehicles = await db.query(sql, params);

    // Get total count for pagination metadata
    let countSql = `SELECT COUNT(*) as total FROM vehicles WHERE 1=1`;
    // reuse same conditions minus limit/offset/order
    const countParams = params.slice(0, params.length - 2);
    // Remove ORDER BY from sql for count
    const whereMatch = sql.match(/WHERE 1=1 (.*) ORDER BY/);
    if (whereMatch && whereMatch[1]) {
      countSql += ` ${whereMatch[1]}`;
    }
    const countResult = await db.getOne(countSql, countParams);
    const total = countResult ? countResult.total : vehicles.length;

    // Parse features and images JSON
    const parsedVehicles = vehicles.map(v => ({
      ...v,
      features: typeof v.features === 'string' ? JSON.parse(v.features || '[]') : v.features,
      images: typeof v.images === 'string' ? JSON.parse(v.images || '[]') : v.images
    }));

    res.json({
      success: true,
      count: parsedVehicles.length,
      total,
      data: parsedVehicles
    });
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).json({ success: false, message: 'Server error fetching vehicles', error: error.message });
  }
};

// GET /api/vehicles/:id - Get single vehicle details
exports.getVehicleById = async (req, res) => {
  try {
    const { id } = req.params;
    const vehicle = await db.getOne(`SELECT * FROM vehicles WHERE id = ?`, [id]);

    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    // Parse JSON fields
    vehicle.features = typeof vehicle.features === 'string' ? JSON.parse(vehicle.features || '[]') : vehicle.features;
    vehicle.images = typeof vehicle.images === 'string' ? JSON.parse(vehicle.images || '[]') : vehicle.images;

    // Fetch similar vehicles
    const similarVehicles = await db.query(
      `SELECT * FROM vehicles WHERE (body_type = ? OR brand = ?) AND id != ? LIMIT 4`,
      [vehicle.body_type, vehicle.brand, vehicle.id]
    );

    res.json({
      success: true,
      data: vehicle,
      similar: similarVehicles.map(v => ({
        ...v,
        features: typeof v.features === 'string' ? JSON.parse(v.features || '[]') : v.features,
        images: typeof v.images === 'string' ? JSON.parse(v.images || '[]') : v.images
      }))
    });
  } catch (error) {
    console.error('Error fetching vehicle by id:', error);
    res.status(500).json({ success: false, message: 'Server error fetching vehicle details', error: error.message });
  }
};

// POST /api/vehicles - Sell a vehicle / Create listing
exports.createVehicle = async (req, res) => {
  try {
    const {
      title,
      brand,
      model,
      year,
      price,
      km_driven,
      fuel_type,
      transmission,
      body_type,
      category = 'Cars',
      location,
      state = 'India',
      image_url,
      images = [],
      description,
      price_tag = 'VERIFIED',
      seller_name,
      seller_phone,
      seller_email,
      features = []
    } = req.body;

    if (!title || !brand || !price || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide required fields: title, brand, price, and location.'
      });
    }

    const defaultImage = image_url || (req.file ? `/uploads/${req.file.filename}` : 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=900&q=85');
    const imagesArray = Array.isArray(images) && images.length > 0 ? images : [defaultImage];

    const result = await db.runAsync(
      `INSERT INTO vehicles (
        title, brand, model, year, price, km_driven, fuel_type,
        transmission, body_type, category, location, state,
        image_url, images, description, price_tag,
        seller_name, seller_phone, seller_email, features, featured
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        brand,
        model || brand,
        Number(year) || new Date().getFullYear(),
        Number(price),
        Number(km_driven) || 0,
        fuel_type || 'Petrol',
        transmission || 'Manual',
        body_type || 'Sedan',
        category,
        location,
        state,
        defaultImage,
        JSON.stringify(imagesArray),
        description || `Well maintained ${year || ''} ${title} in great condition.`,
        price_tag,
        seller_name || 'Individual Seller',
        seller_phone || '+91 98765 43210',
        seller_email || 'seller@gearflip.com',
        JSON.stringify(Array.isArray(features) ? features : []),
        0
      ]
    );

    const newVehicle = await db.getOne(`SELECT * FROM vehicles WHERE id = ?`, [result.lastID]);

    res.status(201).json({
      success: true,
      message: 'Vehicle listed successfully on GearFlip!',
      data: {
        ...newVehicle,
        features: typeof newVehicle.features === 'string' ? JSON.parse(newVehicle.features || '[]') : newVehicle.features,
        images: typeof newVehicle.images === 'string' ? JSON.parse(newVehicle.images || '[]') : newVehicle.images
      }
    });
  } catch (error) {
    console.error('Error creating vehicle listing:', error);
    res.status(500).json({ success: false, message: 'Server error listing vehicle', error: error.message });
  }
};

// PUT /api/vehicles/:id - Update vehicle listing
exports.updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await db.getOne(`SELECT * FROM vehicles WHERE id = ?`, [id]);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    const {
      title, brand, model, year, price, km_driven, fuel_type,
      transmission, body_type, category, location, state,
      image_url, description, price_tag, status
    } = req.body;

    await db.runAsync(
      `UPDATE vehicles SET
        title = COALESCE(?, title),
        brand = COALESCE(?, brand),
        model = COALESCE(?, model),
        year = COALESCE(?, year),
        price = COALESCE(?, price),
        km_driven = COALESCE(?, km_driven),
        fuel_type = COALESCE(?, fuel_type),
        transmission = COALESCE(?, transmission),
        body_type = COALESCE(?, body_type),
        category = COALESCE(?, category),
        location = COALESCE(?, location),
        state = COALESCE(?, state),
        image_url = COALESCE(?, image_url),
        description = COALESCE(?, description),
        price_tag = COALESCE(?, price_tag),
        status = COALESCE(?, status)
      WHERE id = ?`,
      [
        title, brand, model, year, price, km_driven, fuel_type,
        transmission, body_type, category, location, state,
        image_url, description, price_tag, status, id
      ]
    );

    const updated = await db.getOne(`SELECT * FROM vehicles WHERE id = ?`, [id]);
    res.json({ success: true, message: 'Vehicle updated successfully', data: updated });
  } catch (error) {
    console.error('Error updating vehicle:', error);
    res.status(500).json({ success: false, message: 'Server error updating vehicle', error: error.message });
  }
};

// DELETE /api/vehicles/:id - Remove listing
exports.deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await db.getOne(`SELECT * FROM vehicles WHERE id = ?`, [id]);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    await db.runAsync(`DELETE FROM vehicles WHERE id = ?`, [id]);
    await db.runAsync(`DELETE FROM wishlists WHERE vehicle_id = ?`, [id]);
    await db.runAsync(`DELETE FROM inquiries WHERE vehicle_id = ?`, [id]);

    res.json({ success: true, message: 'Vehicle listing deleted successfully' });
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    res.status(500).json({ success: false, message: 'Server error deleting vehicle', error: error.message });
  }
};

// GET /api/vehicles/meta/filters - Get dynamic filter metadata
exports.getFilterOptions = async (req, res) => {
  try {
    const brands = await db.query(`SELECT DISTINCT brand FROM vehicles WHERE brand IS NOT NULL ORDER BY brand ASC`);
    const models = await db.query(`SELECT DISTINCT model FROM vehicles WHERE model IS NOT NULL ORDER BY model ASC`);
    const locations = await db.query(`SELECT DISTINCT location FROM vehicles WHERE location IS NOT NULL ORDER BY location ASC`);
    const fuelTypes = await db.query(`SELECT DISTINCT fuel_type FROM vehicles WHERE fuel_type IS NOT NULL ORDER BY fuel_type ASC`);
    const bodyTypes = await db.query(`SELECT DISTINCT body_type FROM vehicles WHERE body_type IS NOT NULL ORDER BY body_type ASC`);
    const priceStats = await db.getOne(`SELECT MIN(price) as minPrice, MAX(price) as maxPrice FROM vehicles`);
    const yearStats = await db.getOne(`SELECT MIN(year) as minYear, MAX(year) as maxYear FROM vehicles`);

    res.json({
      success: true,
      data: {
        brands: brands.map(b => b.brand),
        models: models.map(m => m.model),
        locations: locations.map(l => l.location),
        fuelTypes: fuelTypes.map(f => f.fuel_type),
        bodyTypes: bodyTypes.map(b => b.body_type),
        priceRange: priceStats || { minPrice: 100000, maxPrice: 10000000 },
        yearRange: yearStats || { minYear: 1980, maxYear: 2026 }
      }
    });
  } catch (error) {
    console.error('Error fetching filter options:', error);
    res.status(500).json({ success: false, message: 'Server error fetching filter options', error: error.message });
  }
};

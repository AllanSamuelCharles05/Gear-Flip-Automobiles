const db = require('../config/db');

// POST /api/wishlist/toggle - Toggle vehicle in wishlist
exports.toggleWishlist = async (req, res) => {
  try {
    const { vehicle_id, user_id, guest_token = 'guest_default' } = req.body;

    if (!vehicle_id) {
      return res.status(400).json({ success: false, message: 'Vehicle ID is required' });
    }

    let existing;
    if (user_id) {
      existing = await db.getOne(
        `SELECT * FROM wishlists WHERE user_id = ? AND vehicle_id = ?`,
        [user_id, vehicle_id]
      );
    } else {
      existing = await db.getOne(
        `SELECT * FROM wishlists WHERE guest_token = ? AND vehicle_id = ?`,
        [guest_token, vehicle_id]
      );
    }

    if (existing) {
      // Remove from wishlist
      await db.runAsync(`DELETE FROM wishlists WHERE id = ?`, [existing.id]);
      return res.json({
        success: true,
        isWishlisted: false,
        message: 'Removed from wishlist'
      });
    } else {
      // Add to wishlist
      await db.runAsync(
        `INSERT INTO wishlists (user_id, guest_token, vehicle_id) VALUES (?, ?, ?)`,
        [user_id || null, guest_token, vehicle_id]
      );
      return res.json({
        success: true,
        isWishlisted: true,
        message: 'Added to wishlist'
      });
    }
  } catch (error) {
    console.error('Wishlist toggle error:', error);
    res.status(500).json({ success: false, message: 'Server error toggling wishlist', error: error.message });
  }
};

// GET /api/wishlist - Get full list of wishlisted vehicles
exports.getWishlist = async (req, res) => {
  try {
    const { user_id, guest_token = 'guest_default' } = req.query;

    let sql = `
      SELECT v.*, w.created_at as wishlisted_at 
      FROM wishlists w 
      JOIN vehicles v ON w.vehicle_id = v.id 
      WHERE 
    `;
    const params = [];

    if (user_id) {
      sql += `w.user_id = ?`;
      params.push(user_id);
    } else {
      sql += `w.guest_token = ?`;
      params.push(guest_token);
    }

    sql += ` ORDER BY w.created_at DESC`;

    const vehicles = await db.query(sql, params);

    const parsed = vehicles.map(v => ({
      ...v,
      features: typeof v.features === 'string' ? JSON.parse(v.features || '[]') : v.features,
      images: typeof v.images === 'string' ? JSON.parse(v.images || '[]') : v.images
    }));

    res.json({
      success: true,
      count: parsed.length,
      data: parsed
    });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ success: false, message: 'Server error fetching wishlist', error: error.message });
  }
};

// GET /api/wishlist/ids - Get simple array of wishlisted vehicle IDs
exports.getWishlistIds = async (req, res) => {
  try {
    const { user_id, guest_token = 'guest_default' } = req.query;
    let sql = `SELECT vehicle_id FROM wishlists WHERE `;
    const params = [];

    if (user_id) {
      sql += `user_id = ?`;
      params.push(user_id);
    } else {
      sql += `guest_token = ?`;
      params.push(guest_token);
    }

    const rows = await db.query(sql, params);
    const ids = rows.map(r => r.vehicle_id);

    res.json({
      success: true,
      ids
    });
  } catch (error) {
    console.error('Error fetching wishlist IDs:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

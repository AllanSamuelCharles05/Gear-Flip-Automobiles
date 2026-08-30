const db = require('../config/db');

// POST /api/inquiries - Submit an inquiry or test drive request
exports.createInquiry = async (req, res) => {
  try {
    const { vehicle_id, user_name, user_email, user_phone, type = 'inquiry', message, preferred_date } = req.body;

    if (!vehicle_id || !user_name || !user_email || !user_phone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide vehicle ID, name, email, and phone number.'
      });
    }

    const vehicle = await db.getOne(`SELECT * FROM vehicles WHERE id = ?`, [vehicle_id]);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    const result = await db.runAsync(
      `INSERT INTO inquiries (vehicle_id, user_name, user_email, user_phone, type, message, preferred_date)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        vehicle_id,
        user_name.trim(),
        user_email.trim(),
        user_phone.trim(),
        type,
        message || (type === 'test_drive' ? 'Test drive requested' : 'Interested in vehicle inquiry'),
        preferred_date || null
      ]
    );

    const inquiry = await db.getOne(`SELECT * FROM inquiries WHERE id = ?`, [result.lastID]);

    res.status(201).json({
      success: true,
      message: type === 'test_drive'
        ? `Test drive request submitted successfully for ${vehicle.title}! The seller will contact you shortly.`
        : `Inquiry sent successfully to ${vehicle.seller_name}!`,
      data: inquiry
    });
  } catch (error) {
    console.error('Error submitting inquiry:', error);
    res.status(500).json({ success: false, message: 'Server error submitting inquiry', error: error.message });
  }
};

// GET /api/inquiries/vehicle/:vehicleId - Get inquiries for a vehicle
exports.getVehicleInquiries = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const inquiries = await db.query(
      `SELECT * FROM inquiries WHERE vehicle_id = ? ORDER BY created_at DESC`,
      [vehicleId]
    );
    res.json({ success: true, count: inquiries.length, data: inquiries });
  } catch (error) {
    console.error('Error getting inquiries:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

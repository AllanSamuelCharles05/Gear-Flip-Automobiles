const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for vehicle image uploads
const uploadDir = path.resolve(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, 'vehicle-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Import controllers
const vehicleController = require('../controllers/vehicleController');
const authController = require('../controllers/authController');
const wishlistController = require('../controllers/wishlistController');
const inquiryController = require('../controllers/inquiryController');

// Vehicle routes
router.get('/vehicles', vehicleController.getVehicles);
router.get('/vehicles/meta/filters', vehicleController.getFilterOptions);
router.get('/vehicles/:id', vehicleController.getVehicleById);
router.post('/vehicles', upload.single('image'), vehicleController.createVehicle);
router.put('/vehicles/:id', vehicleController.updateVehicle);
router.delete('/vehicles/:id', vehicleController.deleteVehicle);

// Auth routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/me', authController.getMe);

// Wishlist routes
router.post('/wishlist/toggle', wishlistController.toggleWishlist);
router.get('/wishlist', wishlistController.getWishlist);
router.get('/wishlist/ids', wishlistController.getWishlistIds);

// Inquiry & Test Drive routes
router.post('/inquiries', inquiryController.createInquiry);
router.get('/inquiries/vehicle/:vehicleId', inquiryController.getVehicleInquiries);

module.exports = router;

const db = require('../config/db');

const initialVehicles = [
  {
    title: 'Maruti Suzuki Baleno Alpha',
    brand: 'Maruti Suzuki',
    model: 'Baleno',
    year: 2022,
    price: 725000,
    km_driven: 32000,
    fuel_type: 'Petrol',
    transmission: 'Manual',
    body_type: 'Hatchback',
    category: 'Cars',
    location: 'Bangalore',
    state: 'Karnataka',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/2022_Maruti_Suzuki_Baleno_Alpha_%28India%29_front_view.jpg/1280px-2022_Maruti_Suzuki_Baleno_Alpha_%28India%29_front_view.jpg',
    images: JSON.stringify([
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/2022_Maruti_Suzuki_Baleno_Alpha_%28India%29_front_view.jpg/1280px-2022_Maruti_Suzuki_Baleno_Alpha_%28India%29_front_view.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/2022_Maruti_Suzuki_Baleno_Alpha_%28India%29_rear_view.jpg/1280px-2022_Maruti_Suzuki_Baleno_Alpha_%28India%29_rear_view.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/2022_Maruti_Suzuki_Baleno_Alpha_%28India%29_interior.jpg/1280px-2022_Maruti_Suzuki_Baleno_Alpha_%28India%29_interior.jpg'
    ]),
    description: 'Single owner, top model Maruti Suzuki Baleno Alpha with SmartPlay Studio touchscreen, push button start, climate control, and comprehensive insurance valid till Nov 2026.',
    price_tag: 'GOOD PRICE',
    seller_name: 'Aditya Rao (Verified)',
    seller_phone: '+91 98450 12345',
    seller_email: 'aditya.rao@gearflip.com',
    features: JSON.stringify(['Touchscreen Display', 'Reverse Camera', 'Push Button Start', 'Alloy Wheels', 'Dual Airbags', 'ABS with EBD']),
    featured: 1
  },
  {
    title: 'Hyundai Creta SX (O) Diesel',
    brand: 'Hyundai',
    model: 'Creta',
    year: 2021,
    price: 1245000,
    km_driven: 28000,
    fuel_type: 'Diesel',
    transmission: 'Automatic',
    body_type: 'SUV',
    category: 'Cars',
    location: 'Pune',
    state: 'Maharashtra',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/2021_Hyundai_Creta_SX%28O%29_CRDi_%28India%29_front_view.jpg/1280px-2021_Hyundai_Creta_SX%28O%29_CRDi_%28India%29_front_view.jpg',
    images: JSON.stringify([
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/2021_Hyundai_Creta_SX%28O%29_CRDi_%28India%29_front_view.jpg/1280px-2021_Hyundai_Creta_SX%28O%29_CRDi_%28India%29_front_view.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/2021_Hyundai_Creta_1.5_Value_%28Chile%29_rear_view.jpg/1280px-2021_Hyundai_Creta_1.5_Value_%28Chile%29_rear_view.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/2021_Hyundai_Creta_1.5_Trend_%28SU2id%2C_Indonesia%29_interior.jpg/1280px-2021_Hyundai_Creta_1.5_Trend_%28SU2id%2C_Indonesia%29_interior.jpg'
    ]),
    description: 'Immaculate condition Creta SX (O) with panoramic sunroof, ventilated front seats, Bose sound system, complete dealer service history.',
    price_tag: 'BEST PRICE',
    seller_name: 'Pooja Deshmukh (Verified)',
    seller_phone: '+91 98220 54321',
    seller_email: 'pooja.deshmukh@gearflip.com',
    features: JSON.stringify(['Panoramic Sunroof', 'Ventilated Seats', 'Bose 8-Speaker Audio', 'Paddle Shifters', 'Wireless Charger']),
    featured: 1
  },
  {
    title: 'Honda City ZX CVT',
    brand: 'Honda',
    model: 'City',
    year: 2020,
    price: 890000,
    km_driven: 40000,
    fuel_type: 'Petrol',
    transmission: 'Automatic',
    body_type: 'Sedan',
    category: 'Cars',
    location: 'Chennai',
    state: 'Tamil Nadu',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Honda_City_2020.jpg/1280px-Honda_City_2020.jpg',
    images: JSON.stringify([
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Honda_City_2020.jpg/1280px-Honda_City_2020.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Honda_City_SV_2020.jpg/1280px-Honda_City_SV_2020.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/2020_Honda_City_V_interior_%28Malaysia%29.png/1280px-2020_Honda_City_V_interior_%28Malaysia%29.png'
    ]),
    description: 'Well-maintained 5th Gen Honda City ZX CVT with LaneWatch camera, LED headlamps, electric sunroof, and plush leather interior.',
    price_tag: 'GOOD PRICE',
    seller_name: 'Suresh Kumar',
    seller_phone: '+91 94440 98765',
    seller_email: 'suresh.k@gearflip.com',
    features: JSON.stringify(['LaneWatch Camera', 'Sunroof', 'Full LED Lights', 'Leather Upholstery', 'Cruise Control']),
    featured: 0
  },
  {
    title: 'Tata Nexon XZ Plus Dark Edition',
    brand: 'Tata',
    model: 'Nexon',
    year: 2022,
    price: 980000,
    km_driven: 22000,
    fuel_type: 'Diesel',
    transmission: 'Manual',
    body_type: 'SUV',
    category: 'Cars',
    location: 'Hyderabad',
    state: 'Telangana',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/2023_Tata_Nexon_XZA%2B_front_view.jpg/1280px-2023_Tata_Nexon_XZA%2B_front_view.jpg',
    images: JSON.stringify([
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/2023_Tata_Nexon_XZA%2B_front_view.jpg/1280px-2023_Tata_Nexon_XZA%2B_front_view.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Tata_Nexon_Blue_Dual_Tone.jpg/1280px-Tata_Nexon_Blue_Dual_Tone.jpg'
    ]),
    description: '5-star GNCAP safety rated Tata Nexon Dark Edition. Pristine condition with Harman sound system, iRA connected car technology, and rear AC vents.',
    price_tag: 'BEST PRICE',
    seller_name: 'Raghavendra Reddy (Verified)',
    seller_phone: '+91 99890 11223',
    seller_email: 'raghav.reddy@gearflip.com',
    features: JSON.stringify(['5-Star Safety', 'Harman Sound System', 'Connected Car Tech', 'Dark Edition Styling', 'Driving Modes']),
    featured: 1
  },
  {
    title: 'BMW 3 Series 330i M Sport',
    brand: 'BMW',
    model: '3 Series',
    year: 2021,
    price: 3850000,
    km_driven: 19500,
    fuel_type: 'Petrol',
    transmission: 'Automatic',
    body_type: 'Luxury',
    category: 'Cars',
    location: 'Mumbai',
    state: 'Maharashtra',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/BMW_330i_%28G20%29_Washington_DC_Metro_Area%2C_USA.jpg/1280px-BMW_330i_%28G20%29_Washington_DC_Metro_Area%2C_USA.jpg',
    images: JSON.stringify([
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/BMW_330i_%28G20%29_Washington_DC_Metro_Area%2C_USA.jpg/1280px-BMW_330i_%28G20%29_Washington_DC_Metro_Area%2C_USA.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/BMW_330i_%28G20%29_Washington_DC_Metro_Area%2C_USA_%283%29.jpg/1280px-BMW_330i_%28G20%29_Washington_DC_Metro_Area%2C_USA_%283%29.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/BMW_330i_%28G20%29_Washington_DC_Metro_Area%2C_USA_%284%29.jpg/1280px-BMW_330i_%28G20%29_Washington_DC_Metro_Area%2C_USA_%284%29.jpg'
    ]),
    description: 'Certified pre-owned BMW 330i M Sport with 258 BHP twin-turbo engine, Live Cockpit Professional, heads-up display, and ambient lighting.',
    price_tag: 'FEATURED',
    seller_name: 'Apex Luxury Wheels (Dealer)',
    seller_phone: '+91 98200 44556',
    seller_email: 'sales@apexluxury.com',
    features: JSON.stringify(['Heads-Up Display', 'M Sport Aerodynamics', 'Harman Kardon Audio', 'Wireless Apple CarPlay', 'Park Assist']),
    featured: 1
  },
  {
    title: 'Mercedes-Benz C-Class C200',
    brand: 'Mercedes-Benz',
    model: 'C-Class',
    year: 2020,
    price: 3490000,
    km_driven: 26000,
    fuel_type: 'Petrol',
    transmission: 'Automatic',
    body_type: 'Luxury',
    category: 'Cars',
    location: 'Delhi',
    state: 'Delhi NCR',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Mercedes-Benz_C200_AVANTGARDE_%28W205%29_front.JPG/1280px-Mercedes-Benz_C200_AVANTGARDE_%28W205%29_front.JPG',
    images: JSON.stringify([
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Mercedes-Benz_C200_AVANTGARDE_%28W205%29_front.JPG/1280px-Mercedes-Benz_C200_AVANTGARDE_%28W205%29_front.JPG',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Mercedes-Benz_C200_AVANTGARDE_%28W205%29_rear.JPG/1280px-Mercedes-Benz_C200_AVANTGARDE_%28W205%29_rear.JPG',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Mercedes-Benz_C200_W205_Avantgarde_interior.jpg/1280px-Mercedes-Benz_C200_W205_Avantgarde_interior.jpg'
    ]),
    description: 'Single corporate owner Mercedes C200 with panoramic dual sunroof, 64-color ambient lighting, Active Parking Assist, and mint interior.',
    price_tag: 'TOP DEAL',
    seller_name: 'Vikas Malhotra (Verified)',
    seller_phone: '+91 98110 33445',
    seller_email: 'vikas.m@gearflip.com',
    features: JSON.stringify(['64-Color Ambient Light', 'Dual Panoramic Sunroof', 'MBUX Infotainment', 'Memory Seats', 'Active Brake Assist']),
    featured: 1
  },
  {
    title: 'Tata Nexon EV Max XZ+ Lux',
    brand: 'Tata',
    model: 'Nexon EV',
    year: 2023,
    price: 1420000,
    km_driven: 14000,
    fuel_type: 'Electric',
    transmission: 'Automatic',
    body_type: 'Electric',
    category: 'Electric Vehicles',
    location: 'Bangalore',
    state: 'Karnataka',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/2020_Tata_Nexon_EV_%28India%29_front_view.png/1280px-2020_Tata_Nexon_EV_%28India%29_front_view.png',
    images: JSON.stringify([
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/2020_Tata_Nexon_EV_%28India%29_front_view.png/1280px-2020_Tata_Nexon_EV_%28India%29_front_view.png',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Tata_Nexon_EV_in_Hyderabad_02.jpg/1280px-Tata_Nexon_EV_in_Hyderabad_02.jpg'
    ]),
    description: '437 km range Tata Nexon EV Max with 40.5 kWh battery pack, fast charging support (7.2kW AC home box included), ventilated front seats, and 8-year battery warranty.',
    price_tag: 'BEST PRICE',
    seller_name: 'Naveen Kumar',
    seller_phone: '+91 97400 66778',
    seller_email: 'naveen.k@gearflip.com',
    features: JSON.stringify(['437km ARAI Range', '7.2kW Fast Charger Included', 'Electronic Parking Brake', 'Wireless Charger', 'Regen Modes']),
    featured: 1
  },
  {
    title: 'Mahindra Thar LX Hard Top 4x4',
    brand: 'Mahindra',
    model: 'Thar',
    year: 2022,
    price: 1580000,
    km_driven: 21000,
    fuel_type: 'Diesel',
    transmission: 'Automatic',
    body_type: 'SUV',
    category: 'Cars',
    location: 'Pune',
    state: 'Maharashtra',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Mahindra_Thar_SUV_in_%22Red_Rage%22_color_at_Ashiana_Brahmanda%2C_East_Singbhum_India_%28Ank_Kumar%2C_Infosys_limited%29_01.jpg/1280px-Mahindra_Thar_SUV_in_%22Red_Rage%22_color_at_Ashiana_Brahmanda%2C_East_Singbhum_India_%28Ank_Kumar%2C_Infosys_limited%29_01.jpg',
    images: JSON.stringify([
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Mahindra_Thar_SUV_in_%22Red_Rage%22_color_at_Ashiana_Brahmanda%2C_East_Singbhum_India_%28Ank_Kumar%2C_Infosys_limited%29_01.jpg/1280px-Mahindra_Thar_SUV_in_%22Red_Rage%22_color_at_Ashiana_Brahmanda%2C_East_Singbhum_India_%28Ank_Kumar%2C_Infosys_limited%29_01.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Mahindra_Thar_SUV_in_%22Red_Rage%22_color_at_Ashiana_Brahmanda%2C_East_Singbhum_India_%28Ank_Kumar%2C_Infosys_limited%29_02.jpg/1280px-Mahindra_Thar_SUV_in_%22Red_Rage%22_color_at_Ashiana_Brahmanda%2C_East_Singbhum_India_%28Ank_Kumar%2C_Infosys_limited%29_02.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mahindra_Thar_ROXX_on_dirt.jpg/1280px-Mahindra_Thar_ROXX_on_dirt.jpg'
    ]),
    description: 'Off-road ready Mahindra Thar 4x4 with factory hard top, mechanical locking differential, all-terrain tires, touch infotainment, and roll cage.',
    price_tag: 'GOOD PRICE',
    seller_name: 'Rohit Kadam (Verified)',
    seller_phone: '+91 98900 88990',
    seller_email: 'rohit.kadam@gearflip.com',
    features: JSON.stringify(['4x4 Shift-on-Fly', 'Mechanical Locking Diff', 'Factory Hard Top', 'Adventure Stats Display', 'Roll Cage']),
    featured: 0
  },
  {
    title: 'Kia Seltos GTX Plus 1.4 Turbo',
    brand: 'Kia',
    model: 'Seltos',
    year: 2021,
    price: 1390000,
    km_driven: 31000,
    fuel_type: 'Petrol',
    transmission: 'Automatic',
    body_type: 'SUV',
    category: 'Cars',
    location: 'Hyderabad',
    state: 'Telangana',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/White_KIA_Seltos_%28Front%29.jpg/1280px-White_KIA_Seltos_%28Front%29.jpg',
    images: JSON.stringify([
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/White_KIA_Seltos_%28Front%29.jpg/1280px-White_KIA_Seltos_%28Front%29.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/White_KIA_Seltos_%28Side%29.jpg/1280px-White_KIA_Seltos_%28Side%29.jpg'
    ]),
    description: 'Feature-loaded Kia Seltos GTX+ with 10.25 inch touchscreen, UVO connected car features, 360-degree camera, heads-up display, and ventilated seats.',
    price_tag: 'GOOD PRICE',
    seller_name: 'Deepak Varma',
    seller_phone: '+91 98480 33221',
    seller_email: 'deepak.v@gearflip.com',
    features: JSON.stringify(['360 Camera', 'Heads Up Display', 'Bose Audio', 'Air Purifier', 'Blind View Monitor']),
    featured: 0
  },
  {
    title: 'Volkswagen Polo GT TSI',
    brand: 'Volkswagen',
    model: 'Polo',
    year: 2019,
    price: 680000,
    km_driven: 45000,
    fuel_type: 'Petrol',
    transmission: 'Automatic',
    body_type: 'Hatchback',
    category: 'Cars',
    location: 'Bangalore',
    state: 'Karnataka',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/2020_Volkswagen_Polo_GT_TSI_%28India%29_front_view.png/1280px-2020_Volkswagen_Polo_GT_TSI_%28India%29_front_view.png',
    images: JSON.stringify([
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/2020_Volkswagen_Polo_GT_TSI_%28India%29_front_view.png/1280px-2020_Volkswagen_Polo_GT_TSI_%28India%29_front_view.png',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Volkswagen_Polo_GT_TSI_in_rain_on_an_Indian_street.jpg/1280px-Volkswagen_Polo_GT_TSI_in_rain_on_an_Indian_street.jpg'
    ]),
    description: 'Enthusiast-driven Polo GT TSI with 1.2 TSI Turbo engine, DSG gearbox, steering paddle shifters, stage 1 tune, and Brembo brake pads.',
    price_tag: 'HOT DEAL',
    seller_name: 'Karthik S (Verified)',
    seller_phone: '+91 99000 55443',
    seller_email: 'karthik.s@gearflip.com',
    features: JSON.stringify(['DSG Automatic', 'Paddle Shifters', 'ESP Stability Control', 'Touchscreen Infotainment', 'Alloy Wheels']),
    featured: 0
  },
  {
    title: 'Vintage Ambassador Mark 4 (Classic 1988)',
    brand: 'Hindustan Motors',
    model: 'Ambassador',
    year: 1988,
    price: 320000,
    km_driven: 78000,
    fuel_type: 'Petrol',
    transmission: 'Manual',
    body_type: 'Old Cars',
    category: 'Cars',
    location: 'Chennai',
    state: 'Tamil Nadu',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/The_Classic_Ambassador_on_an_early_sunrise.jpg/1280px-The_Classic_Ambassador_on_an_early_sunrise.jpg',
    images: JSON.stringify([
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/The_Classic_Ambassador_on_an_early_sunrise.jpg/1280px-The_Classic_Ambassador_on_an_early_sunrise.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Hindustan_Ambassador%2C_City_Palace%2C_Jaipur%2C_20191218_0937_9034.jpg/1280px-Hindustan_Ambassador%2C_City_Palace%2C_Jaipur%2C_20191218_0937_9034.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Hindustan_Ambassador%2C_Cochin_%28Rob_Oo%29.jpg/1280px-Hindustan_Ambassador%2C_Cochin_%28Rob_Oo%29.jpg'
    ]),
    description: 'Collector-grade 1988 Hindustan Motors Ambassador Mark 4. Fully restored original engine, chrome bumpers, retro round headlamps, and authentic leather seating.',
    price_tag: 'COLLECTOR',
    seller_name: 'Vintage Motors Heritage Club',
    seller_phone: '+91 94444 88776',
    seller_email: 'heritage@vintagemotors.in',
    features: JSON.stringify(['Original Restored Engine', 'Chrome Trim', 'Vintage Bench Seats', 'FC Valid till 2028', 'Collector Number Plate']),
    featured: 1
  },
  {
    title: 'Royal Enfield Classic 350 Reborn',
    brand: 'Royal Enfield',
    model: 'Classic 350',
    year: 2022,
    price: 185000,
    km_driven: 9500,
    fuel_type: 'Petrol',
    transmission: 'Manual',
    body_type: 'Bikes',
    category: 'Bikes',
    location: 'Bangalore',
    state: 'Karnataka',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Royal_Enfield_Classic_350_SideView.JPG/1280px-Royal_Enfield_Classic_350_SideView.JPG',
    images: JSON.stringify([
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Royal_Enfield_Classic_350_SideView.JPG/1280px-Royal_Enfield_Classic_350_SideView.JPG',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Royal_Enfield_Classic_350.jpg/1280px-Royal_Enfield_Classic_350.jpg'
    ]),
    description: 'Royal Enfield Classic 350 Stealth Black dual-channel ABS with Tripper navigation, alloy wheels, and touring seat.',
    price_tag: 'BEST PRICE',
    seller_name: 'Pradeep Gowda',
    seller_phone: '+91 98800 77665',
    seller_email: 'pradeep.g@gearflip.com',
    features: JSON.stringify(['Dual Channel ABS', 'Tripper Navigation', 'Tubeless Alloy Wheels', 'Engine Guard']),
    featured: 0
  },
  {
    title: 'Ather 450X Gen 3 Pro Electric Scooter',
    brand: 'Ather Energy',
    model: '450X',
    year: 2023,
    price: 115000,
    km_driven: 6200,
    fuel_type: 'Electric',
    transmission: 'Automatic',
    body_type: 'Electric',
    category: 'Electric Vehicles',
    location: 'Pune',
    state: 'Maharashtra',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/OLA_S1_Pro_Gen_1_Electric_Scooter.jpg/1280px-OLA_S1_Pro_Gen_1_Electric_Scooter.jpg',
    images: JSON.stringify([
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/OLA_S1_Pro_Gen_1_Electric_Scooter.jpg/1280px-OLA_S1_Pro_Gen_1_Electric_Scooter.jpg'
    ]),
    description: 'High-performance Ather 450X Gen 3 with Warp mode, touchscreen dashboard with Google Maps navigation, auto-hold, and Ather Grid free fast charging subscription.',
    price_tag: 'GOOD PRICE',
    seller_name: 'Shreyas Joshi',
    seller_phone: '+91 98233 44112',
    seller_email: 'shreyas.j@gearflip.com',
    features: JSON.stringify(['Warp Mode (0-40 in 3.3s)', 'Google Maps on Dashboard', 'Auto Hold Hill Assist', 'Fast Charging Compatible']),
    featured: 0
  },
  {
    title: 'Tata Ace Gold Petrol Plus (Commercial Mini Truck)',
    brand: 'Tata',
    model: 'Ace Gold',
    year: 2021,
    price: 360000,
    km_driven: 42000,
    fuel_type: 'Petrol',
    transmission: 'Manual',
    body_type: 'Commercial',
    category: 'Commercial',
    location: 'Mumbai',
    state: 'Maharashtra',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Tata_Ace_Mini_Truck_%281%29.JPG/1280px-Tata_Ace_Mini_Truck_%281%29.JPG',
    images: JSON.stringify([
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Tata_Ace_Mini_Truck_%281%29.JPG/1280px-Tata_Ace_Mini_Truck_%281%29.JPG',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Tata_Ace_Mini_Truck_%282%29.JPG/1280px-Tata_Ace_Mini_Truck_%282%29.JPG',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Tata_Ace_mini-truck%2C_Bangladesh._%2842117794930%29.jpg/1280px-Tata_Ace_mini-truck%2C_Bangladesh._%2842117794930%29.jpg'
    ]),
    description: 'Chhota Hathi Tata Ace Gold Mini truck in top running condition. Heavy-duty leaf springs, mileage certified, commercial permit valid across Maharashtra.',
    price_tag: 'BUSINESS READY',
    seller_name: 'Shree Ganesh Logistics (Dealer)',
    seller_phone: '+91 98211 99887',
    seller_email: 'logistics@shreeganesh.com',
    features: JSON.stringify(['750kg Payload Capacity', 'Eco Switch for High Mileage', 'Digital Cluster', 'Valid Commercial Fitness Certificate']),
    featured: 0
  },
  {
    title: 'Audi A6 45 TFSI Technology',
    brand: 'Audi',
    model: 'A6',
    year: 2022,
    price: 4650000,
    km_driven: 16000,
    fuel_type: 'Petrol',
    transmission: 'Automatic',
    body_type: 'Premium',
    category: 'Cars',
    location: 'Delhi',
    state: 'Delhi NCR',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/2021_Audi_A6.jpg/1280px-2021_Audi_A6.jpg',
    images: JSON.stringify([
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/2021_Audi_A6.jpg/1280px-2021_Audi_A6.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/00_audi_a6_2.jpg/1280px-00_audi_a6_2.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/00_audi_a6_1.jpg/1280px-00_audi_a6_1.jpg'
    ]),
    description: 'Flagship executive sedan Audi A6 Technology with Matrix LED headlamps, virtual cockpit, Bang & Olufsen 3D sound, dual MMI touchscreens, and 4-zone climate control.',
    price_tag: 'PREMIUM CHOICE',
    seller_name: 'Royal Auto Collection (Dealer)',
    seller_phone: '+91 98100 77112',
    seller_email: 'contact@royalauto.in',
    features: JSON.stringify(['Matrix LED Headlights', 'Virtual Cockpit Plus', 'Bang & Olufsen 3D Sound', '4-Zone Deluxe AC', 'Lane Departure Warning']),
    featured: 1
  },
  {
    title: 'Genuine Brembo Brake Disc Kit (Brembo High Carbon)',
    brand: 'Brembo',
    model: 'High Carbon Kit',
    year: 2024,
    price: 18500,
    km_driven: 0,
    fuel_type: 'Petrol',
    transmission: 'Manual',
    body_type: 'Spare Parts',
    category: 'Spare Parts',
    location: 'Bangalore',
    state: 'Karnataka',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Brembo_Disc_brake.jpg/1280px-Brembo_Disc_brake.jpg',
    images: JSON.stringify([
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Brembo_Disc_brake.jpg/1280px-Brembo_Disc_brake.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Brembo_Brakes.jpg/1280px-Brembo_Brakes.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Brembo_brake_%26_ENKEI_TarmacEVO_wheel.jpg/1280px-Brembo_brake_%26_ENKEI_TarmacEVO_wheel.jpg'
    ]),
    description: 'Brand new, sealed pair of Brembo High-Carbon vented front brake rotors. Compatible with Honda City, Civic, Hyundai Creta, and Verna.',
    price_tag: 'GENUINE PART',
    seller_name: 'Apex Performance Auto Parts',
    seller_phone: '+91 98450 77889',
    seller_email: 'parts@apexperformance.in',
    features: JSON.stringify(['100% Genuine Imported', 'High Thermal Dissipation', 'Anti-Corrosion UV Coating', '1 Year Warranty']),
    featured: 0
  }
];

const seed = async () => {
  try {
    const existing = await db.query('SELECT COUNT(*) as count FROM vehicles');
    if (existing && existing[0] && existing[0].count > 0) {
      console.log(`ℹ️ Database already has ${existing[0].count} vehicles. Updating / Skipping seed.`);
      return;
    }

    console.log('🌱 Seeding vehicle listings into database...');
    for (const v of initialVehicles) {
      await db.runAsync(
        `INSERT INTO vehicles (
          title, brand, model, year, price, km_driven, fuel_type,
          transmission, body_type, category, location, state,
          image_url, images, description, price_tag,
          seller_name, seller_phone, seller_email, features, featured
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          v.title, v.brand, v.model, v.year, v.price, v.km_driven, v.fuel_type,
          v.transmission, v.body_type, v.category, v.location, v.state,
          v.image_url, v.images, v.description, v.price_tag,
          v.seller_name, v.seller_phone, v.seller_email, v.features, v.featured
        ]
      );
    }
    console.log(` Successfully seeded ${initialVehicles.length} vehicles.`);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
  }
};

if (require.main === module) {
  setTimeout(() => {
    seed().then(() => {
      console.log('✨ Seed complete.');
      process.exit(0);
    });
  }, 500);
}

module.exports = { seed, initialVehicles };

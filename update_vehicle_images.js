const db = require('../config/db');

const vehicleImages = [
  {
    model: 'Baleno',
    title: 'Maruti Suzuki Baleno Alpha',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/2022_Maruti_Suzuki_Baleno_Alpha_%28India%29_front_view.jpg/1280px-2022_Maruti_Suzuki_Baleno_Alpha_%28India%29_front_view.jpg',
    images: JSON.stringify([
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/2022_Maruti_Suzuki_Baleno_Alpha_%28India%29_front_view.jpg/1280px-2022_Maruti_Suzuki_Baleno_Alpha_%28India%29_front_view.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/2022_Maruti_Suzuki_Baleno_Alpha_%28India%29_rear_view.jpg/1280px-2022_Maruti_Suzuki_Baleno_Alpha_%28India%29_rear_view.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/2022_Maruti_Suzuki_Baleno_Alpha_%28India%29_interior.jpg/1280px-2022_Maruti_Suzuki_Baleno_Alpha_%28India%29_interior.jpg'
    ])
  },
  {
    model: 'Creta',
    title: 'Hyundai Creta SX (O) Diesel',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/2021_Hyundai_Creta_SX%28O%29_CRDi_%28India%29_front_view.jpg/1280px-2021_Hyundai_Creta_SX%28O%29_CRDi_%28India%29_front_view.jpg',
    images: JSON.stringify([
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/2021_Hyundai_Creta_SX%28O%29_CRDi_%28India%29_front_view.jpg/1280px-2021_Hyundai_Creta_SX%28O%29_CRDi_%28India%29_front_view.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/2021_Hyundai_Creta_1.5_Value_%28Chile%29_rear_view.jpg/1280px-2021_Hyundai_Creta_1.5_Value_%28Chile%29_rear_view.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/2021_Hyundai_Creta_1.5_Trend_%28SU2id%2C_Indonesia%29_interior.jpg/1280px-2021_Hyundai_Creta_1.5_Trend_%28SU2id%2C_Indonesia%29_interior.jpg'
    ])
  },
  {
    model: 'City',
    title: 'Honda City ZX CVT',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Honda_City_2020.jpg/1280px-Honda_City_2020.jpg',
    images: JSON.stringify([
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Honda_City_2020.jpg/1280px-Honda_City_2020.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Honda_City_SV_2020.jpg/1280px-Honda_City_SV_2020.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/2020_Honda_City_V_interior_%28Malaysia%29.png/1280px-2020_Honda_City_V_interior_%28Malaysia%29.png'
    ])
  },
  {
    model: 'Nexon',
    title: 'Tata Nexon XZ Plus Dark Edition',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/2023_Tata_Nexon_XZA%2B_front_view.jpg/1280px-2023_Tata_Nexon_XZA%2B_front_view.jpg',
    images: JSON.stringify([
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/2023_Tata_Nexon_XZA%2B_front_view.jpg/1280px-2023_Tata_Nexon_XZA%2B_front_view.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Tata_Nexon_Blue_Dual_Tone.jpg/1280px-Tata_Nexon_Blue_Dual_Tone.jpg'
    ])
  },
  {
    model: '3 Series',
    title: 'BMW 3 Series 330i M Sport',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/BMW_330i_%28G20%29_Washington_DC_Metro_Area%2C_USA.jpg/1280px-BMW_330i_%28G20%29_Washington_DC_Metro_Area%2C_USA.jpg',
    images: JSON.stringify([
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/BMW_330i_%28G20%29_Washington_DC_Metro_Area%2C_USA.jpg/1280px-BMW_330i_%28G20%29_Washington_DC_Metro_Area%2C_USA.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/BMW_330i_%28G20%29_Washington_DC_Metro_Area%2C_USA_%283%29.jpg/1280px-BMW_330i_%28G20%29_Washington_DC_Metro_Area%2C_USA_%283%29.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/BMW_330i_%28G20%29_Washington_DC_Metro_Area%2C_USA_%284%29.jpg/1280px-BMW_330i_%28G20%29_Washington_DC_Metro_Area%2C_USA_%284%29.jpg'
    ])
  },
  {
    model: 'C-Class',
    title: 'Mercedes-Benz C-Class C200',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Mercedes-Benz_C200_AVANTGARDE_%28W205%29_front.JPG/1280px-Mercedes-Benz_C200_AVANTGARDE_%28W205%29_front.JPG',
    images: JSON.stringify([
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Mercedes-Benz_C200_AVANTGARDE_%28W205%29_front.JPG/1280px-Mercedes-Benz_C200_AVANTGARDE_%28W205%29_front.JPG',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Mercedes-Benz_C200_AVANTGARDE_%28W205%29_rear.JPG/1280px-Mercedes-Benz_C200_AVANTGARDE_%28W205%29_rear.JPG',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Mercedes-Benz_C200_W205_Avantgarde_interior.jpg/1280px-Mercedes-Benz_C200_W205_Avantgarde_interior.jpg'
    ])
  },
  {
    model: 'Nexon EV',
    title: 'Tata Nexon EV Max XZ+ Lux',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/2020_Tata_Nexon_EV_%28India%29_front_view.png/1280px-2020_Tata_Nexon_EV_%28India%29_front_view.png',
    images: JSON.stringify([
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/2020_Tata_Nexon_EV_%28India%29_front_view.png/1280px-2020_Tata_Nexon_EV_%28India%29_front_view.png',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Tata_Nexon_EV_in_Hyderabad_02.jpg/1280px-Tata_Nexon_EV_in_Hyderabad_02.jpg'
    ])
  },
  {
    model: 'Thar',
    title: 'Mahindra Thar LX Hard Top 4x4',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Mahindra_Thar_SUV_in_%22Red_Rage%22_color_at_Ashiana_Brahmanda%2C_East_Singbhum_India_%28Ank_Kumar%2C_Infosys_limited%29_01.jpg/1280px-Mahindra_Thar_SUV_in_%22Red_Rage%22_color_at_Ashiana_Brahmanda%2C_East_Singbhum_India_%28Ank_Kumar%2C_Infosys_limited%29_01.jpg',
    images: JSON.stringify([
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Mahindra_Thar_SUV_in_%22Red_Rage%22_color_at_Ashiana_Brahmanda%2C_East_Singbhum_India_%28Ank_Kumar%2C_Infosys_limited%29_01.jpg/1280px-Mahindra_Thar_SUV_in_%22Red_Rage%22_color_at_Ashiana_Brahmanda%2C_East_Singbhum_India_%28Ank_Kumar%2C_Infosys_limited%29_01.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Mahindra_Thar_SUV_in_%22Red_Rage%22_color_at_Ashiana_Brahmanda%2C_East_Singbhum_India_%28Ank_Kumar%2C_Infosys_limited%29_02.jpg/1280px-Mahindra_Thar_SUV_in_%22Red_Rage%22_color_at_Ashiana_Brahmanda%2C_East_Singbhum_India_%28Ank_Kumar%2C_Infosys_limited%29_02.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mahindra_Thar_ROXX_on_dirt.jpg/1280px-Mahindra_Thar_ROXX_on_dirt.jpg'
    ])
  },
  {
    model: 'Seltos',
    title: 'Kia Seltos GTX Plus 1.4 Turbo',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/White_KIA_Seltos_%28Front%29.jpg/1280px-White_KIA_Seltos_%28Front%29.jpg',
    images: JSON.stringify([
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/White_KIA_Seltos_%28Front%29.jpg/1280px-White_KIA_Seltos_%28Front%29.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/White_KIA_Seltos_%28Side%29.jpg/1280px-White_KIA_Seltos_%28Side%29.jpg'
    ])
  },
  {
    model: 'Polo',
    title: 'Volkswagen Polo GT TSI',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/2020_Volkswagen_Polo_GT_TSI_%28India%29_front_view.png/1280px-2020_Volkswagen_Polo_GT_TSI_%28India%29_front_view.png',
    images: JSON.stringify([
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/2020_Volkswagen_Polo_GT_TSI_%28India%29_front_view.png/1280px-2020_Volkswagen_Polo_GT_TSI_%28India%29_front_view.png',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Volkswagen_Polo_GT_TSI_in_rain_on_an_Indian_street.jpg/1280px-Volkswagen_Polo_GT_TSI_in_rain_on_an_Indian_street.jpg'
    ])
  },
  {
    model: 'Ambassador',
    title: 'Vintage Ambassador Mark 4 (Classic 1988)',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/The_Classic_Ambassador_on_an_early_sunrise.jpg/1280px-The_Classic_Ambassador_on_an_early_sunrise.jpg',
    images: JSON.stringify([
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/The_Classic_Ambassador_on_an_early_sunrise.jpg/1280px-The_Classic_Ambassador_on_an_early_sunrise.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Hindustan_Ambassador%2C_City_Palace%2C_Jaipur%2C_20191218_0937_9034.jpg/1280px-Hindustan_Ambassador%2C_City_Palace%2C_Jaipur%2C_20191218_0937_9034.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Hindustan_Ambassador%2C_Cochin_%28Rob_Oo%29.jpg/1280px-Hindustan_Ambassador%2C_Cochin_%28Rob_Oo%29.jpg'
    ])
  },
  {
    model: 'Classic 350',
    title: 'Royal Enfield Classic 350 Reborn',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Royal_Enfield_Classic_350_SideView.JPG/1280px-Royal_Enfield_Classic_350_SideView.JPG',
    images: JSON.stringify([
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Royal_Enfield_Classic_350_SideView.JPG/1280px-Royal_Enfield_Classic_350_SideView.JPG',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Royal_Enfield_Classic_350.jpg/1280px-Royal_Enfield_Classic_350.jpg'
    ])
  },
  {
    model: '450X',
    title: 'Ather 450X Gen 3 Pro Electric Scooter',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/OLA_S1_Pro_Gen_1_Electric_Scooter.jpg/1280px-OLA_S1_Pro_Gen_1_Electric_Scooter.jpg',
    images: JSON.stringify([
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/OLA_S1_Pro_Gen_1_Electric_Scooter.jpg/1280px-OLA_S1_Pro_Gen_1_Electric_Scooter.jpg'
    ])
  },
  {
    model: 'Ace Gold',
    title: 'Tata Ace Gold Petrol Plus (Commercial Mini Truck)',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Tata_Ace_Mini_Truck_%281%29.JPG/1280px-Tata_Ace_Mini_Truck_%281%29.JPG',
    images: JSON.stringify([
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Tata_Ace_Mini_Truck_%281%29.JPG/1280px-Tata_Ace_Mini_Truck_%281%29.JPG',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Tata_Ace_Mini_Truck_%282%29.JPG/1280px-Tata_Ace_Mini_Truck_%282%29.JPG',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Tata_Ace_mini-truck%2C_Bangladesh._%2842117794930%29.jpg/1280px-Tata_Ace_mini-truck%2C_Bangladesh._%2842117794930%29.jpg'
    ])
  },
  {
    model: 'A6',
    title: 'Audi A6 45 TFSI Technology',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/2021_Audi_A6.jpg/1280px-2021_Audi_A6.jpg',
    images: JSON.stringify([
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/2021_Audi_A6.jpg/1280px-2021_Audi_A6.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/00_audi_a6_2.jpg/1280px-00_audi_a6_2.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/00_audi_a6_1.jpg/1280px-00_audi_a6_1.jpg'
    ])
  },
  {
    model: 'High Carbon Kit',
    title: 'Genuine Brembo Brake Disc Kit (Brembo High Carbon)',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Brembo_Disc_brake.jpg/1280px-Brembo_Disc_brake.jpg',
    images: JSON.stringify([
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Brembo_Disc_brake.jpg/1280px-Brembo_Disc_brake.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Brembo_Brakes.jpg/1280px-Brembo_Brakes.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Brembo_brake_%26_ENKEI_TarmacEVO_wheel.jpg/1280px-Brembo_brake_%26_ENKEI_TarmacEVO_wheel.jpg'
    ])
  }
];

async function updateDb() {
  await db.initSchema();
  for (const v of vehicleImages) {
    await db.runAsync(
      `UPDATE vehicles SET image_url = ?, images = ? WHERE model = ? OR title LIKE ?`,
      [v.image_url, v.images, v.model, `%${v.model}%`]
    );
    console.log(`Updated images for: ${v.title}`);
  }
  console.log('✨ All vehicle images updated successfully in database!');
  process.exit(0);
}

updateDb();

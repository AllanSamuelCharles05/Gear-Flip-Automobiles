# Database Design – Used Vehicle Trading Platform

## 1. Overview

The Used Vehicle Trading Platform uses **MySQL** as the relational database. The database is designed to support three main types of users:

- Buyer
- Seller
- Admin

The database manages users, vehicle listings, vehicle images, vehicle features, favorites, messages, reviews, categories, and locations.

## 2. Database Tables

The proposed database contains the following tables:

1. `roles`
2. `users`
3. `user_profiles`
4. `categories`
5. `locations`
6. `vehicles`
7. `vehicle_images`
8. `vehicle_features`
9. `favorites`
10. `messages`
11. `reviews`

---

## 3. Database Relationship Structure

```text
                         ┌──────────────┐
                         │    ROLES     │
                         └──────┬───────┘
                                │ 1
                                │
                                │ N
                         ┌──────▼───────┐
              ┌──────────│    USERS     │──────────┐
              │          └──────┬───────┘          │
              │                 │                   │
              │                 │ 1                 │
              │                 ▼                   │
              │        ┌────────────────┐           │
              │        │ USER_PROFILES  │           │
              │        └────────────────┘           │
              │                                     │
              │ 1                                   │ N
              ▼                                     ▼
       ┌─────────────┐                       ┌─────────────┐
       │  FAVORITES  │                       │  MESSAGES   │
       └──────┬──────┘                       └──────┬──────┘
              │ N                                   │
              │                                     │
              ▼                                     ▼
                       ┌─────────────────┐
                       │    VEHICLES     │
                       └───────┬─────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
       ┌────────────┐   ┌───────────────┐  ┌────────────┐
       │   IMAGES   │   │   FEATURES    │  │  REVIEWS   │
       └────────────┘   └───────────────┘  └────────────┘
              ▲
              │
       ┌──────┴──────┐
       │             │
  CATEGORIES      LOCATIONS
```

---

# 4. `roles` Table

This table stores the different types of users in the platform.

| Column | Data Type | Constraint | Description |
|---|---|---|---|
| `role_id` | INT | PK, AUTO_INCREMENT | Unique role ID |
| `role_name` | VARCHAR(20) | UNIQUE, NOT NULL | Role name |
| `description` | VARCHAR(100) | | Description of role |

### Example Data

| role_id | role_name | description |
|---:|---|---|
| 1 | BUYER | Can search and purchase vehicles |
| 2 | SELLER | Can list vehicles for sale |
| 3 | ADMIN | Manages the platform |

### Relationship

```text
ROLES 1 ───────── N USERS
```

One role can be assigned to many users.

---

# 5. `users` Table

This is the main table for user accounts.

| Column | Data Type | Constraint | Description |
|---|---|---|---|
| `user_id` | INT | PK, AUTO_INCREMENT | Unique user ID |
| `role_id` | INT | FK | User role |
| `name` | VARCHAR(100) | NOT NULL | User's name |
| `email` | VARCHAR(100) | UNIQUE, NOT NULL | Email address |
| `password` | VARCHAR(255) | NOT NULL | Encrypted password |
| `phone` | VARCHAR(15) | | Phone number |
| `status` | ENUM | | ACTIVE/BLOCKED |
| `created_at` | TIMESTAMP | | Account creation time |
| `updated_at` | TIMESTAMP | | Last update time |

### Relationship

```text
ROLES 1 ───────── N USERS
```

---

# 6. `user_profiles` Table

Stores additional information about users.

| Column | Data Type | Constraint |
|---|---|---|
| `profile_id` | INT | PK, AUTO_INCREMENT |
| `user_id` | INT | FK, UNIQUE |
| `address` | TEXT | |
| `city` | VARCHAR(100) | |
| `state` | VARCHAR(100) | |
| `pincode` | VARCHAR(10) | |
| `created_at` | TIMESTAMP | |
| `updated_at` | TIMESTAMP | |

### Relationship

```text
USERS 1 ───────── 1 USER_PROFILES
```

Each user has one profile.

---

# 7. `categories` Table

Stores vehicle categories.

| Column | Data Type | Constraint |
|---|---|---|
| `category_id` | INT | PK, AUTO_INCREMENT |
| `category_name` | VARCHAR(100) | UNIQUE, NOT NULL |
| `description` | VARCHAR(255) | |
| `status` | BOOLEAN | DEFAULT TRUE |

### Example Data

```text
1 → Car
2 → Bike
3 → SUV
4 → Van
5 → Truck
```

### Relationship

```text
CATEGORIES 1 ───────── N VEHICLES
```

One category can contain many vehicles.

---

# 8. `locations` Table

Stores the location where a vehicle is available.

| Column | Data Type | Constraint |
|---|---|---|
| `location_id` | INT | PK, AUTO_INCREMENT |
| `city` | VARCHAR(100) | NOT NULL |
| `state` | VARCHAR(100) | NOT NULL |
| `pincode` | VARCHAR(10) | |
| `status` | BOOLEAN | DEFAULT TRUE |

### Example Locations

```text
Chennai
Bengaluru
Coimbatore
Madurai
Hyderabad
```

### Relationship

```text
LOCATIONS 1 ───────── N VEHICLES
```

---

# 9. `vehicles` Table

This is the **main table** of the Used Vehicle Trading Platform. It stores all vehicle listings.

| Column | Data Type | Constraint | Description |
|---|---|---|---|
| `vehicle_id` | INT | PK, AUTO_INCREMENT | Vehicle ID |
| `seller_id` | INT | FK | Seller who listed vehicle |
| `category_id` | INT | FK | Vehicle category |
| `location_id` | INT | FK | Vehicle location |
| `brand` | VARCHAR(100) | NOT NULL | Vehicle brand |
| `model` | VARCHAR(100) | NOT NULL | Vehicle model |
| `year` | INT | NOT NULL | Manufacturing year |
| `price` | DECIMAL(12,2) | NOT NULL | Selling price |
| `kms_driven` | INT | NOT NULL | Kilometers driven |
| `fuel_type` | VARCHAR(50) | | Petrol/Diesel/Electric/etc. |
| `transmission` | VARCHAR(50) | | Manual/Automatic |
| `color` | VARCHAR(50) | | Vehicle color |
| `description` | TEXT | | Vehicle description |
| `status` | ENUM | | PENDING/APPROVED/REJECTED/SOLD |
| `created_at` | TIMESTAMP | | Listing creation time |
| `updated_at` | TIMESTAMP | | Last update time |

### Relationships

```text
USERS       1 ───────── N VEHICLES
CATEGORIES  1 ───────── N VEHICLES
LOCATIONS   1 ───────── N VEHICLES
```

### Example Vehicle

```text
Seller       : Allan
Brand        : Honda
Model        : City
Year         : 2022
Price        : ₹8,50,000
Fuel         : Petrol
KM Driven    : 32,000
Location     : Chennai
Status       : APPROVED
```

---

# 10. `vehicle_images` Table

A vehicle can have multiple images.

| Column | Data Type | Constraint |
|---|---|---|
| `image_id` | INT | PK, AUTO_INCREMENT |
| `vehicle_id` | INT | FK |
| `image_url` | VARCHAR(255) | NOT NULL |
| `is_primary` | BOOLEAN | DEFAULT FALSE |
| `created_at` | TIMESTAMP | |

### Relationship

```text
VEHICLES 1 ───────── N VEHICLE_IMAGES
```

### Example

```text
Honda City
│
├── front.jpg
├── rear.jpg
├── interior.jpg
└── dashboard.jpg
```

---

# 11. `vehicle_features` Table

Stores additional features and specifications of a vehicle.

| Column | Data Type | Constraint |
|---|---|---|
| `feature_id` | INT | PK, AUTO_INCREMENT |
| `vehicle_id` | INT | FK |
| `feature_name` | VARCHAR(100) | |
| `feature_value` | VARCHAR(100) | |

### Example

```text
Vehicle: Honda City

Feature              Value
--------------------------------
Air Conditioning     Yes
Power Windows        Yes
Sunroof              Yes
ABS                  Yes
Airbags              6
Bluetooth            Yes
```

### Relationship

```text
VEHICLES 1 ───────── N VEHICLE_FEATURES
```

---

# 12. `favorites` Table

Allows buyers to save vehicles that they are interested in.

| Column | Data Type | Constraint |
|---|---|---|
| `favorite_id` | INT | PK, AUTO_INCREMENT |
| `user_id` | INT | FK |
| `vehicle_id` | INT | FK |
| `created_at` | TIMESTAMP | |
| | | UNIQUE(`user_id`, `vehicle_id`) |

### Relationships

```text
USERS    1 ───────── N FAVORITES
VEHICLES 1 ───────── N FAVORITES
```

The unique constraint prevents a user from adding the same vehicle to favorites more than once.

---

# 13. `messages` Table

Stores communication between buyers and sellers.

| Column | Data Type | Constraint |
|---|---|---|
| `message_id` | INT | PK, AUTO_INCREMENT |
| `sender_id` | INT | FK |
| `receiver_id` | INT | FK |
| `vehicle_id` | INT | FK |
| `message` | TEXT | NOT NULL |
| `is_read` | BOOLEAN | DEFAULT FALSE |
| `created_at` | TIMESTAMP | |

### Example

```text
Buyer → Seller

"Is this Honda City still available?"
```

### Relationships

```text
USERS    1 ───────── N MESSAGES
USERS    1 ───────── N MESSAGES
VEHICLES 1 ───────── N MESSAGES
```

Both `sender_id` and `receiver_id` reference `users.user_id`.

---

# 14. `reviews` Table

Allows buyers to provide ratings and reviews.

| Column | Data Type | Constraint |
|---|---|---|
| `review_id` | INT | PK, AUTO_INCREMENT |
| `vehicle_id` | INT | FK |
| `user_id` | INT | FK |
| `rating` | INT | 1–5 |
| `review_text` | TEXT | |
| `created_at` | TIMESTAMP | |

### Example

```text
Rating: 5/5

"Vehicle was in excellent condition.
Seller provided all required details."
```

### Relationships

```text
USERS    1 ───────── N REVIEWS
VEHICLES 1 ───────── N REVIEWS
```

---

# 15. Complete Relationship Summary

| Parent Table | Child Table | Relationship |
|---|---|---|
| `roles` | `users` | 1 : N |
| `users` | `user_profiles` | 1 : 1 |
| `users` | `vehicles` | 1 : N |
| `categories` | `vehicles` | 1 : N |
| `locations` | `vehicles` | 1 : N |
| `vehicles` | `vehicle_images` | 1 : N |
| `vehicles` | `vehicle_features` | 1 : N |
| `users` | `favorites` | 1 : N |
| `vehicles` | `favorites` | 1 : N |
| `users` | `messages` | 1 : N |
| `vehicles` | `messages` | 1 : N |
| `users` | `reviews` | 1 : N |
| `vehicles` | `reviews` | 1 : N |

---

# 16. Recommended GitHub Folder Structure

```text
UsedVehicleTradingPlatform/
│
├── frontend/
│
├── backend/
│
├── database/
│   ├── schema.sql
│   ├── sample_data.sql
│   └── README.md
│
├── documentation/
│   ├── ER_Diagram.png
│   └── Database_Design.md
│
└── README.md
```

### `schema.sql`

Contains all `CREATE TABLE` statements.

### `sample_data.sql`

Contains sample users, vehicles, categories, locations, and other test data.

### `Database_Design.md`

Contains this database documentation.

---

# 17. Recommended Development Order

As a beginner, create the database in the following order:

```text
roles
  ↓
users
  ↓
user_profiles
  ↓
categories + locations
  ↓
vehicles
  ↓
vehicle_images + vehicle_features
  ↓
favorites
  ↓
messages
  ↓
reviews
```

The most important tables for the first working version are:

```text
users
   ↓
vehicles
   ↓
vehicle_images
   ↓
favorites
   ↓
messages
```

Once these are working, the remaining features can be added gradually.

---

# 18. Technology

The recommended database technology for this project is:

- **Database:** MySQL
- **Database Tool:** MySQL Workbench
- **Backend:** Java Spring Boot
- **Frontend:** HTML, CSS, JavaScript, Bootstrap
- **API Testing:** Postman
- **Version Control:** Git and GitHub

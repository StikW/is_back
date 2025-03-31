-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS is_database;
USE is_database;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('owner', 'interested') NOT NULL DEFAULT 'interested',
    phone VARCHAR(20),
    profile_image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de propiedades
CREATE TABLE IF NOT EXISTS properties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    zip_code VARCHAR(10),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    property_type ENUM('house', 'apartment', 'land', 'commercial') NOT NULL,
    bedrooms INT,
    bathrooms INT,
    parking_spots INT,
    total_area DECIMAL(10,2),
    built_area DECIMAL(10,2),
    year_built INT,
    status ENUM('available', 'rented', 'sold') NOT NULL DEFAULT 'available',
    featured BOOLEAN DEFAULT FALSE,
    views_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla de características de propiedades
CREATE TABLE IF NOT EXISTS property_features (
    id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT NOT NULL,
    feature_name VARCHAR(100) NOT NULL,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

-- Tabla de imágenes de propiedades
CREATE TABLE IF NOT EXISTS property_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    image_description TEXT,
    is_main BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

-- Tabla de favoritos
CREATE TABLE IF NOT EXISTS favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    property_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    UNIQUE KEY unique_favorite (user_id, property_id)
);

-- Tabla de mensajes
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    property_id INT NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

-- Tabla de reseñas
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT NOT NULL,
    reviewer_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_review (reviewer_id, property_id)
);

-- Tabla de visitas programadas
CREATE TABLE IF NOT EXISTS property_visits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT NOT NULL,
    user_id INT NOT NULL,
    visit_date DATETIME NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Índices para optimizar búsquedas
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_type ON properties(property_type);
CREATE INDEX idx_properties_featured ON properties(featured);
CREATE INDEX idx_messages_receiver ON messages(receiver_id, is_read);
CREATE INDEX idx_reviews_property ON reviews(property_id);
CREATE INDEX idx_visits_date ON property_visits(visit_date);

-- Insertar datos de ejemplo
-- Usuario propietario
INSERT INTO users (name, email, password, role, phone) VALUES 
('Juan Propietario', 'juan@example.com', '$2b$10$YourHashedPasswordHere', 'owner', '+1234567890');

-- Usuario interesado
INSERT INTO users (name, email, password, role, phone) VALUES 
('María Interesada', 'maria@example.com', '$2b$10$YourHashedPasswordHere', 'interested', '+0987654321');

-- Propiedad de ejemplo
INSERT INTO properties (
    owner_id, title, description, price, 
    address, city, state, zip_code,
    property_type, bedrooms, bathrooms, parking_spots,
    total_area, built_area, year_built, status, featured
) VALUES (
    1, 
    'Casa moderna en zona residencial',
    'Hermosa casa moderna con acabados de lujo, amplios espacios y excelente ubicación',
    500000.00,
    'Calle Principal 123',
    'Ciudad Ejemplo',
    'Estado Ejemplo',
    '12345',
    'house',
    3,
    2,
    2,
    200.00,
    180.00,
    2020,
    'available',
    TRUE
);

-- Características de la propiedad
INSERT INTO property_features (property_id, feature_name) VALUES
(1, 'Aire acondicionado'),
(1, 'Calefacción'),
(1, 'Jardín'),
(1, 'Piscina');

-- Imagen de la propiedad
INSERT INTO property_images (property_id, image_url, is_main, image_description) VALUES
(1, 'https://example.com/images/property1-main.jpg', TRUE, 'Fachada principal'),
(1, 'https://example.com/images/property1-living.jpg', FALSE, 'Sala de estar'); 
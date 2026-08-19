CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    names VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(30) UNIQUE NOT NULL,
    national_id VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS clients (
    id SERIAL PRIMARY KEY,
    admin_id INTEGER NOT NULL,
    names VARCHAR(150) NOT NULL,
    national_id VARCHAR(50) NOT NULL,
    telephone VARCHAR(30) NOT NULL,
    address TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_client_admin
        FOREIGN KEY (admin_id)
        REFERENCES admins(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_client_per_admin
        UNIQUE (admin_id, national_id)
);

CREATE TABLE IF NOT EXISTS vehicles (
    id SERIAL PRIMARY KEY,
    admin_id INTEGER NOT NULL,
    chassis_number VARCHAR(100) NOT NULL,
    manufacturer VARCHAR(100) NOT NULL,
    manufacture_year INTEGER NOT NULL,
    price NUMERIC(15, 2) NOT NULL,
    model_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_vehicle_admin
        FOREIGN KEY (admin_id)
        REFERENCES admins(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_vehicle_per_admin
        UNIQUE (admin_id, chassis_number)
);

CREATE TABLE IF NOT EXISTS vehicle_assignments (
    id SERIAL PRIMARY KEY,
    vehicle_id INTEGER NOT NULL,
    client_id INTEGER NOT NULL,
    admin_id INTEGER NOT NULL,
    plate_number VARCHAR(30) NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_assignment_vehicle
        FOREIGN KEY (vehicle_id)
        REFERENCES vehicles(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_assignment_client
        FOREIGN KEY (client_id)
        REFERENCES clients(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_assignment_admin
        FOREIGN KEY (admin_id)
        REFERENCES admins(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_vehicle_assignment
        UNIQUE (vehicle_id),

    CONSTRAINT unique_plate_per_admin
        UNIQUE (admin_id, plate_number)
);
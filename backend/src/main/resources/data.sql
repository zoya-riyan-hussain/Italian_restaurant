-- Step 1: Clear all menu items (safe if no orders reference them)
DELETE FROM menu_items;

-- Step 2: Insert clean data with verified image URLs
INSERT INTO menu_items (name, description, price, category, image_url, available) VALUES
('Margherita', 'Classic tomato sauce, mozzarella, fresh basil', 12.99, 'PIZZA', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400', true),
('Pepperoni', 'Tomato sauce, mozzarella, spicy pepperoni', 14.99, 'PIZZA', 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400', true),
('Quattro Formaggi', 'Four cheese blend: mozzarella, gorgonzola, parmesan, fontina', 15.99, 'PIZZA', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400', true),
('Spaghetti Carbonara', 'Eggs, pecorino romano, guanciale, black pepper', 16.99, 'PASTA', 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400', true),
('Fettuccine Alfredo', 'Creamy parmesan sauce with butter', 15.99, 'PASTA', 'https://images.unsplash.com/photo-1556761223-4c4282c73f77?w=400', true),
('Penne Arrabbiata', 'Spicy tomato sauce with garlic and red chili', 14.99, 'PASTA', 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400', true),
('Tiramisu', 'Coffee-soaked ladyfingers with mascarpone cream', 8.99, 'DESSERTS', 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400', true),
('Panna Cotta', 'Vanilla cream dessert with berry coulis', 7.99, 'DESSERTS', 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400', true),
('Chianti Classico', 'Full-bodied Tuscan red wine', 28.00, 'DRINKS', 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400', true),
('Limonata', 'Fresh homemade lemonade', 4.99, 'DRINKS', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400', true);
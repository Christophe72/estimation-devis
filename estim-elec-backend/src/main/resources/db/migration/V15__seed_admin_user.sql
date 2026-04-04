INSERT INTO users (email, password, prenom, nom, role, enabled)
SELECT
    'admin@estimelec.be',
    '$2a$10$HsuE/TGejtDsEdXzJj0LBuzoAcu/M8rrPuI3lqCRJHt6d5ThJQ7l2',
    'Admin',
    'Estimelec',
    'ADMIN',
    TRUE
WHERE NOT EXISTS (
    SELECT 1
    FROM users
    WHERE email = 'admin@estimelec.be'
);

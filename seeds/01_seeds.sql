INSERT INTO users (name, email, password)
VALUES ('Jonathan Michael', 'jonathan@jonathan.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Emily Rose ', 'emily@emily.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('David Alexander', 'david@david.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES (
  1, 'Cozy Mountain Cabin', 'description', 
  'https://example.com/thumb1.jpg', 'https://example.com/cover1.jpg', 
  150, 2, 2, 3, 
  'Canada', '123 Maple St', 'Banff', 'Alberta', 'T1L 1A1', TRUE
),
(
  1, 'Luxury Beachfront Villa', 'description', 
  'https://example.com/thumb2.jpg', 'https://example.com/cover2.jpg', 
  500, 3, 4, 5, 
  'United States', '456 Ocean Dr', 'Miami', 'Florida', '33139', TRUE
),
(
  2, 'Modern City Apartment', 'description', 
  'https://example.com/thumb3.jpg', 'https://example.com/cover3.jpg', 
  200, 1, 1, 2, 
  'United Kingdom', '789 King St', 'London', 'Greater London', 'SW1A 1AA', TRUE
);

INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES ('2018-09-11', '2018-09-26', 2, 3),
('2019-01-04', '2019-02-01', 2, 2),
('2021-10-01', '2021-10-14', 1, 3);

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (
  3, 2, 1, 3, 'messages'
),
(
  2, 2, 2, 4, 'messages'
),
(
  3, 1, 3, 4, 'messages'
);
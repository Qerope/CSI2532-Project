INSERT INTO HotelChain (name, central_address, num_hotels, contact_email, telephone)
VALUES
('Oceanic Hotels', '123 Ocean Ave, Miami, FL', 8, 'contact@oceanic.com', '305-555-1234'),
('Mountain Resorts', '456 Mountain Rd, Denver, CO', 8, 'info@mountainresorts.com', '720-555-5678'),
('Cityscape Hotels', '789 City Blvd, New York, NY', 8, 'support@cityscape.com', '212-555-8765'),
('Luxury Escapes', '101 Luxury St, Los Angeles, CA', 8, 'service@luxuryescapes.com', '310-555-4321'),
('Budget Inns', '202 Budget Ave, Austin, TX', 8, 'contact@budgetinns.com', '512-555-9876');

-- Oceanic Hotels
INSERT INTO Hotel (chain_id, name, classification, num_rooms, address, contact_email, telephone)
VALUES
(11, 'Oceanic Bay Resort', 5, 10, '123 Ocean Bay, Miami, FL', 'contact@oceanicbay.com', '305-555-1001'),
(11, 'Oceanic Harbor Hotel', 4, 12, '456 Harbor St, Miami, FL', 'contact@oceanicharbor.com', '305-555-1002'),
(11, 'Oceanic Paradise', 5, 8, '789 Paradise Rd, Miami, FL', 'contact@oceanicparadise.com', '305-555-1003'),
(11, 'Oceanic Shores Inn', 3, 10, '101 Shores Blvd, Miami, FL', 'contact@oceanicshores.com', '305-555-1004'),
(11, 'Oceanic Breeze Resort', 4, 9, '102 Breeze Dr, Miami, FL', 'contact@oceanicbreeze.com', '305-555-1005'),
(11, 'Oceanic Sunset Retreat', 3, 6, '103 Sunset Blvd, Miami, FL', 'contact@oceanicsunset.com', '305-555-1006'),
(11, 'Oceanic Coastline', 4, 7, '104 Coastline Ave, Miami, FL', 'contact@oceaniccoastline.com', '305-555-1007'),
(11, 'Oceanic Vista Hotel', 5, 8, '105 Vista Rd, Miami, FL', 'contact@oceanicvista.com', '305-555-1008');

-- Mountain Resorts
INSERT INTO Hotel (chain_id, name, classification, num_rooms, address, contact_email, telephone)
VALUES
(12, 'Mountain Retreat', 5, 10, '123 Mountain Rd, Denver, CO', 'info@mountainretreat.com', '720-555-2001'),
(12, 'Alpine Summit Resort', 4, 12, '456 Summit Rd, Denver, CO', 'info@alpinesummit.com', '720-555-2002'),
(12, 'Rocky Peak Inn', 4, 8, '789 Peak Rd, Denver, CO', 'info@rockypeakinn.com', '720-555-2003'),
(12, 'Cedar Woods Lodge', 3, 7, '101 Cedar Ln, Denver, CO', 'info@cedarwoods.com', '720-555-2004'),
(12, 'Snowfall Lodge', 4, 9, '102 Snowfall Dr, Denver, CO', 'info@snowfalllodge.com', '720-555-2005'),
(12, 'Silver Pine Inn', 3, 6, '103 Pine Rd, Denver, CO', 'info@silverpineinn.com', '720-555-2006'),
(12, 'Summit View Hotel', 5, 11, '104 Summit View, Denver, CO', 'info@summitview.com', '720-555-2007'),
(12, 'Evergreen Resort', 5, 10, '105 Evergreen St, Denver, CO', 'info@evergreenresort.com', '720-555-2008');

-- Cityscape Hotels
INSERT INTO Hotel (chain_id, name, classification, num_rooms, address, contact_email, telephone)
VALUES
(13, 'Skyline Tower', 5, 15, '123 Skyline St, New York, NY', 'support@skylinetower.com', '212-555-3001'),
(13, 'Central Park Inn', 4, 10, '456 Park Ave, New York, NY', 'support@centralparkinn.com', '212-555-3002'),
(13, 'City Plaza Hotel', 4, 12, '789 Plaza Rd, New York, NY', 'support@cityplazahotel.com', '212-555-3003'),
(13, 'Downtown Luxury', 5, 9, '101 Downtown St, New York, NY', 'support@downtownluxury.com', '212-555-3004'),
(13, 'Grand City Hotel', 5, 11, '102 Grand Blvd, New York, NY', 'support@grandcityhotel.com', '212-555-3005'),
(13, 'Urban Heights Hotel', 3, 8, '103 Heights Ave, New York, NY', 'support@urbanheights.com', '212-555-3006'),
(13, 'Empire City Inn', 4, 10, '104 Empire Rd, New York, NY', 'support@empirecityinn.com', '212-555-3007'),
(13, 'Metropolitan Suites', 5, 13, '105 Metropolitan St, New York, NY', 'support@metropolitansuites.com', '212-555-3008');

-- Luxury Escapes
INSERT INTO Hotel (chain_id, name, classification, num_rooms, address, contact_email, telephone)
VALUES
(14, 'Golden Sands Resort', 5, 10, '123 Golden Sands St, Los Angeles, CA', 'service@goldensands.com', '310-555-4001'),
(14, 'Majestic Palms Hotel', 4, 12, '456 Majestic Blvd, Los Angeles, CA', 'service@majesticpalms.com', '310-555-4002'),
(14, 'Regal Heights Hotel', 5, 15, '789 Regal Ave, Los Angeles, CA', 'service@regalheights.com', '310-555-4003'),
(14, 'Opulent View Resort', 4, 11, '101 Opulent View Dr, Los Angeles, CA', 'service@opulentview.com', '310-555-4004'),
(14, 'Royal Oceanside', 5, 10, '102 Royal Blvd, Los Angeles, CA', 'service@royaloceanside.com', '310-555-4005'),
(14, 'Diamond Retreat', 5, 12, '103 Diamond Dr, Los Angeles, CA', 'service@diamondretreat.com', '310-555-4006'),
(14, 'Prestige Towers', 4, 9, '104 Prestige Rd, Los Angeles, CA', 'service@prestigetowers.com', '310-555-4007'),
(14, 'Crown Ridge Resort', 5, 8, '105 Crown Ridge, Los Angeles, CA', 'service@crownridge.com', '310-555-4008');

-- Budget Inns
INSERT INTO Hotel (chain_id, name, classification, num_rooms, address, contact_email, telephone)
VALUES
(15, 'Inexpensive Stay Inn', 2, 10, '123 Inexpensive St, Austin, TX', 'contact@inexpensivestay.com', '512-555-5001'),
(15, 'Budget Bunkhouse', 3, 12, '456 Budget Rd, Austin, TX', 'contact@budgetbunkhouse.com', '512-555-5002'),
(15, 'Cheap Suites Hotel', 2, 8, '789 Cheap Ave, Austin, TX', 'contact@cheapsuites.com', '512-555-5003'),
(15, 'Low-Cost Inn', 1, 6, '101 Low-Cost Dr, Austin, TX', 'contact@lowcostinn.com', '512-555-5004'),
(15, 'Affordable Rest', 3, 7, '102 Affordable St, Austin, TX', 'contact@affordablerest.com', '512-555-5005'),
(15, 'Economy Stay Inn', 2, 10, '103 Economy Ave, Austin, TX', 'contact@economystay.com', '512-555-5006'),
(15, 'Budget Beachfront Hotel', 3, 9, '104 Beachfront Rd, Austin, TX', 'contact@budgetbeachfront.com', '512-555-5007'),
(15, 'Value Park Inn', 3, 8, '105 Value Park St, Austin, TX', 'contact@valueparkinn.com', '512-555-5008');

-- Oceanic Bay Resort (hotel 1)
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities)
VALUES
(11, 200.00, 1, 'Sea View', TRUE, 'Good Condition', 'AC, TV, Wi-Fi'),
(11, 250.00, 2, 'Mountain View', TRUE, 'Good Condition', 'AC, TV, Wi-Fi, Mini Bar'),
(11, 300.00, 3, 'City View', FALSE, 'Good Condition', 'AC, TV, Wi-Fi, Balcony'),
(11, 180.00, 1, 'Sea View', TRUE, 'In Repair', 'AC, TV'),
(11, 150.00, 2, 'Mountain View', FALSE, 'Damaged', 'AC, TV');

-- Oceanic Harbor Hotel (hotel 2)
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities)
VALUES
(12, 220.00, 1, 'Mountain View', TRUE, 'Good Condition', 'AC, TV, Wi-Fi'),
(12, 270.00, 2, 'City View', TRUE, 'Good Condition', 'AC, TV, Wi-Fi, Mini Bar'),
(12, 330.00, 3, 'Sea View', FALSE, 'Good Condition', 'AC, TV, Wi-Fi, Balcony'),
(12, 200.00, 1, 'City View', TRUE, 'In Repair', 'AC, TV'),
(12, 180.00, 2, 'Mountain View', FALSE, 'Damaged', 'AC, TV');

-- Oceanic Paradise (hotel 3)
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities)
VALUES
(13, 210.00, 1, 'Sea View', TRUE, 'Good Condition', 'AC, TV, Wi-Fi'),
(13, 260.00, 2, 'Mountain View', TRUE, 'Good Condition', 'AC, TV, Wi-Fi, Mini Bar'),
(13, 290.00, 3, 'City View', FALSE, 'Good Condition', 'AC, TV, Wi-Fi, Balcony'),
(13, 190.00, 1, 'Sea View', TRUE, 'In Repair', 'AC, TV'),
(13, 170.00, 2, 'Mountain View', FALSE, 'Damaged', 'AC, TV');

-- Oceanic Shores Inn (hotel 4)
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities)
VALUES
(14, 180.00, 1, 'Sea View', TRUE, 'Good Condition', 'AC, TV, Wi-Fi'),
(14, 230.00, 2, 'Mountain View', TRUE, 'Good Condition', 'AC, TV, Wi-Fi, Mini Bar'),
(14, 270.00, 3, 'City View', FALSE, 'Good Condition', 'AC, TV, Wi-Fi, Balcony'),
(14, 160.00, 1, 'Sea View', TRUE, 'In Repair', 'AC, TV'),
(14, 140.00, 2, 'Mountain View', FALSE, 'Damaged', 'AC, TV');

-- Oceanic Breeze Resort (hotel 5)
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities)
VALUES
(15, 210.00, 1, 'Sea View', TRUE, 'Good Condition', 'AC, TV, Wi-Fi'),
(15, 260.00, 2, 'Mountain View', TRUE, 'Good Condition', 'AC, TV, Wi-Fi, Mini Bar'),
(15, 300.00, 3, 'City View', FALSE, 'Good Condition', 'AC, TV, Wi-Fi, Balcony'),
(15, 190.00, 1, 'Sea View', TRUE, 'In Repair', 'AC, TV'),
(15, 170.00, 2, 'Mountain View', FALSE, 'Damaged', 'AC, TV');


INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (16, 184, 2, 'City View', true, 'Damaged', 'TV, Balcony, AC, Wi-Fi');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (16, 250, 1, 'Sea View', false, 'In Repair', 'Balcony, Mini Bar');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (16, 330, 1, 'Mountain View', true, 'In Repair', 'Wi-Fi, Balcony, Mini Bar');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (16, 152, 1, 'Mountain View', false, 'Good Condition', 'AC, Mini Bar, Balcony');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (16, 242, 3, 'Mountain View', false, 'Good Condition', 'TV, Balcony');

INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (17, 196, 2, 'Mountain View', true, 'In Repair', 'Mini Bar, TV');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (17, 154, 1, 'City View', false, 'Damaged', 'Mini Bar, Wi-Fi');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (17, 151, 2, 'Mountain View', true, 'In Repair', 'AC, Wi-Fi, Balcony');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (17, 269, 3, 'City View', false, 'In Repair', 'Balcony, AC, Mini Bar');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (17, 283, 3, 'City View', true, 'Good Condition', 'Wi-Fi, Mini Bar, TV, AC');

INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (18, 288, 2, 'City View', true, 'Damaged', 'Mini Bar, Wi-Fi, Balcony');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (18, 279, 2, 'Sea View', true, 'Damaged', 'TV, AC, Mini Bar, Balcony');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (18, 195, 2, 'Sea View', true, 'Good Condition', 'Mini Bar, Wi-Fi');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (18, 194, 3, 'Sea View', false, 'In Repair', 'Balcony, AC, TV');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (18, 201, 3, 'Sea View', true, 'In Repair', 'AC, Balcony');

INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (19, 165, 2, 'Mountain View', true, 'Damaged', 'TV, AC, Balcony');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (19, 157, 3, 'City View', false, 'Good Condition', 'Wi-Fi, TV');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (19, 140, 3, 'Sea View', false, 'Good Condition', 'Balcony, AC, TV, Wi-Fi');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (19, 145, 1, 'Sea View', false, 'Damaged', 'Wi-Fi, Mini Bar, AC, TV');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (19, 192, 3, 'City View', true, 'Damaged', 'Balcony, TV');

INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (20, 174, 1, 'Sea View', false, 'In Repair', 'Balcony, AC, Wi-Fi, Mini Bar');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (20, 292, 2, 'City View', true, 'Damaged', 'AC, Wi-Fi, Balcony, TV');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (20, 276, 3, 'City View', true, 'Damaged', 'Balcony, TV');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (20, 283, 1, 'Sea View', true, 'Good Condition', 'Balcony, Mini Bar, Wi-Fi');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (20, 271, 3, 'Sea View', false, 'Damaged', 'TV, Balcony, AC, Mini Bar');

INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (21, 308, 2, 'Mountain View', false, 'In Repair', 'Wi-Fi, Balcony, AC');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (21, 247, 2, 'Sea View', false, 'Damaged', 'Balcony, Mini Bar');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (21, 249, 1, 'City View', true, 'In Repair', 'Mini Bar, Balcony, TV, Wi-Fi');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (21, 270, 3, 'Mountain View', false, 'Good Condition', 'Mini Bar, Balcony, AC, Wi-Fi');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (21, 142, 3, 'Mountain View', true, 'Damaged', 'Balcony, Mini Bar, TV, AC');

INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (22, 263, 3, 'City View', true, 'Good Condition', 'TV, Balcony, Wi-Fi');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (22, 241, 2, 'Mountain View', false, 'Good Condition', 'Balcony, TV');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (22, 271, 3, 'City View', false, 'Damaged', 'Balcony, Wi-Fi');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (22, 145, 3, 'Sea View', false, 'In Repair', 'Balcony, AC, TV');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (22, 275, 2, 'City View', false, 'Damaged', 'AC, Wi-Fi, Mini Bar, TV');

INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (23, 248, 3, 'City View', true, 'Good Condition', 'Mini Bar, AC');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (23, 151, 1, 'Mountain View', true, 'In Repair', 'Mini Bar, TV');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (23, 180, 3, 'Sea View', true, 'In Repair', 'TV, AC, Balcony, Mini Bar');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (23, 197, 1, 'Mountain View', false, 'Good Condition', 'Mini Bar, AC');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (23, 292, 2, 'City View', true, 'Damaged', 'Mini Bar, AC, Wi-Fi, Balcony');

INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (24, 142, 1, 'City View', false, 'Damaged', 'Wi-Fi, Balcony, Mini Bar, AC');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (24, 191, 1, 'Sea View', false, 'Good Condition', 'Wi-Fi, Mini Bar, TV, AC');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (24, 272, 1, 'Mountain View', true, 'Good Condition', 'Wi-Fi, TV, AC, Balcony');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (24, 159, 2, 'City View', true, 'Good Condition', 'Mini Bar, Balcony');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (24, 179, 2, 'City View', true, 'Damaged', 'AC, Wi-Fi, Mini Bar, TV');

INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (25, 288, 3, 'City View', true, 'Good Condition', 'AC, Balcony, Wi-Fi');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (25, 267, 3, 'City View', true, 'Damaged', 'Mini Bar, Wi-Fi, Balcony');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (25, 245, 2, 'Mountain View', true, 'Good Condition', 'Wi-Fi, Mini Bar');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (25, 248, 3, 'Sea View', true, 'Good Condition', 'Wi-Fi, AC, TV, Mini Bar');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (25, 311, 1, 'Sea View', false, 'In Repair', 'TV, AC');

INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (26, 173, 2, 'City View', false, 'Damaged', 'TV, Mini Bar, AC');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (26, 275, 2, 'Mountain View', true, 'Damaged', 'AC, TV, Balcony, Wi-Fi');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (26, 151, 1, 'Mountain View', false, 'Good Condition', 'Wi-Fi, Mini Bar, AC');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (26, 311, 2, 'City View', false, 'Damaged', 'Mini Bar, AC, Wi-Fi, Balcony');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (26, 266, 1, 'Sea View', true, 'Good Condition', 'Balcony, AC, TV, Mini Bar');

INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (27, 224, 2, 'Sea View', false, 'Damaged', 'Balcony, TV, Mini Bar, AC');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (27, 169, 2, 'Mountain View', false, 'In Repair', 'AC, Balcony');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (27, 144, 2, 'Sea View', true, 'Good Condition', 'TV, AC');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (27, 324, 2, 'Sea View', true, 'Damaged', 'TV, Mini Bar, AC, Wi-Fi');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (27, 167, 2, 'Sea View', true, 'In Repair', 'Wi-Fi, Balcony, AC');

INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (28, 183, 2, 'Sea View', true, 'Damaged', 'Mini Bar, TV, Balcony');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (28, 288, 3, 'Sea View', true, 'In Repair', 'Wi-Fi, Balcony');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (28, 172, 3, 'Mountain View', true, 'Damaged', 'Wi-Fi, TV');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (28, 282, 2, 'Sea View', true, 'In Repair', 'Wi-Fi, Mini Bar, TV');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (28, 189, 2, 'Sea View', true, 'Good Condition', 'AC, Wi-Fi');

INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (29, 304, 3, 'City View', false, 'Good Condition', 'TV, AC, Mini Bar');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (29, 319, 1, 'City View', false, 'In Repair', 'TV, Wi-Fi');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (29, 324, 2, 'Sea View', false, 'Damaged', 'Mini Bar, Wi-Fi, AC, Balcony');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (29, 313, 2, 'Sea View', true, 'In Repair', 'TV, Mini Bar, Balcony, Wi-Fi');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (29, 277, 3, 'Mountain View', false, 'In Repair', 'Wi-Fi, Mini Bar');

INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (30, 157, 3, 'Sea View', false, 'Good Condition', 'TV, AC');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (30, 144, 1, 'City View', true, 'Damaged', 'TV, Wi-Fi');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (30, 233, 1, 'City View', false, 'Good Condition', 'AC, Mini Bar');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (30, 259, 3, 'City View', false, 'Good Condition', 'AC, Mini Bar, Wi-Fi');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (30, 218, 3, 'City View', false, 'In Repair', 'TV, Balcony, Wi-Fi, AC');

INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (31, 143, 2, 'Sea View', false, 'Good Condition', 'Wi-Fi, AC');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (31, 308, 3, 'City View', false, 'Good Condition', 'Balcony, TV, Mini Bar');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (31, 209, 3, 'City View', false, 'Good Condition', 'Wi-Fi, AC');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (31, 166, 1, 'Mountain View', true, 'Good Condition', 'Balcony, Mini Bar, Wi-Fi');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (31, 198, 1, 'City View', false, 'Damaged', 'Wi-Fi, Mini Bar, AC');

INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (32, 217, 2, 'Sea View', true, 'Good Condition', 'Balcony, Wi-Fi, AC');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (32, 208, 3, 'Sea View', false, 'Good Condition', 'Balcony, AC, Mini Bar, Wi-Fi');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (32, 164, 2, 'City View', true, 'Good Condition', 'AC, TV, Wi-Fi, Balcony');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (32, 270, 2, 'Sea View', true, 'Good Condition', 'Wi-Fi, AC, TV');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (32, 192, 3, 'City View', false, 'In Repair', 'AC, TV, Balcony, Wi-Fi');

INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (33, 157, 2, 'City View', true, 'Damaged', 'TV, Wi-Fi, Balcony');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (33, 228, 2, 'Sea View', true, 'Damaged', 'TV, Balcony, Mini Bar, Wi-Fi');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (33, 247, 1, 'Mountain View', true, 'Damaged', 'Balcony, Mini Bar, AC');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (33, 242, 1, 'Mountain View', true, 'In Repair', 'Balcony, Wi-Fi, Mini Bar, TV');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (33, 314, 2, 'City View', false, 'Damaged', 'Mini Bar, Wi-Fi, TV, Balcony');

INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (34, 282, 2, 'Mountain View', false, 'In Repair', 'Balcony, AC, Wi-Fi, Mini Bar');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (34, 281, 2, 'Mountain View', true, 'Good Condition', 'Mini Bar, Balcony');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (34, 308, 2, 'City View', false, 'Good Condition', 'TV, Mini Bar, Wi-Fi');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (34, 223, 1, 'Sea View', true, 'Damaged', 'Wi-Fi, AC, TV');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (34, 176, 3, 'City View', false, 'Damaged', 'Balcony, Mini Bar, Wi-Fi');

INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (35, 278, 1, 'Mountain View', false, 'Good Condition', 'TV, Balcony, AC');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (35, 221, 2, 'City View', true, 'Damaged', 'TV, AC');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (35, 168, 2, 'Mountain View', false, 'In Repair', 'Balcony, TV, Mini Bar');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (35, 293, 2, 'Sea View', true, 'In Repair', 'AC, Wi-Fi, Balcony');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (35, 210, 3, 'City View', true, 'In Repair', 'Mini Bar, TV, AC, Balcony');

INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (36, 298, 3, 'Mountain View', false, 'Damaged', 'Mini Bar, Balcony, TV, Wi-Fi');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (36, 157, 2, 'Mountain View', true, 'In Repair', 'Mini Bar, AC, Wi-Fi');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (36, 164, 1, 'Sea View', true, 'Damaged', 'AC, Mini Bar, Wi-Fi');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (36, 248, 2, 'City View', false, 'Damaged', 'TV, Mini Bar');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (36, 155, 1, 'Mountain View', true, 'Damaged', 'Mini Bar, Wi-Fi, Balcony');

INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (37, 277, 3, 'Sea View', false, 'In Repair', 'AC, TV, Mini Bar, Balcony');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (37, 178, 2, 'City View', false, 'In Repair', 'TV, Wi-Fi, AC, Mini Bar');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (37, 150, 2, 'Mountain View', false, 'In Repair', 'Balcony, Mini Bar');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (37, 253, 1, 'City View', false, 'Damaged', 'Balcony, AC, TV');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (37, 167, 3, 'Mountain View', true, 'In Repair', 'Wi-Fi, AC, Balcony');

INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (38, 317, 2, 'Mountain View', false, 'In Repair', 'Mini Bar, AC, Wi-Fi');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (38, 273, 3, 'Sea View', false, 'Damaged', 'Mini Bar, Wi-Fi, AC, TV');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (38, 142, 1, 'Mountain View', false, 'Damaged', 'Balcony, AC, Wi-Fi');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (38, 194, 2, 'Mountain View', false, 'Damaged', 'AC, Wi-Fi, Mini Bar, Balcony');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (38, 271, 1, 'Sea View', true, 'In Repair', 'AC, TV, Balcony, Mini Bar');

INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (39, 196, 2, 'City View', false, 'Good Condition', 'Wi-Fi, AC, Mini Bar, TV');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (39, 194, 3, 'Mountain View', false, 'In Repair', 'TV, AC, Mini Bar, Balcony');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (39, 278, 3, 'Mountain View', false, 'Good Condition', 'AC, TV, Mini Bar, Balcony');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (39, 158, 1, 'City View', true, 'In Repair', 'Wi-Fi, Balcony');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (39, 295, 1, 'Mountain View', true, 'In Repair', 'AC, Balcony');

INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (40, 144, 3, 'City View', true, 'Damaged', 'Balcony, TV, Mini Bar');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (40, 312, 1, 'City View', true, 'In Repair', 'Wi-Fi, Balcony');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (40, 244, 1, 'Mountain View', false, 'Good Condition', 'Wi-Fi, AC, TV, Balcony');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (40, 289, 3, 'City View', true, 'Good Condition', 'TV, Wi-Fi, Mini Bar');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (40, 239, 3, 'Sea View', false, 'Damaged', 'TV, Mini Bar, AC');

INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (41, 289, 3, 'Mountain View', true, 'Good Condition', 'Mini Bar, Wi-Fi, AC, TV');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (41, 164, 2, 'Mountain View', false, 'Good Condition', 'TV, Balcony, Wi-Fi');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (41, 279, 2, 'City View', true, 'In Repair', 'Wi-Fi, TV, AC, Mini Bar');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (41, 277, 2, 'Mountain View', false, 'Good Condition', 'Mini Bar, Wi-Fi');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (41, 169, 1, 'City View', true, 'In Repair', 'Wi-Fi, AC');

INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (42, 272, 1, 'Mountain View', false, 'Good Condition', 'Balcony, Wi-Fi, AC, TV');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (42, 261, 1, 'City View', true, 'In Repair', 'Wi-Fi, Balcony, AC');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (42, 297, 3, 'Sea View', false, 'Damaged', 'AC, Wi-Fi');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (42, 295, 1, 'City View', false, 'Good Condition', 'AC, TV, Wi-Fi, Mini Bar');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (42, 258, 2, 'Mountain View', true, 'In Repair', 'Mini Bar, Wi-Fi, TV, Balcony');

INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (43, 213, 2, 'Sea View', false, 'In Repair', 'AC, Balcony, TV');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (43, 258, 2, 'Sea View', false, 'Good Condition', 'Mini Bar, Balcony');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (43, 291, 3, 'Sea View', false, 'In Repair', 'Wi-Fi, Balcony');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (43, 163, 2, 'Sea View', false, 'In Repair', 'Balcony, TV, Mini Bar, AC');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (43, 273, 2, 'Mountain View', false, 'Good Condition', 'AC, Mini Bar, Wi-Fi');

INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (44, 187, 3, 'City View', false, 'Damaged', 'Wi-Fi, AC');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (44, 286, 3, 'Sea View', false, 'In Repair', 'TV, Wi-Fi, Mini Bar, Balcony');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (44, 223, 2, 'Sea View', false, 'Good Condition', 'Balcony, Wi-Fi');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (44, 236, 2, 'Mountain View', false, 'In Repair', 'TV, AC, Wi-Fi, Balcony');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (44, 223, 3, 'Mountain View', false, 'Damaged', 'TV, Mini Bar, AC, Wi-Fi');

INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (45, 151, 2, 'City View', false, 'In Repair', 'Balcony, TV');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (45, 159, 2, 'City View', true, 'Good Condition', 'Wi-Fi, Balcony');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (45, 256, 2, 'Sea View', false, 'In Repair', 'AC, Wi-Fi, Mini Bar');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (45, 275, 2, 'Sea View', true, 'In Repair', 'Balcony, AC, Wi-Fi');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (45, 169, 3, 'Mountain View', true, 'In Repair', 'Mini Bar, TV, AC, Wi-Fi');

INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (46, 304, 2, 'City View', true, 'Damaged', 'TV, Mini Bar, AC, Wi-Fi');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (46, 230, 2, 'City View', true, 'Good Condition', 'AC, Mini Bar');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (46, 161, 1, 'Sea View', true, 'Damaged', 'Wi-Fi, Balcony, Mini Bar, TV');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (46, 183, 3, 'Sea View', true, 'Damaged', 'AC, Mini Bar, TV');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (46, 269, 3, 'Sea View', true, 'Damaged', 'Balcony, Wi-Fi, Mini Bar');

INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (47, 306, 1, 'City View', true, 'Good Condition', 'Wi-Fi, AC');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (47, 252, 2, 'City View', true, 'In Repair', 'AC, Mini Bar');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (47, 276, 2, 'City View', true, 'In Repair', 'AC, Wi-Fi');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (47, 195, 1, 'City View', true, 'Good Condition', 'AC, Wi-Fi, TV');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (47, 321, 1, 'Mountain View', true, 'In Repair', 'Balcony, TV, Wi-Fi, AC');

INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (48, 251, 1, 'City View', false, 'In Repair', 'Wi-Fi, Balcony');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (48, 151, 3, 'Sea View', false, 'In Repair', 'TV, Wi-Fi');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (48, 264, 1, 'Sea View', false, 'In Repair', 'Balcony, Wi-Fi, Mini Bar');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (48, 245, 1, 'Mountain View', false, 'Good Condition', 'Wi-Fi, Mini Bar, AC');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (48, 316, 1, 'Sea View', true, 'In Repair', 'Balcony, Mini Bar, AC, TV');

INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (49, 215, 1, 'Mountain View', true, 'In Repair', 'AC, TV, Wi-Fi, Balcony');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (49, 175, 3, 'Sea View', true, 'In Repair', 'Balcony, TV, Mini Bar, AC');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (49, 271, 1, 'Mountain View', false, 'Good Condition', 'Mini Bar, Balcony, AC');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (49, 158, 1, 'City View', true, 'In Repair', 'Wi-Fi, Balcony');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (49, 205, 1, 'Sea View', true, 'In Repair', 'AC, Balcony, Wi-Fi, TV');

INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (50, 228, 3, 'Mountain View', true, 'In Repair', 'Balcony, AC, TV');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (50, 149, 2, 'Mountain View', true, 'Good Condition', 'Mini Bar, Wi-Fi');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (50, 236, 2, 'Sea View', false, 'In Repair', 'Wi-Fi, Mini Bar, AC, Balcony');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (50, 145, 2, 'Mountain View', false, 'Damaged', 'Mini Bar, Wi-Fi');
INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities) VALUES (50, 306, 2, 'Mountain View', true, 'Good Condition', 'Balcony, TV, Wi-Fi, AC');

-- Oceanic Bay Resort (guests)
INSERT INTO Guest (full_name, address, SIN, date_of_checkin)
VALUES
('John Doe', '123 Ocean Ave, Miami, FL', '123456789', '2025-03-01'),
('Jane Smith', '456 Coral St, Miami, FL', '987654321', '2025-03-02');

-- Mountain Retreat (guests)
INSERT INTO Guest (full_name, address, SIN, date_of_checkin)
VALUES
('Alice Johnson', '123 Mountain Rd, Denver, CO', '111223344', '2025-03-03'),
('Bob Brown', '456 Aspen Ln, Denver, CO', '112233445', '2025-03-04');

-- Skyline Tower (guests)
INSERT INTO Guest (full_name, address, SIN, date_of_checkin)
VALUES
('Charlie White', '789 Broadway, New York, NY', '223344556', '2025-03-05'),
('David Green', '101 5th Ave, New York, NY', '334455667', '2025-03-06');

-- Golden Sands Resort (guests)
INSERT INTO Guest (full_name, address, SIN, date_of_checkin)
VALUES
('Eva Davis', '123 Sunset Blvd, Los Angeles, CA', '445566778', '2025-03-07'),
('Frank Miller', '456 Palm St, Los Angeles, CA', '556677889', '2025-03-08');

-- Inexpensive Stay Inn (guests)
INSERT INTO Guest (full_name, address, SIN, date_of_checkin)
VALUES
('Grace Wilson', '123 Low-Cost Rd, Austin, TX', '667788990', '2025-03-09'),
('Henry Lee', '789 Budget Ln, Austin, TX', '778899001', '2025-03-10');

-- Oceanic Bay Resort (employees)
INSERT INTO Employee (hotel_id, full_name, address, SIN, role)
VALUES
(11, 'Alice Fisher', '123 Ocean Ave, Miami, FL', '223344556', 'Manager'),
(11, 'Bob Martinez', '456 Coral St, Miami, FL', '334455667', 'Receptionist');

-- Mountain Retreat (employees)
INSERT INTO Employee (hotel_id, full_name, address, SIN, role)
VALUES
(12, 'Carla Wood', '123 Mountain Rd, Denver, CO', '445566778', 'Manager'),
(12, 'Dan Walker', '456 Aspen Ln, Denver, CO', '556677889', 'Housekeeper');

-- Skyline Tower (employees)
INSERT INTO Employee (hotel_id, full_name, address, SIN, role)
VALUES
(13, 'Eve Green', '789 Broadway, New York, NY', '667788990', 'Manager'),
(13, 'Frank Harris', '101 5th Ave, New York, NY', '778899001', 'Receptionist');

-- Golden Sands Resort (employees)
INSERT INTO Employee (hotel_id, full_name, address, SIN, role)
VALUES
(14, 'Grace Brown', '123 Sunset Blvd, Los Angeles, CA', '889900112', 'Manager'),
(14, 'Harry Wilson', '456 Palm St, Los Angeles, CA', '990011223', 'Housekeeper');

-- Inexpensive Stay Inn (employees)
INSERT INTO Employee (hotel_id, full_name, address, SIN, role)
VALUES
(15, 'Isaac Walker', '123 Low-Cost Rd, Austin, TX', '112233445', 'Manager'),
(15, 'Jack Black', '789 Budget Ln, Austin, TX', '223344559', 'Receptionist');

-- Oceanic Bay Resort (reservations)
INSERT INTO Reservation (guest_id, room_id, start_date, end_date, status)
VALUES
(1, 21, '2025-03-01', '2025-03-03', 'Booked'),
(2, 22, '2025-03-02', '2025-03-04', 'Booked');

-- Mountain Retreat (reservations)
INSERT INTO Reservation (guest_id, room_id, start_date, end_date, status)
VALUES
(3, 23, '2025-03-03', '2025-03-05', 'Booked'),
(4, 24, '2025-03-04', '2025-03-06', 'Booked');

-- Skyline Tower (reservations)
INSERT INTO Reservation (guest_id, room_id, start_date, end_date, status)
VALUES
(5, 25, '2025-03-05', '2025-03-07', 'Booked'),
(6, 26, '2025-03-06', '2025-03-08', 'Booked');

-- Golden Sands Resort (reservations)
INSERT INTO Reservation (guest_id, room_id, start_date, end_date, status)
VALUES
(7, 27, '2025-03-07', '2025-03-09', 'Booked'),
(8, 28, '2025-03-08', '2025-03-10', 'Booked');

-- Inexpensive Stay Inn (reservations)
INSERT INTO Reservation (guest_id, room_id, start_date, end_date, status)
VALUES
(9, 29, '2025-03-09', '2025-03-11', 'Booked'),
(10, 30, '2025-03-10', '2025-03-12', 'Booked');

-- Oceanic Bay Resort (rentals)
INSERT INTO Rental (reservation_id, guest_id, room_id, employee_id, checkin_date, checkout_date)
VALUES
(1, 1, 1, 1, '2025-03-01', '2025-03-03'),
(2, 2, 2, 2, '2025-03-02', '2025-03-04');

-- Mountain Retreat (rentals)
INSERT INTO Rental (reservation_id, guest_id, room_id, employee_id, checkin_date, checkout_date)
VALUES
(3, 3, 3, 3, '2025-03-03', '2025-03-05'),
(4, 4, 4, 4, '2025-03-04', '2025-03-06');

-- Skyline Tower (rentals)
INSERT INTO Rental (reservation_id, guest_id, room_id, employee_id, checkin_date, checkout_date)
VALUES
(5, 5, 5, 5, '2025-03-05', '2025-03-07'),
(6, 6, 6, 6, '2025-03-06', '2025-03-08');

-- Golden Sands Resort (rentals)
INSERT INTO Rental (reservation_id, guest_id, room_id, employee_id, checkin_date, checkout_date)
VALUES
(7, 7, 7, 7, '2025-03-07', '2025-03-09'),
(8, 8, 8, 8, '2025-03-08', '2025-03-10');

-- Inexpensive Stay Inn (rentals)
INSERT INTO Rental (reservation_id, guest_id, room_id, employee_id, checkin_date, checkout_date)
VALUES
(9, 9, 9, 9, '2025-03-09', '2025-03-11'),
(10, 10, 10, 10, '2025-03-10', '2025-03-12');

CREATE INDEX idx_room_price ON Room(price);
CREATE INDEX idx_reservation_status ON Reservation(status);
CREATE INDEX idx_hotel_name ON Hotel(name);

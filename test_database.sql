
-- Test Database Table Creation
CREATE TABLE items(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2),
    category VARCHAR(50),
    email VARCHAR(100),
    phone VARCHAR(20),
    created_date DATE,
    is_active BOOLEAN,
    quantity INT,
    rating DECIMAL(3, 2)
);

-- Insert 100 random test records

INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (1, 'Item_001_zY70eYvk', 'Random description for item 1 with features: s8TIFyVlAbsQ0DQdNpa2', 422.85, 'Food & Beverage', 'ITgRY@hotmail.com', '+1-411-132-2855', '2023-03-07', False, 427, 1.92);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (2, 'Item_002_JVNY6lpQ', 'Random description for item 2 with features: crlHG0xDBX8edb4qCxKq', 492.55, 'Home & Garden', 'ALMmYeSv@gmail.com', '+1-941-830-9290', '2022-11-03', False, 414, 2.22);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (3, 'Item_003_pOo9xB46', 'Random description for item 3 with features: qqEUljN1pPaEre868Jvm', 574.24, 'Home & Garden', 'rvKBUlUsAgY@yahoo.com', '+1-948-315-4865', '2021-01-14', True, 90, 2.85);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (4, 'Item_004_zxAyQmF8', 'Random description for item 4 with features: bBD3j7NtAypFMgzYnR1z', 431.29, 'Books', 'mhdz0mnZLM@gmail.com', '+1-752-700-3605', '2023-02-21', True, 780, 2.37);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (5, 'Item_005_bzthSioS', 'Random description for item 5 with features: E2M18QIHovIsmaPHsky0', 119.4, 'Electronics', 'SIviOinVZ1@gmail.com', '+1-570-969-9213', '2021-08-11', True, 191, 1.78);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (6, 'Item_006_TSziHcki', 'Random description for item 6 with features: wqHXeAH5KwjHUDDRBnxe', 124.95, 'Food & Beverage', 'p03oaAc6G@company.com', '+1-750-704-9645', '2024-04-21', True, 550, 3.71);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (7, 'Item_007_OeEvTKh5', 'Random description for item 7 with features: 3BaWfkyjmlWgROPPyZP9', 284.72, 'Home & Garden', 'MWb2k5u8JlQ@hotmail.com', '+1-283-586-6893', '2021-07-14', False, 109, 2.18);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (8, 'Item_008_ZeoSpp0z', 'Random description for item 8 with features: 9U7WHBPebFYQS6hgyq5U', 735.36, 'Sports', 'RZy32@gmail.com', '+1-180-926-9621', '2021-04-01', False, 553, 2.76);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (9, 'Item_009_3sdRj4wR', 'Random description for item 9 with features: EKWIWwmWL0drss5jPuVu', 500.2, 'Toys', 'ZEvMlncBlMo@hotmail.com', '+1-493-808-4119', '2020-06-07', False, 78, 4.24);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (10, 'Item_010_pxntXEyz', 'Random description for item 10 with features: en1gRrnKHf2LwpQfJOnS', 109.38, 'Toys', 'ntNk4x4i@company.com', '+1-687-913-5504', '2021-07-25', True, 270, 3.04);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (11, 'Item_011_OfvWAgk4', 'Random description for item 11 with features: 4Ewp7zUGqJGgqFjnrn4x', 595.14, 'Electronics', 'JwZQJF@company.com', '+1-385-656-8860', '2023-01-24', False, 810, 4.08);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (12, 'Item_012_c7Wgeq3c', 'Random description for item 12 with features: gqrd3XrQEnbNdsmaJV6k', 212.34, 'Food & Beverage', 'phkCf58L@gmail.com', '+1-999-197-7040', '2024-10-20', False, 720, 1.56);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (13, 'Item_013_kCFAmbtt', 'Random description for item 13 with features: b5cgbdRUxUA9ZsLNxI7v', 724.37, 'Books', 'mzpZdE@yahoo.com', '+1-893-497-7093', '2021-09-29', False, 496, 3.55);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (14, 'Item_014_zrgz4Fx1', 'Random description for item 14 with features: CUp5CIbqimKJHRRT6usH', 311.42, 'Clothing', 'xkuwg9yJvw@company.com', '+1-115-571-6775', '2021-10-26', False, 732, 1.71);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (15, 'Item_015_FtvZUQ1K', 'Random description for item 15 with features: 5ZKdW4k78FDFrfUwc9Kw', 61.64, 'Books', 'jJ3gU@yahoo.com', '+1-906-462-2724', '2020-11-22', True, 206, 2.7);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (16, 'Item_016_IIneANyR', 'Random description for item 16 with features: QZ37oTyjEuRsjbcL9bBX', 251.29, 'Electronics', '0Wu6wc69Mk@gmail.com', '+1-619-626-2269', '2020-12-11', True, 236, 1.09);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (17, 'Item_017_7LKkgcv4', 'Random description for item 17 with features: CCmB2YZgKoAJhoqXqwz7', 910.06, 'Home & Garden', '56qihM@hotmail.com', '+1-794-372-4958', '2020-01-21', True, 651, 4.24);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (18, 'Item_018_iTyccmPh', 'Random description for item 18 with features: I8KS4rSRs2ECVTZnMkJM', 888.15, 'Toys', 'wD0eaYhGzR1@gmail.com', '+1-313-593-6657', '2024-04-02', True, 739, 4.59);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (19, 'Item_019_8yzFj6YG', 'Random description for item 19 with features: GiJ0WKAorTLPuOolFwdL', 905.18, 'Sports', 'us5L8A14Gzgf@yahoo.com', '+1-789-411-3456', '2024-12-18', False, 681, 3.79);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (20, 'Item_020_OmyXqtP8', 'Random description for item 20 with features: xk8jjF71GFlzGgTgK6In', 502.93, 'Office Supplies', '5rEDrSd95@yahoo.com', '+1-546-896-3267', '2021-09-28', False, 319, 3.98);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (21, 'Item_021_XMsTbmlx', 'Random description for item 21 with features: lelrte0GSq8dTUpRsYim', 650.9, 'Food & Beverage', 'HpN7qXHZCU1@hotmail.com', '+1-302-842-8289', '2022-12-31', False, 707, 4.66);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (22, 'Item_022_KBYu00A0', 'Random description for item 22 with features: cx1lU4YIYutyMj1K1Ifu', 832.66, 'Electronics', 'lAEzTu0eSn@company.com', '+1-691-615-9739', '2022-04-05', False, 179, 1.73);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (23, 'Item_023_4oRNPvNf', 'Random description for item 23 with features: 9pNQpzBaVPLcsAKFikuC', 13.55, 'Books', 'kVUGrDZjnYN@yahoo.com', '+1-719-760-1566', '2022-05-09', False, 622, 1.65);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (24, 'Item_024_4nADei6P', 'Random description for item 24 with features: QiCXvWRqevgdqfYV3Isa', 660.23, 'Electronics', 'UjRfpCk46cs@company.com', '+1-675-435-3254', '2023-12-05', True, 381, 4.68);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (25, 'Item_025_MD4Aph6V', 'Random description for item 25 with features: w2aIFyZsCSmm1pZayi9B', 354.22, 'Home & Garden', 'klHiuZ@hotmail.com', '+1-785-331-7784', '2023-03-17', False, 921, 2.27);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (26, 'Item_026_UZnlSWwI', 'Random description for item 26 with features: XNJR3CrI240J6L2TUp3Q', 580.29, 'Office Supplies', 'qTAocad@outlook.com', '+1-324-977-5796', '2021-06-14', False, 823, 3.73);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (27, 'Item_027_CHYVJ7Dt', 'Random description for item 27 with features: 2rCJEL78LlhyGJAs5q5W', 999.92, 'Clothing', 'aAI6qMT@yahoo.com', '+1-690-191-9516', '2021-10-05', False, 505, 1.63);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (28, 'Item_028_N4ioPiJl', 'Random description for item 28 with features: 4N7yvDnWjkgT8gfMFznj', 748.98, 'Health & Beauty', 'I1pHKK@outlook.com', '+1-726-907-3748', '2023-06-16', True, 176, 2.97);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (29, 'Item_029_e0ElMdTG', 'Random description for item 29 with features: Cy69Tpm1U8D1Pr94L6na', 575.88, 'Clothing', 'kdJyEp3AL@gmail.com', '+1-292-897-7701', '2024-04-10', True, 441, 1.19);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (30, 'Item_030_Omp69f9Q', 'Random description for item 30 with features: hhEcyQY0EGzIiEg4jnU1', 773.24, 'Health & Beauty', 'eHg5Clfwta0I@yahoo.com', '+1-593-557-7697', '2021-04-16', False, 933, 2.19);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (31, 'Item_031_Aqwx9T4P', 'Random description for item 31 with features: oHEl3qF2coL2cSY4QWFW', 800.09, 'Books', 'WQ58w@yahoo.com', '+1-957-968-9741', '2020-12-18', False, 713, 3.36);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (32, 'Item_032_Aw8J0ak8', 'Random description for item 32 with features: a5PTGdDJBNdIC5TPhjhU', 195.14, 'Clothing', 'X1JpRlqvfWhV@hotmail.com', '+1-680-850-7812', '2021-06-23', True, 30, 1.35);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (33, 'Item_033_THwKkq30', 'Random description for item 33 with features: CW2tpKJ6Sq0Jg0BbtOLH', 811.1, 'Home & Garden', 'SfcWVjy3u@gmail.com', '+1-232-831-4010', '2020-08-17', True, 631, 4.02);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (34, 'Item_034_lemknGXQ', 'Random description for item 34 with features: xBE7Iqbl90gBAGYVAt9t', 865.79, 'Clothing', 'iQjDeuk@yahoo.com', '+1-605-279-4862', '2021-06-21', False, 294, 3.13);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (35, 'Item_035_WekNbpXp', 'Random description for item 35 with features: Gush54xqQnkc5qpbtwfs', 453.25, 'Office Supplies', 'AcbhB@hotmail.com', '+1-874-218-1411', '2021-01-05', False, 379, 2.76);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (36, 'Item_036_RGHp3tKg', 'Random description for item 36 with features: EvBsMx54UPdxkr6QeQQS', 973.63, 'Food & Beverage', 'xmhcZvFGqqsL@gmail.com', '+1-561-752-3103', '2024-02-12', True, 917, 2.41);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (37, 'Item_037_LMO4k2tG', 'Random description for item 37 with features: fDlKyrRipzxoy2fOdfbR', 915.12, 'Sports', 'sN4G1@yahoo.com', '+1-835-852-2913', '2022-05-25', False, 901, 2.33);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (38, 'Item_038_RJu24TXr', 'Random description for item 38 with features: 0CZSErb7AevJtiFFIlgJ', 559.03, 'Electronics', 'DHKubwN@yahoo.com', '+1-770-494-9283', '2024-11-09', True, 160, 3.14);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (39, 'Item_039_8riX7EYE', 'Random description for item 39 with features: OdDo4TZJeQ2b4bJY7Pkd', 208.04, 'Health & Beauty', 'MP2w1Ruu@yahoo.com', '+1-975-651-9932', '2022-01-07', True, 522, 3.56);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (40, 'Item_040_LJMY9bpV', 'Random description for item 40 with features: Sn2ChnVq1yFZx9Pos7ut', 236.11, 'Health & Beauty', 'snEhbJ@hotmail.com', '+1-221-720-6136', '2024-08-25', False, 198, 2.1);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (41, 'Item_041_lNfAlCcZ', 'Random description for item 41 with features: Y05ZaQtjnmEChT5uN8xg', 90.46, 'Office Supplies', 'F7puTM@outlook.com', '+1-465-724-1004', '2022-04-22', True, 155, 1.38);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (42, 'Item_042_hp4qH6te', 'Random description for item 42 with features: LbnLnXSQEAnZ1XPidSJ0', 739.72, 'Food & Beverage', 'YMV0Vm9s@hotmail.com', '+1-239-745-4491', '2020-09-18', True, 132, 4.4);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (43, 'Item_043_n8y6ylW4', 'Random description for item 43 with features: NltEbDeDAFAkJGPiDT2V', 785.75, 'Home & Garden', 'HAryg@company.com', '+1-548-480-6537', '2023-04-25', True, 876, 3.68);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (44, 'Item_044_tJhOb8a4', 'Random description for item 44 with features: tZNeUsMiD9DWqbVkiGB7', 230.53, 'Food & Beverage', 'U6kaOYj@hotmail.com', '+1-725-654-8157', '2023-01-07', True, 508, 4.85);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (45, 'Item_045_7S7uCnCh', 'Random description for item 45 with features: q6S14TBaf5F3VFiSyKJm', 845.11, 'Food & Beverage', 'Lptxe0W@hotmail.com', '+1-184-319-1344', '2022-12-03', False, 931, 4.99);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (46, 'Item_046_4OTmKtHy', 'Random description for item 46 with features: kJdK2irSykr8Qo0f71c1', 779.97, 'Electronics', 'd9xwg7Z@yahoo.com', '+1-340-270-2760', '2020-03-31', True, 253, 4.82);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (47, 'Item_047_VVS9TfMu', 'Random description for item 47 with features: oZpG5fBMwUcey678foR2', 931.53, 'Health & Beauty', '2R1HpTcpd32E@outlook.com', '+1-704-454-3813', '2023-09-04', False, 198, 4.4);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (48, 'Item_048_hl2NnuNX', 'Random description for item 48 with features: FzXIZ89dDRzfxzMSL3tD', 758.47, 'Books', 'tCi0pq1BEusV@hotmail.com', '+1-715-201-9498', '2023-01-10', False, 355, 1.65);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (49, 'Item_049_VH5gRBP1', 'Random description for item 49 with features: w87xNtJITdjMqZ7vmJTG', 997.91, 'Books', 'ZPHv5Q@hotmail.com', '+1-695-439-5515', '2023-04-21', False, 90, 2.94);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (50, 'Item_050_VOYrP0Ys', 'Random description for item 50 with features: CPEjFZAHgkUAfyVpRgxs', 807.28, 'Office Supplies', 'gbGB7JCO@company.com', '+1-638-144-9855', '2021-10-30', True, 782, 3.55);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (51, 'Item_051_90B5Cd7m', 'Random description for item 51 with features: xaC9N9Oho03qtlfcy7bo', 242.48, 'Electronics', 'pHQdW1ij@yahoo.com', '+1-223-620-8402', '2024-07-12', True, 216, 3.01);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (52, 'Item_052_ptC1V10H', 'Random description for item 52 with features: O0Psvbzk04YQJhJfWsuU', 997.77, 'Sports', 'PcnOyi@outlook.com', '+1-664-701-9134', '2022-06-14', False, 960, 2.09);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (53, 'Item_053_eGkVvu1D', 'Random description for item 53 with features: wICEL77x8S3eMJMFIEPQ', 351.71, 'Health & Beauty', 'p6eCrv3q0B@hotmail.com', '+1-916-824-1123', '2022-12-10', True, 766, 4.7);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (54, 'Item_054_6230lmdp', 'Random description for item 54 with features: l7gyumt0Z0BcHn0mMIZi', 601.59, 'Electronics', 'A572L@gmail.com', '+1-206-188-2767', '2020-10-30', False, 420, 4.14);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (55, 'Item_055_fSXgKtme', 'Random description for item 55 with features: CbkcJemaJrOKvVnryyLV', 516.79, 'Health & Beauty', 'G1Ja2J@yahoo.com', '+1-174-902-5257', '2022-09-11', False, 59, 4.74);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (56, 'Item_056_TlSkyK0n', 'Random description for item 56 with features: 790myMV3wMiBqOd0plPV', 420.31, 'Electronics', 'BglY1Go@company.com', '+1-944-970-1337', '2021-10-12', True, 894, 2.79);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (57, 'Item_057_PuNnY8XH', 'Random description for item 57 with features: mVzJpTTJgZhMIDz74ASa', 687.33, 'Food & Beverage', '6qU00@gmail.com', '+1-609-782-9602', '2021-05-21', False, 796, 2.82);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (58, 'Item_058_WXSL8WKI', 'Random description for item 58 with features: il77f9VbwCcH3Rv4tytP', 56.82, 'Clothing', 'yNDOYmZP4Dcn@yahoo.com', '+1-727-191-9013', '2020-11-06', False, 627, 4.17);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (59, 'Item_059_iGlP9OAt', 'Random description for item 59 with features: BKoZeVkKIoKlVnuQE9rl', 19.71, 'Office Supplies', 'FNYgZlZdJhvI@outlook.com', '+1-167-150-9712', '2023-07-30', False, 858, 2.06);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (60, 'Item_060_Inh20Iuu', 'Random description for item 60 with features: HthilLQZWvoe0VWDhMz6', 596.37, 'Electronics', 'MOYfLZ@company.com', '+1-580-161-8159', '2024-05-31', False, 266, 3.15);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (61, 'Item_061_zaACnZas', 'Random description for item 61 with features: LGZtV3UNO3UejfXRjzTX', 396.27, 'Books', 'p7T0oQa@yahoo.com', '+1-341-653-2609', '2022-12-10', True, 803, 2.6);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (62, 'Item_062_CBlJKZt6', 'Random description for item 62 with features: ga2YzfqKl2hFsl3mKkX0', 280.45, 'Electronics', 'exiTqrG6SPX@hotmail.com', '+1-305-718-6850', '2023-02-14', True, 975, 4.39);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (63, 'Item_063_GvaUFBjt', 'Random description for item 63 with features: o1j8JbC7X1ApIgyTkIo9', 814.33, 'Office Supplies', '8VRcDpsssr@outlook.com', '+1-746-328-6049', '2020-11-23', False, 560, 4.05);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (64, 'Item_064_UXhTOqeT', 'Random description for item 64 with features: spN0uFYTZW6njqvwAKJT', 140.83, 'Home & Garden', 'aFFrG0cU@gmail.com', '+1-699-994-9813', '2020-10-24', False, 426, 2.75);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (65, 'Item_065_kwEGAL26', 'Random description for item 65 with features: PRbKhZ6iyK7K6TjYLPDA', 996.22, 'Clothing', 'xdYZJ@gmail.com', '+1-419-385-5020', '2020-05-12', True, 88, 2.17);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (66, 'Item_066_n5mbnNKP', 'Random description for item 66 with features: vxfiWkeuFh9EZrZ1a7AI', 119.18, 'Food & Beverage', 'wrAHm@company.com', '+1-459-916-8070', '2022-11-25', True, 100, 4.66);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (67, 'Item_067_82Wk6n9w', 'Random description for item 67 with features: QRdLUYw8x3LUsJG7QYSh', 846.08, 'Toys', 'pdXKS7w@hotmail.com', '+1-846-671-2575', '2022-11-30', False, 793, 1.77);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (68, 'Item_068_F7DRBzHb', 'Random description for item 68 with features: oBbqQYTnmBRCVG9DTfwr', 378.22, 'Clothing', 'xRcX2H2y@gmail.com', '+1-489-122-6375', '2023-06-13', True, 909, 2.06);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (69, 'Item_069_rPgHqhrr', 'Random description for item 69 with features: REns7bTdOqikl3qWOTUp', 483.12, 'Office Supplies', 'Fi682LBhi@yahoo.com', '+1-653-160-8120', '2022-02-25', False, 854, 1.08);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (70, 'Item_070_X2SnaM8T', 'Random description for item 70 with features: lWifC2Gic0Xuvq5vsYu0', 108.17, 'Food & Beverage', 'H1zmzFW4F@outlook.com', '+1-656-341-6097', '2022-10-01', False, 413, 3.36);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (71, 'Item_071_62ZxdsmF', 'Random description for item 71 with features: cJeG10NSLGhOCz4YreNg', 426.35, 'Toys', '392vFwEJcct@outlook.com', '+1-385-921-2745', '2020-09-22', True, 491, 2.42);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (72, 'Item_072_AOcTs0dN', 'Random description for item 72 with features: Bqoj6okJaUpDP1gXENnW', 964.3, 'Office Supplies', 'UVOEl@company.com', '+1-988-566-9211', '2022-07-10', True, 321, 2.99);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (73, 'Item_073_iOysXh2y', 'Random description for item 73 with features: mIIpOGpqyZCT8XGrZwNi', 503.85, 'Electronics', 'gMaZDsqmfJcU@hotmail.com', '+1-254-292-9571', '2023-06-16', False, 52, 2.01);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (74, 'Item_074_R89AdiSu', 'Random description for item 74 with features: FU3XDENECoxOt4q6aV70', 41.32, 'Office Supplies', 'bR5B4WUP@gmail.com', '+1-252-170-1833', '2023-07-05', True, 313, 4.07);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (75, 'Item_075_wwqR3EAB', 'Random description for item 75 with features: fZPpXRzLt2s6gD7A9cqy', 616.81, 'Toys', 'LM5kmzHoh7Zd@gmail.com', '+1-869-199-6348', '2020-07-15', False, 488, 3.6);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (76, 'Item_076_qInAPksb', 'Random description for item 76 with features: GF8r1aldM8YrKI8Cj16D', 71.7, 'Toys', 'InNGVQ1I@gmail.com', '+1-144-688-5375', '2023-10-12', False, 879, 2.8);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (77, 'Item_077_mNHkTBMI', 'Random description for item 77 with features: 0xK5p10cosNVRsnGZAZV', 988.48, 'Clothing', '1xBrgFgdd9ig@hotmail.com', '+1-234-182-9515', '2020-03-13', True, 794, 3.18);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (78, 'Item_078_x6JvbO8I', 'Random description for item 78 with features: G8N4llIM2xCHVoynqXqk', 202.81, 'Books', 'mjkCyEi@hotmail.com', '+1-452-476-2816', '2023-05-08', True, 391, 2.04);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (79, 'Item_079_NtQFL0pN', 'Random description for item 79 with features: vIY4UQ1qXnjQlGN9FEiZ', 768.02, 'Books', '7sMybR@hotmail.com', '+1-718-453-5290', '2023-04-06', False, 546, 1.05);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (80, 'Item_080_CldLgi15', 'Random description for item 80 with features: a9AgNMmuFmQTFN2E3H9j', 892.11, 'Office Supplies', '4FBSnJz@hotmail.com', '+1-788-406-1590', '2020-05-06', False, 197, 2.21);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (81, 'Item_081_chDA20Nt', 'Random description for item 81 with features: I3FDMCbHwbLP6Benj6Ff', 39.22, 'Clothing', 'CWqod8oRK4tW@hotmail.com', '+1-212-890-2694', '2022-03-12', False, 175, 3.82);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (82, 'Item_082_z1FlFCUd', 'Random description for item 82 with features: 9iZQjH6IAXGhYxp0hcm3', 851.62, 'Office Supplies', 'ERAFmyxXf4@company.com', '+1-548-195-7357', '2022-11-16', False, 291, 4.1);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (83, 'Item_083_T1LTKX9l', 'Random description for item 83 with features: 5XyJGVd8wnU3AotUS29l', 711.34, 'Food & Beverage', 'Pdrgnp@company.com', '+1-826-606-4208', '2021-09-08', False, 335, 4.88);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (84, 'Item_084_nI2RzMFb', 'Random description for item 84 with features: wi1nz2P8b7xw0zCz2YMr', 813.03, 'Books', 'CkyveIya2@company.com', '+1-337-691-4537', '2022-06-19', False, 909, 1.9);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (85, 'Item_085_1xBfxKFc', 'Random description for item 85 with features: 3z4mLvPFOmGYD6n4R6eV', 894.49, 'Sports', 'BEHMU1Qyp@yahoo.com', '+1-298-369-7378', '2021-02-15', False, 688, 2.31);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (86, 'Item_086_09EG2Dbw', 'Random description for item 86 with features: C9IIC38rjqWqOnaf0rUV', 608.46, 'Clothing', 'JNclov7wme0o@yahoo.com', '+1-302-667-1079', '2022-06-11', False, 87, 4.47);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (87, 'Item_087_2TyZlx5M', 'Random description for item 87 with features: cIHYYByJPBV5aN6FKgfh', 605.76, 'Health & Beauty', '065JmU4E@company.com', '+1-429-887-2399', '2023-05-31', True, 379, 4.17);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (88, 'Item_088_NQNFGdzk', 'Random description for item 88 with features: nuZvCS1skB8uXDK5BCbq', 761.41, 'Food & Beverage', 'VEpdoeZ65q8W@outlook.com', '+1-230-184-5964', '2022-10-19', False, 778, 3.1);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (89, 'Item_089_j8uINBQ6', 'Random description for item 89 with features: ytcsaEjlQB9WUhB2oFOO', 404.43, 'Books', 'JKxVdfXs4RO@yahoo.com', '+1-881-489-6440', '2022-11-07', True, 839, 3.13);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (90, 'Item_090_8BYs8ybN', 'Random description for item 90 with features: IMm1CnDjnpw1ISFYJW0l', 52.73, 'Sports', 'iSaXsHF@yahoo.com', '+1-369-241-3282', '2020-03-19', False, 287, 4.63);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (91, 'Item_091_s9ZBGYhf', 'Random description for item 91 with features: ZPEJSoaUUmb1bhHnC9nw', 843.3, 'Home & Garden', 'AB0w5@hotmail.com', '+1-458-942-1060', '2023-01-13', True, 840, 3.98);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (92, 'Item_092_0MtGdKNM', 'Random description for item 92 with features: xUi8jsEPTjWdGkENRpLU', 640.8, 'Clothing', 'UP3v9@outlook.com', '+1-313-663-2079', '2021-01-17', True, 464, 1.79);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (93, 'Item_093_xck4dYRM', 'Random description for item 93 with features: LH29nvxEg6LdVz27WwzA', 958.92, 'Toys', 'x0lqQ3@outlook.com', '+1-424-849-9532', '2022-03-08', False, 415, 2.89);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (94, 'Item_094_VqNinfdm', 'Random description for item 94 with features: M6U2fh9gLyB2ycZfevVi', 886.39, 'Home & Garden', '5Kpbno@hotmail.com', '+1-918-357-8037', '2022-09-26', True, 507, 3.78);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (95, 'Item_095_WxjT7MRL', 'Random description for item 95 with features: 4K2JMUsXJUrQCeJdRKdD', 149.58, 'Books', 'LwbL6@gmail.com', '+1-267-692-8951', '2020-04-27', True, 794, 4.72);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (96, 'Item_096_t3zs6jQz', 'Random description for item 96 with features: ae7bXmatkFsKXXW01SZR', 699.85, 'Office Supplies', 'VGhfmD@yahoo.com', '+1-519-749-2410', '2021-06-12', False, 769, 4.24);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (97, 'Item_097_UoiDHpUd', 'Random description for item 97 with features: ROqj0skm9KpKEFVFoixc', 554.85, 'Clothing', 'cs6XZ4AT@company.com', '+1-379-137-6078', '2024-04-12', False, 600, 4.09);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (98, 'Item_098_aVJukZw5', 'Random description for item 98 with features: gXE4hYD7STBXzEXB4wTv', 956.88, 'Office Supplies', 'ykHYPOG@outlook.com', '+1-756-327-1324', '2021-07-01', False, 566, 1.67);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (99, 'Item_099_fG1gy6n9', 'Random description for item 99 with features: 2BUhPn4dm1tmTEbgaAat', 333.56, 'Food & Beverage', 'pR236ue@company.com', '+1-273-581-1450', '2021-02-05', False, 246, 4.13);
INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES (100, 'Item_100_IEWIkplL', 'Random description for item 100 with features: HHt1mpR7uVv5d1fuiqdN', 967.76, 'Food & Beverage', 'tj5JGs@company.com', '+1-425-225-3676', '2022-10-22', True, 586, 2.57);
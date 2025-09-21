#!/usr/bin/env python3
"""
Test Database Generator
Creates SQL code for a single table with 100 random items
"""

import random
import string
from datetime import datetime, timedelta

def generate_random_string(length=10):
    """Generate a random string of specified length"""
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

def generate_random_email():
    """Generate a random email address"""
    domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'company.com']
    username = generate_random_string(random.randint(5, 12))
    domain = random.choice(domains)
    return f"{username}@{domain}"

def generate_random_phone():
    """Generate a random phone number"""
    return f"+1-{random.randint(100, 999)}-{random.randint(100, 999)}-{random.randint(1000, 9999)}"

def generate_random_date(start_year=2020, end_year=2024):
    """Generate a random date between start_year and end_year"""
    start_date = datetime(start_year, 1, 1)
    end_date = datetime(end_year, 12, 31)
    time_between = end_date - start_date
    days_between = time_between.days
    random_days = random.randint(0, days_between)
    return start_date + timedelta(days=random_days)

def generate_sql_database():
    """Generate complete SQL database with table creation and 100 random records"""
    
    # SQL for table creation
    create_table_sql = """
-- Test Database Table Creation
CREATE TABLE itemssssssssss (
    id INT PRIMARY KEY AUTO_INCREMENT,
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

"""
    
    # Categories for realistic data
    categories = [
        'Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports',
        'Toys', 'Automotive', 'Health & Beauty', 'Food & Beverage', 'Office Supplies'
    ]
    
    # Generate 100 random records
    insert_statements = []
    insert_statements.append("-- Insert 100 random test records\n")
    
    for i in range(1, 101):
        # Generate random data
        name = f"Item_{i:03d}_{generate_random_string(8)}"
        description = f"Random description for item {i} with features: {generate_random_string(20)}"
        price = round(random.uniform(10.00, 999.99), 2)
        category = random.choice(categories)
        email = generate_random_email()
        phone = generate_random_phone()
        created_date = generate_random_date()
        is_active = random.choice([True, False])
        quantity = random.randint(0, 1000)
        rating = round(random.uniform(1.0, 5.0), 2)
        
        # Create INSERT statement
        insert_sql = f"""INSERT INTO items (id, name, description, price, category, email, phone, created_date, is_active, quantity, rating) 
VALUES ({i}, '{name}', '{description}', {price}, '{category}', '{email}', '{phone}', '{created_date.strftime('%Y-%m-%d')}', {is_active}, {quantity}, {rating});"""
        
        insert_statements.append(insert_sql)
    
    # Combine all SQL
    complete_sql = create_table_sql + "\n".join(insert_statements)
    
    return complete_sql

def main():
    """Main function to generate and save SQL database"""
    print("Generating test database with 100 random items...")
    
    # Generate the SQL
    sql_content = generate_sql_database()
    
    # Save to file
    output_file = "test_database.sql"
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(sql_content)
    
    print(f"✅ Database generated successfully!")
    print(f"📁 SQL file saved as: {output_file}")
    print(f"📊 Contains: 1 table with 100 random records")
    print(f"🔧 Table includes: id, name, description, price, category, email, phone, created_date, is_active, quantity, rating")
    
    # Also print a preview
    print("\n" + "="*50)
    print("SQL PREVIEW (first 5 lines):")
    print("="*50)
    lines = sql_content.split('\n')
    for i, line in enumerate(lines[:10]):
        print(f"{i+1:2d}| {line}")

if __name__ == "__main__":
    main()

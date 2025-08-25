
#!/usr/bin/env python
import os
import sys
import subprocess
from datetime import datetime

def export_database():
    """Export database schema and data for local setup"""
    
    # Get database URL from environment
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        print("Error: DATABASE_URL environment variable not found")
        return False
    
    # Create timestamp for filename
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    
    # Export schema only
    schema_file = f"database_schema_{timestamp}.sql"
    print(f"Exporting database schema to {schema_file}...")
    
    try:
        # Export schema only (no data)
        schema_cmd = [
            'pg_dump',
            '--schema-only',
            '--no-owner',
            '--no-privileges',
            '--clean',
            '--if-exists',
            database_url
        ]
        
        with open(schema_file, 'w') as f:
            result = subprocess.run(schema_cmd, stdout=f, stderr=subprocess.PIPE, text=True)
            if result.returncode != 0:
                print(f"Error exporting schema: {result.stderr}")
                return False
        
        print(f"✓ Schema exported successfully to {schema_file}")
        
        # Export data only
        data_file = f"database_data_{timestamp}.sql"
        print(f"Exporting database data to {data_file}...")
        
        data_cmd = [
            'pg_dump',
            '--data-only',
            '--no-owner',
            '--no-privileges',
            '--column-inserts',
            database_url
        ]
        
        with open(data_file, 'w') as f:
            result = subprocess.run(data_cmd, stdout=f, stderr=subprocess.PIPE, text=True)
            if result.returncode != 0:
                print(f"Error exporting data: {result.stderr}")
                return False
        
        print(f"✓ Data exported successfully to {data_file}")
        
        # Export complete dump
        complete_file = f"database_complete_{timestamp}.sql"
        print(f"Exporting complete database to {complete_file}...")
        
        complete_cmd = [
            'pg_dump',
            '--no-owner',
            '--no-privileges',
            '--clean',
            '--if-exists',
            '--column-inserts',
            database_url
        ]
        
        with open(complete_file, 'w') as f:
            result = subprocess.run(complete_cmd, stdout=f, stderr=subprocess.PIPE, text=True)
            if result.returncode != 0:
                print(f"Error exporting complete database: {result.stderr}")
                return False
        
        print(f"✓ Complete database exported successfully to {complete_file}")
        
        print("\n" + "="*50)
        print("DATABASE EXPORT COMPLETED")
        print("="*50)
        print(f"Files created:")
        print(f"  - {schema_file} (schema only)")
        print(f"  - {data_file} (data only)")
        print(f"  - {complete_file} (complete database)")
        print("\nTo import in your local PostgreSQL:")
        print(f"  psql -d your_local_database < {complete_file}")
        
        return True
        
    except Exception as e:
        print(f"Error during export: {str(e)}")
        return False

if __name__ == '__main__':
    if export_database():
        sys.exit(0)
    else:
        sys.exit(1)

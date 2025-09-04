
#!/usr/bin/env python
import os
import sys
import django

# Setup Django environment
sys.path.append(os.path.dirname(__file__))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'soar_backend.settings')
django.setup()

from api.models import Lead, Opportunity

def update_existing_leads():
    """Update existing leads that have opportunities to set moved_to_opportunity=True"""
    
    # Get all leads that have opportunities but don't have moved_to_opportunity set
    leads_with_opportunities = Lead.objects.filter(
        opportunity__isnull=False,
        moved_to_opportunity=False
    )
    
    count = leads_with_opportunities.count()
    print(f"Found {count} leads that have opportunities but moved_to_opportunity=False")
    
    if count > 0:
        # Update them
        updated = leads_with_opportunities.update(moved_to_opportunity=True)
        print(f"Updated {updated} leads to set moved_to_opportunity=True")
    
    # Verify the update
    total_opportunities = Opportunity.objects.count()
    total_moved_flags = Lead.objects.filter(moved_to_opportunity=True).count()
    
    print(f"Total opportunities: {total_opportunities}")
    print(f"Total leads with moved_to_opportunity=True: {total_moved_flags}")
    
    if total_opportunities == total_moved_flags:
        print("✅ All leads with opportunities now have moved_to_opportunity=True")
    else:
        print("⚠️  Mismatch detected - some opportunities might not have corresponding moved_to_opportunity flags")

if __name__ == "__main__":
    update_existing_leads()

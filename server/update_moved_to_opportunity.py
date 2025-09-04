
#!/usr/bin/env python
import os
import sys
import django

# Setup Django environment
sys.path.append(os.path.dirname(__file__))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'soar_backend.settings')
django.setup()

from api.models import Lead, Opportunity

def sync_moved_to_opportunity():
    """Sync moved_to_opportunity field with actual opportunities in database"""
    
    print("Starting comprehensive moved_to_opportunity synchronization...")
    
    # Get all leads
    all_leads = Lead.objects.all()
    updated_count = 0
    
    for lead in all_leads:
        # Check if this lead has an opportunity in the database
        has_opportunity_in_db = Opportunity.objects.filter(lead=lead).exists()
        
        # Check if the field value matches the database state
        if has_opportunity_in_db != lead.moved_to_opportunity:
            old_value = lead.moved_to_opportunity
            lead.moved_to_opportunity = has_opportunity_in_db
            lead.save(update_fields=['moved_to_opportunity'])
            updated_count += 1
            
            status = "moved to opportunity" if has_opportunity_in_db else "not moved to opportunity"
            print(f"Updated lead {lead.id} ({lead.company.name}): {old_value} -> {has_opportunity_in_db} ({status})")
    
    # Validation and summary
    total_leads = all_leads.count()
    total_opportunities = Opportunity.objects.count()
    leads_with_flag = Lead.objects.filter(moved_to_opportunity=True).count()
    
    print(f"\n=== SYNCHRONIZATION COMPLETE ===")
    print(f"Total leads: {total_leads}")
    print(f"Total opportunities: {total_opportunities}")
    print(f"Leads with moved_to_opportunity=True: {leads_with_flag}")
    print(f"Updated leads: {updated_count}")
    
    if total_opportunities == leads_with_flag:
        print("✅ All data is now synchronized!")
    else:
        print("⚠️  Investigating potential mismatches...")
    
    # Detailed validation
    leads_with_flag_but_no_opp = Lead.objects.filter(moved_to_opportunity=True).exclude(
        id__in=Opportunity.objects.values_list('lead_id', flat=True)
    )
    
    opportunities_without_flag = Opportunity.objects.exclude(
        lead__moved_to_opportunity=True
    )
    
    if leads_with_flag_but_no_opp.exists():
        print(f"❌ Found {leads_with_flag_but_no_opp.count()} leads with moved_to_opportunity=True but no opportunity record:")
        for lead in leads_with_flag_but_no_opp:
            print(f"  - Lead {lead.id}: {lead.company.name}")
    
    if opportunities_without_flag.exists():
        print(f"❌ Found {opportunities_without_flag.count()} opportunities where lead has moved_to_opportunity=False:")
        for opp in opportunities_without_flag:
            print(f"  - Opportunity {opp.id}: {opp.name} (Lead {opp.lead.id})")
    
    if not leads_with_flag_but_no_opp.exists() and not opportunities_without_flag.exists():
        print("✅ Data integrity verification passed - all relationships are consistent!")

if __name__ == "__main__":
    sync_moved_to_opportunity()

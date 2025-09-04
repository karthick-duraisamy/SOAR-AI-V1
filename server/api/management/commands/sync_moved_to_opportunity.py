
#!/usr/bin/env python
from django.core.management.base import BaseCommand
from api.models import Lead, Opportunity

class Command(BaseCommand):
    help = 'Sync moved_to_opportunity field with actual opportunities in database'

    def handle(self, *args, **options):
        self.stdout.write("Starting moved_to_opportunity field synchronization...")
        
        # Get all leads
        all_leads = Lead.objects.all()
        updated_count = 0
        
        for lead in all_leads:
            # Check if this lead has an opportunity in the database
            has_opportunity_in_db = Opportunity.objects.filter(lead=lead).exists()
            
            # Check if the field value matches the database state
            if has_opportunity_in_db != lead.moved_to_opportunity:
                # Update the field to match the database state
                lead.moved_to_opportunity = has_opportunity_in_db
                lead.save(update_fields=['moved_to_opportunity'])
                updated_count += 1
                
                status = "moved to opportunity" if has_opportunity_in_db else "not moved to opportunity"
                self.stdout.write(f"Updated lead {lead.id} ({lead.company.name}) - {status}")
        
        # Summary
        total_leads = all_leads.count()
        total_opportunities = Opportunity.objects.count()
        leads_with_flag = Lead.objects.filter(moved_to_opportunity=True).count()
        
        self.stdout.write(f"\n=== SYNCHRONIZATION COMPLETE ===")
        self.stdout.write(f"Total leads: {total_leads}")
        self.stdout.write(f"Total opportunities: {total_opportunities}")
        self.stdout.write(f"Leads with moved_to_opportunity=True: {leads_with_flag}")
        self.stdout.write(f"Updated leads: {updated_count}")
        
        if total_opportunities == leads_with_flag:
            self.stdout.write(self.style.SUCCESS("✅ All data is now synchronized!"))
        else:
            self.stdout.write(self.style.WARNING("⚠️  Data mismatch detected - manual review may be needed"))
        
        # Report any potential issues
        leads_with_flag_but_no_opp = Lead.objects.filter(moved_to_opportunity=True).exclude(
            id__in=Opportunity.objects.values_list('lead_id', flat=True)
        ).count()
        
        opportunities_without_flag = Opportunity.objects.exclude(
            lead__moved_to_opportunity=True
        ).count()
        
        if leads_with_flag_but_no_opp > 0:
            self.stdout.write(self.style.ERROR(f"❌ {leads_with_flag_but_no_opp} leads have moved_to_opportunity=True but no opportunity record"))
        
        if opportunities_without_flag > 0:
            self.stdout.write(self.style.ERROR(f"❌ {opportunities_without_flag} opportunities exist but lead has moved_to_opportunity=False"))

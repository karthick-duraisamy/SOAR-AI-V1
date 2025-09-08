
export interface EmailTemplateSection {
  type: 'header' | 'body' | 'footer' | 'cta' | 'spacer';
  content: string;
  styles?: Record<string, string>;
}

export interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  sections: EmailTemplateSection[];
  variables: string[];
}

export class EmailTemplateService {
  private static defaultStyles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px',
      lineHeight: '1.6',
      color: '#333333',
      backgroundColor: '#ffffff',
      margin: '0',
      padding: '0'
    },
    header: {
      backgroundColor: '#2563eb',
      color: '#ffffff',
      padding: '20px',
      textAlign: 'center' as const,
      fontSize: '24px',
      fontWeight: 'bold'
    },
    body: {
      padding: '30px 20px',
      backgroundColor: '#ffffff'
    },
    footer: {
      backgroundColor: '#f8fafc',
      padding: '20px',
      textAlign: 'center' as const,
      fontSize: '12px',
      color: '#64748b',
      borderTop: '1px solid #e2e8f0'
    },
    cta: {
      textAlign: 'center' as const,
      margin: '30px 0'
    },
    ctaButton: {
      backgroundColor: '#10b981',
      color: '#ffffff',
      padding: '12px 24px',
      textDecoration: 'none',
      borderRadius: '6px',
      fontWeight: 'bold',
      display: 'inline-block'
    }
  };

  static generateEmailHTML(template: EmailTemplate, variables: Record<string, string> = {}): string {
    let html = this.getBaseTemplate();
    
    // Replace template sections
    const sectionsHTML = template.sections.map(section => {
      return this.renderSection(section, variables);
    }).join('');
    
    html = html.replace('{{CONTENT}}', sectionsHTML);
    
    // Replace any remaining variables
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      html = html.replace(regex, value);
    });
    
    return html;
  }

  private static getBaseTemplate(): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Template</title>
    <style>
        body {
            font-family: ${this.defaultStyles.container.fontFamily};
            font-size: ${this.defaultStyles.container.fontSize};
            line-height: ${this.defaultStyles.container.lineHeight};
            color: ${this.defaultStyles.container.color};
            background-color: ${this.defaultStyles.container.backgroundColor};
            margin: ${this.defaultStyles.container.margin};
            padding: ${this.defaultStyles.container.padding};
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .email-header {
            background-color: ${this.defaultStyles.header.backgroundColor};
            color: ${this.defaultStyles.header.color};
            padding: ${this.defaultStyles.header.padding};
            text-align: ${this.defaultStyles.header.textAlign};
            font-size: ${this.defaultStyles.header.fontSize};
            font-weight: ${this.defaultStyles.header.fontWeight};
        }
        .email-body {
            padding: ${this.defaultStyles.body.padding};
            background-color: ${this.defaultStyles.body.backgroundColor};
        }
        .email-footer {
            background-color: ${this.defaultStyles.footer.backgroundColor};
            padding: ${this.defaultStyles.footer.padding};
            text-align: ${this.defaultStyles.footer.textAlign};
            font-size: ${this.defaultStyles.footer.fontSize};
            color: ${this.defaultStyles.footer.color};
            border-top: ${this.defaultStyles.footer.borderTop};
        }
        .email-cta {
            text-align: ${this.defaultStyles.cta.textAlign};
            margin: ${this.defaultStyles.cta.margin};
        }
        .cta-button {
            background-color: ${this.defaultStyles.ctaButton.backgroundColor};
            color: ${this.defaultStyles.ctaButton.color};
            padding: ${this.defaultStyles.ctaButton.padding};
            text-decoration: ${this.defaultStyles.ctaButton.textDecoration};
            border-radius: ${this.defaultStyles.ctaButton.borderRadius};
            font-weight: ${this.defaultStyles.ctaButton.fontWeight};
            display: ${this.defaultStyles.ctaButton.display};
        }
        .spacer {
            height: 20px;
        }
        .text-center { text-align: center; }
        .text-left { text-align: left; }
        .text-right { text-align: right; }
        .font-bold { font-weight: bold; }
        .font-semibold { font-weight: 600; }
        .text-sm { font-size: 12px; }
        .text-lg { font-size: 18px; }
        .text-xl { font-size: 20px; }
        .mb-4 { margin-bottom: 16px; }
        .mt-4 { margin-top: 16px; }
    </style>
</head>
<body>
    <div class="email-container">
        {{CONTENT}}
    </div>
</body>
</html>`;
  }

  private static renderSection(section: EmailTemplateSection, variables: Record<string, string>): string {
    let content = section.content;
    
    // Replace variables in content
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      content = content.replace(regex, value);
    });

    switch (section.type) {
      case 'header':
        return `<div class="email-header">${content}</div>`;
      
      case 'body':
        return `<div class="email-body">${content}</div>`;
      
      case 'footer':
        return `<div class="email-footer">${content}</div>`;
      
      case 'cta':
        const isButton = content.includes('<a') || content.includes('href');
        if (isButton) {
          return `<div class="email-cta">${content}</div>`;
        } else {
          return `<div class="email-cta"><a href="#" class="cta-button">${content}</a></div>`;
        }
      
      case 'spacer':
        return `<div class="spacer"></div>`;
      
      default:
        return `<div>${content}</div>`;
    }
  }

  static getStandardTemplates(): EmailTemplate[] {
    return [
      {
        id: 'corporate-welcome',
        name: 'Corporate Welcome Template',
        description: 'Standard welcome template for new corporate clients',
        variables: ['company_name', 'contact_name', 'industry', 'employees'],
        sections: [
          {
            type: 'header',
            content: 'Welcome to SOAR-AI, {{company_name}}!'
          },
          {
            type: 'body',
            content: `
              <p>Dear {{contact_name}},</p>
              
              <p>Welcome to SOAR-AI! We're excited to help {{company_name}} transform your corporate travel experience.</p>
              
              <p>Based on your {{industry}} background and {{employees}} team size, we've identified several opportunities to optimize your travel operations:</p>
              
              <ul>
                <li>✈️ Reduce travel costs by up to 35%</li>
                <li>📊 Streamline booking and approval processes</li>
                <li>🌍 Access our global partner network</li>
                <li>🤖 AI-powered travel recommendations</li>
              </ul>
              
              <p>Ready to see how we can help? Let's schedule a 15-minute discovery call.</p>
            `
          },
          {
            type: 'cta',
            content: '<a href="{{cta_link}}" class="cta-button">Schedule Discovery Call</a>'
          },
          {
            type: 'footer',
            content: `
              <p>Best regards,<br>
              The SOAR-AI Team</p>
              
              <p>© 2024 SOAR-AI. All rights reserved.<br>
              <a href="#" style="color: #64748b;">Unsubscribe</a> | <a href="#" style="color: #64748b;">Privacy Policy</a></p>
            `
          }
        ]
      },
      {
        id: 'cost-savings-focus',
        name: 'Cost Savings Template',
        description: 'Template emphasizing ROI and cost reduction benefits',
        variables: ['company_name', 'contact_name', 'industry', 'travel_budget', 'calculated_savings'],
        sections: [
          {
            type: 'header',
            content: '{{company_name}}: Cut Travel Costs by 35%'
          },
          {
            type: 'body',
            content: `
              <p>Hello {{contact_name}},</p>
              
              <p>Companies like {{company_name}} in the {{industry}} sector are saving an average of 35% on travel costs with SOAR-AI.</p>
              
              <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin: 0 0 15px 0; color: #1e40af;">Your Potential Savings:</h3>
                <p style="margin: 5px 0;"><strong>Current estimated budget:</strong> {{travel_budget}}</p>
                <p style="margin: 5px 0;"><strong>Potential annual savings:</strong> <span style="color: #059669; font-weight: bold;">{{calculated_savings}}</span></p>
                <p style="margin: 5px 0;"><strong>ROI timeline:</strong> 3-6 months</p>
              </div>
              
              <p>Ready to start saving? Let's discuss your specific travel needs.</p>
            `
          },
          {
            type: 'cta',
            content: '<a href="{{cta_link}}" class="cta-button">Get Your Savings Report</a>'
          },
          {
            type: 'footer',
            content: `
              <p>Best regards,<br>
              The SOAR-AI Sales Team</p>
              
              <p>© 2024 SOAR-AI. All rights reserved.<br>
              <a href="#" style="color: #64748b;">Unsubscribe</a> | <a href="#" style="color: #64748b;">Privacy Policy</a></p>
            `
          }
        ]
      },
      {
        id: 'follow-up-template',
        name: 'Follow-up Template',
        description: 'Standard follow-up template for existing prospects',
        variables: ['company_name', 'contact_name', 'last_interaction'],
        sections: [
          {
            type: 'header',
            content: 'Following up on our conversation'
          },
          {
            type: 'body',
            content: `
              <p>Hi {{contact_name}},</p>
              
              <p>I hope this email finds you well. I wanted to follow up on our {{last_interaction}} regarding {{company_name}}'s corporate travel needs.</p>
              
              <p>Since our last conversation, we've helped several companies in your industry achieve:</p>
              
              <ul>
                <li>Significant cost reductions on business travel</li>
                <li>Improved travel policy compliance</li>
                <li>Better employee satisfaction with travel experiences</li>
              </ul>
              
              <p>I'd love to show you how we can deliver similar results for {{company_name}}.</p>
            `
          },
          {
            type: 'cta',
            content: '<a href="{{cta_link}}" class="cta-button">Schedule a Quick Call</a>'
          },
          {
            type: 'footer',
            content: `
              <p>Best regards,<br>
              Your SOAR-AI Account Manager</p>
              
              <p>© 2024 SOAR-AI. All rights reserved.<br>
              <a href="#" style="color: #64748b;">Unsubscribe</a> | <a href="#" style="color: #64748b;">Privacy Policy</a></p>
            `
          }
        ]
      },
      {
        id: 'proposal-template',
        name: 'Proposal Submission Template',
        description: 'Template for sending proposals to prospects',
        variables: ['company_name', 'contact_name', 'proposal_value', 'validity_period'],
        sections: [
          {
            type: 'header',
            content: 'Your Corporate Travel Proposal is Ready'
          },
          {
            type: 'body',
            content: `
              <p>Dear {{contact_name}},</p>
              
              <p>Thank you for your interest in SOAR-AI's corporate travel solutions. I'm pleased to present our customized proposal for {{company_name}}.</p>
              
              <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
                <h3 style="margin: 0 0 15px 0; color: #1e40af;">Proposal Highlights:</h3>
                <p style="margin: 5px 0;"><strong>Proposed Solution Value:</strong> {{proposal_value}}</p>
                <p style="margin: 5px 0;"><strong>Estimated Annual Savings:</strong> Up to 35%</p>
                <p style="margin: 5px 0;"><strong>Implementation Timeline:</strong> 2-4 weeks</p>
                <p style="margin: 5px 0;"><strong>Proposal Valid Until:</strong> {{validity_period}}</p>
              </div>
              
              <p>This proposal includes detailed pricing, implementation plan, and expected ROI for your organization.</p>
            `
          },
          {
            type: 'cta',
            content: '<a href="{{cta_link}}" class="cta-button">View Full Proposal</a>'
          },
          {
            type: 'spacer'
          },
          {
            type: 'body',
            content: `
              <p style="font-size: 12px; color: #64748b; text-align: center;">
                Have questions? Reply to this email or call us at +1 (555) 123-4567
              </p>
            `
          },
          {
            type: 'footer',
            content: `
              <p>Best regards,<br>
              The SOAR-AI Proposals Team</p>
              
              <p>© 2024 SOAR-AI. All rights reserved.<br>
              <a href="#" style="color: #64748b;">Unsubscribe</a> | <a href="#" style="color: #64748b;">Privacy Policy</a></p>
            `
          }
        ]
      }
    ];
  }

  static createCustomTemplate(
    name: string,
    description: string,
    headerContent: string,
    bodyContent: string,
    footerContent: string,
    ctaContent?: string,
    variables: string[] = []
  ): EmailTemplate {
    const sections: EmailTemplateSection[] = [
      {
        type: 'header',
        content: headerContent
      },
      {
        type: 'body',
        content: bodyContent
      }
    ];

    if (ctaContent) {
      sections.push({
        type: 'cta',
        content: ctaContent
      });
    }

    sections.push({
      type: 'footer',
      content: footerContent
    });

    return {
      id: `custom-${Date.now()}`,
      name,
      description,
      sections,
      variables
    };
  }

  static extractVariables(content: string): string[] {
    const variableRegex = /{{(\w+)}}/g;
    const variables: string[] = [];
    let match;

    while ((match = variableRegex.exec(content)) !== null) {
      if (!variables.includes(match[1])) {
        variables.push(match[1]);
      }
    }

    return variables;
  }

  static validateTemplate(template: EmailTemplate): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!template.name || template.name.trim() === '') {
      errors.push('Template name is required');
    }

    if (!template.sections || template.sections.length === 0) {
      errors.push('Template must have at least one section');
    }

    const hasHeader = template.sections.some(section => section.type === 'header');
    const hasBody = template.sections.some(section => section.type === 'body');
    const hasFooter = template.sections.some(section => section.type === 'footer');

    if (!hasHeader) {
      errors.push('Template should have a header section');
    }

    if (!hasBody) {
      errors.push('Template must have a body section');
    }

    if (!hasFooter) {
      errors.push('Template should have a footer section');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

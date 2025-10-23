import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HelpCircle, ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Chatbot } from "@/components/Chatbot";
import { useQuery } from "@tanstack/react-query";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqData = [
  {
    category: "General",
    questions: [
      {
        question: "What is PIFAH?",
        answer: "PIFAH (Programme for Investment and Financing in Africa's Health Sector) is a comprehensive platform connecting investors, governments, and implementers to advance health sector investment across Africa. We focus on five strategic pillars: Health Infrastructure, Local Manufacturing, Diagnostics & Imaging, Digital Health & AI, and Human Capital Development."
      },
      {
        question: "Who can use the PIFAH platform?",
        answer: "The platform serves multiple stakeholders including government agencies, private investors, development partners, implementing organizations, and health sector professionals across Africa. Public users can explore approved projects, while authenticated users can submit projects, review submissions, and manage the approval workflow."
      },
      {
        question: "How do I register on the platform?",
        answer: "Click the 'Register' button in the header to create an account. You'll need to provide basic information and select your role (focal person, approver, or general user). Admin access is granted separately by system administrators."
      }
    ]
  },
  {
    category: "Projects",
    questions: [
      {
        question: "How do I submit a project proposal?",
        answer: "After logging in, click 'Submit Project' in the navigation menu. Fill out the comprehensive project submission form covering general information, strategic rationale, market opportunity, financial details, and implementation readiness. Your submission will be reviewed by regional focal persons and approvers."
      },
      {
        question: "What are the five PIFAH pillars?",
        answer: "The five strategic investment pillars are: (1) Health Infrastructure - Building and upgrading health facilities, (2) Local Manufacturing - Producing pharmaceuticals and medical supplies locally, (3) Diagnostics & Imaging - Improving diagnostic capabilities, (4) Digital Health & AI - Leveraging technology for healthcare delivery, and (5) Human Capital Development - Training and retaining healthcare workers."
      },
      {
        question: "What is the project approval process?",
        answer: "Projects go through a three-stage workflow: (1) Pending - Initial submission awaiting review, (2) Under Review - Being evaluated by regional focal persons, and (3) Approved - Final approval by designated approvers. Each stage includes comprehensive review of technical, financial, and strategic aspects."
      },
      {
        question: "Can I view projects from other countries?",
        answer: "Yes! The interactive map on the homepage allows you to explore approved health investment projects across all African countries. Click on any country to view detailed project information, including investment amounts, implementation timelines, and expected impacts."
      }
    ]
  },
  {
    category: "Regional Economic Communities (RECs)",
    questions: [
      {
        question: "What are RECs and why are they important?",
        answer: "Regional Economic Communities (RECs) are intergovernmental organizations that promote economic integration and cooperation. PIFAH works with eight RECs: COMESA, EAC, ECCAS, ECOWAS, IGAD, SADC, UMA, and CEN-SAD. RECs facilitate cross-border health initiatives and regional collaboration on health sector investment."
      },
      {
        question: "How do RECs support health sector projects?",
        answer: "RECs provide regional coordination, policy harmonization, and facilitate cross-border health initiatives. They help identify regional priorities, coordinate funding mechanisms, and support implementation of health projects that benefit multiple member countries."
      }
    ]
  },
  {
    category: "Technical Support",
    questions: [
      {
        question: "What file formats are supported for project attachments?",
        answer: "The platform supports common document formats including PDF, Word documents (.doc, .docx), Excel spreadsheets (.xls, .xlsx), and image files (.jpg, .png). Maximum file size is typically 10MB per attachment."
      },
      {
        question: "Can I export project data?",
        answer: "Yes! Authenticated users with appropriate permissions can export project data in CSV and PDF formats. The export includes comprehensive project details, financial information, and complete audit trails with submission and approval timestamps."
      },
      {
        question: "Is my data secure?",
        answer: "Absolutely. PIFAH implements industry-standard security measures including encrypted connections (HTTPS), secure authentication, role-based access control, and regular security audits. Your project data and personal information are protected and only accessible to authorized users."
      }
    ]
  },
  {
    category: "Investment & Financing",
    questions: [
      {
        question: "What types of financing models are supported?",
        answer: "PIFAH supports various financing models including Public-Private Partnerships (PPP), direct government funding, development partner grants, private equity investment, blended finance, and innovative financing mechanisms. Projects can specify their preferred financing approach during submission."
      },
      {
        question: "How much investment is typically required?",
        answer: "Investment amounts vary widely depending on project scope and pillar. Health infrastructure projects may range from $5M-$500M+, while digital health initiatives might start at $1M-$50M. Local manufacturing facilities typically require $10M-$200M in capital investment."
      },
      {
        question: "Where can I find investment opportunities?",
        answer: "Explore the interactive map to view approved projects seeking investment across Africa. Each project profile includes investment requirements, expected returns, implementation timelines, and contact information for the implementing entity."
      }
    ]
  }
];

export default function FAQ() {
  // Fetch app settings for logo
  const { data: settings } = useQuery<{
    id: string;
    logoUrl: string | null;
    bannerImageUrl: string | null;
  }>({
    queryKey: ['/api/settings'],
  });

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="border-b bg-card/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center gap-3 cursor-pointer hover-elevate">
                {settings?.logoUrl ? (
                  <img 
                    src={settings.logoUrl} 
                    alt="PIFAH Logo" 
                    className="h-12 w-auto max-w-[120px] object-contain"
                    data-testid="img-logo"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                    <HelpCircle className="h-6 w-6 text-primary-foreground" />
                  </div>
                )}
                <div>
                  <h1 className="text-lg font-bold">PIFAH</h1>
                  <p className="text-xs text-muted-foreground">Frequently Asked Questions</p>
                </div>
              </div>
            </Link>
            
            <div className="flex items-center gap-2">
              <Link href="/">
                <Button variant="ghost" size="sm" data-testid="button-back">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
              <HelpCircle className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-muted-foreground">
              Find answers to common questions about PIFAH, project submissions, and health sector investment in Africa.
            </p>
          </div>

          {/* FAQ Sections */}
          <div className="space-y-8">
            {faqData.map((category, idx) => (
              <Card key={idx} className="p-6">
                <h2 className="text-2xl font-semibold mb-4 text-primary">{category.category}</h2>
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((item, qIdx) => (
                    <AccordionItem key={qIdx} value={`item-${idx}-${qIdx}`}>
                      <AccordionTrigger className="text-left hover:text-primary">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </Card>
            ))}
          </div>

          {/* Contact Section */}
          <Card className="mt-12 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <div className="p-8 text-center">
              <h3 className="text-2xl font-semibold mb-3">Still have questions?</h3>
              <p className="text-muted-foreground mb-6">
                Can't find what you're looking for? Our support team is here to help you get started with PIFAH.
              </p>
              <Link href="/">
                <Button size="lg" data-testid="button-contact">
                  Explore Platform
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {settings?.logoUrl && (
                <img 
                  src={settings.logoUrl} 
                  alt="PIFAH Logo" 
                  className="h-12 w-auto max-w-[100px] object-contain"
                />
              )}
              <div className="text-sm text-muted-foreground">
                <p className="font-semibold">PIFAH</p>
                <p>Programme for Investment and Financing in Africa's Health Sector</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 PIFAH. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
}

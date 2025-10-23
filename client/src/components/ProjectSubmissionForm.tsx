import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { FileText, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { isUnauthorizedError } from "@/lib/authUtils";

const AFRICAN_COUNTRIES = [
  "Algeria", "Angola", "Benin", "Botswana", "Burkina Faso", "Burundi", "Cabo Verde", "Cameroon",
  "Central African Republic", "Chad", "Comoros", "Congo (Brazzaville)", "Congo (Kinshasa)",
  "Côte d'Ivoire", "Djibouti", "Egypt", "Equatorial Guinea", "Eritrea", "Eswatini", "Ethiopia",
  "Gabon", "Gambia", "Ghana", "Guinea", "Guinea-Bissau", "Kenya", "Lesotho", "Liberia", "Libya",
  "Madagascar", "Malawi", "Mali", "Mauritania", "Mauritius", "Morocco", "Mozambique", "Namibia",
  "Niger", "Nigeria", "Rwanda", "São Tomé and Príncipe", "Senegal", "Seychelles", "Sierra Leone",
  "Somalia", "South Africa", "South Sudan", "Sudan", "Tanzania", "Togo", "Tunisia", "Uganda",
  "Zambia", "Zimbabwe"
];

const REGIONS = ["North Africa", "West Africa", "East Africa", "Central Africa", "Southern Africa"];

const PILLARS = [
  "Health Infrastructure",
  "Local Manufacturing",
  "Diagnostics & Imaging",
  "Digital Health & AI",
  "Human Capital Development",
  "R&D and Innovation"
];

const PROJECT_STAGES = [
  "Concept",
  "Feasibility Study",
  "Detailed Design",
  "Pilot Running",
  "Ready for Scale-Up"
];

interface ProjectFormData {
  // General Information
  projectTitle: string;
  projectSummary: string;
  country: string;
  region: string;
  implementingEntity: string;
  pppModel?: string;
  projectType: string;
  projectWebsite?: string;
  contactPerson: string;
  contactDetails: string;
  
  // Strategic Rationale
  projectDescription: string;
  pifahPillar: string;
  alignmentToNationalPriorities?: string;
  regionalIntegrationPotential: boolean;
  regionalIntegrationDetails?: string;
  
  // Market Opportunity
  marketSize?: string;
  targetPopulation?: string;
  existingSolutions?: string;
  uniqueSellingProposition?: string;
  
  // Economic & Health Impact
  expectedHealthOutcomes?: string;
  economicBenefits?: string;
  socialImpact?: string;
  contributionAreas: string[];
  contributionDescription?: string;
  environmentalConsiderations?: string;
  
  // Financial Information
  estimatedInvestment?: string;
  costBreakdown?: string;
  currentFundingModel?: string;
  proposedFinancingStructure?: string;
  expectedReturn?: string;
  
  // Implementation Readiness
  currentStage: string;
  keyMilestones?: string;
  governmentApprovals: boolean;
  partnerships?: string;
  regulatoryAlignment?: string;
  
  // Risk & Mitigation
  majorRisks?: string;
  mitigationMeasures?: string;
  
  // Timeline
  plannedStartDate?: string;
  implementationHorizon?: string;
  
  // Support Required
  supportRequired: string[];
  
  // Additional Information
  otherNotes?: string;
}

export function ProjectSubmissionForm() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ProjectFormData>({
    defaultValues: {
      regionalIntegrationPotential: false,
      governmentApprovals: false,
      contributionAreas: [],
      supportRequired: [],
    },
  });

  const selectedPillar = watch("pifahPillar");
  const selectedCountry = watch("country");
  const selectedRegion = watch("region");
  const selectedStage = watch("currentStage");
  const selectedProjectType = watch("projectType");
  const regionalIntegration = watch("regionalIntegrationPotential");
  const govApprovals = watch("governmentApprovals");
  const contributionAreas = watch("contributionAreas") || [];
  const supportRequired = watch("supportRequired") || [];

  const submitMutation = useMutation({
    mutationFn: async (data: ProjectFormData) => {
      return apiRequest('/api/projects', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      setSubmitted(true);
      toast({
        title: "Success!",
        description: "Your project has been submitted successfully. A focal person will review it soon.",
      });
    },
    onError: (error: any) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: error.message || "Failed to submit project. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ProjectFormData) => {
    submitMutation.mutate(data);
  };

  const toggleContributionArea = (area: string) => {
    const current = contributionAreas || [];
    const updated = current.includes(area)
      ? current.filter(a => a !== area)
      : [...current, area];
    setValue("contributionAreas", updated);
  };

  const toggleSupportArea = (area: string) => {
    const current = supportRequired || [];
    const updated = current.includes(area)
      ? current.filter(a => a !== area)
      : [...current, area];
    setValue("supportRequired", updated);
  };

  if (submitted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-12 text-center">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Project Submitted Successfully!</h2>
          <p className="text-muted-foreground mb-6">
            Thank you for submitting your project. Our focal person will review your submission and get back to you soon.
            You will receive notifications about the status of your project.
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => window.location.href = "/"}>
              Back to Home
            </Button>
            <Button variant="outline" onClick={() => setSubmitted(false)}>
              Submit Another Project
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>PIFAH Project Submission</CardTitle>
              <CardDescription>Complete all required fields to submit your health investment project</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* 1. General Information */}
      <Card>
        <CardHeader>
          <CardTitle>1. General Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="projectTitle">Project Title *</Label>
            <Input
              id="projectTitle"
              {...register("projectTitle", { required: true })}
              placeholder="Enter your project title"
              data-testid="input-projectTitle"
            />
            {errors.projectTitle && <p className="text-sm text-destructive">This field is required</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="projectSummary">Project Summary (max 50 words) *</Label>
            <Textarea
              id="projectSummary"
              {...register("projectSummary", { required: true, maxLength: 300 })}
              placeholder="Brief summary of your project"
              rows={3}
              data-testid="input-projectSummary"
            />
            {errors.projectSummary && <p className="text-sm text-destructive">This field is required</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <Select value={selectedCountry} onValueChange={(value) => setValue("country", value)}>
                <SelectTrigger data-testid="select-country">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {AFRICAN_COUNTRIES.map((country) => (
                    <SelectItem key={country} value={country}>{country}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.country && <p className="text-sm text-destructive">This field is required</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="region">Region *</Label>
              <Select value={selectedRegion} onValueChange={(value) => setValue("region", value)}>
                <SelectTrigger data-testid="select-region">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  {REGIONS.map((region) => (
                    <SelectItem key={region} value={region}>{region}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.region && <p className="text-sm text-destructive">This field is required</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="implementingEntity">Implementing Entity *</Label>
            <Input
              id="implementingEntity"
              {...register("implementingEntity", { required: true })}
              placeholder="e.g., Ministry of Health, Private Company, PPP"
              data-testid="input-implementingEntity"
            />
            {errors.implementingEntity && <p className="text-sm text-destructive">This field is required</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pppModel">PPP Model (if applicable)</Label>
              <Input
                id="pppModel"
                {...register("pppModel")}
                placeholder="e.g., Lease, Concession, Joint Venture"
                data-testid="input-pppModel"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectType">Project Type *</Label>
              <Select value={selectedProjectType} onValueChange={(value) => setValue("projectType", value)}>
                <SelectTrigger data-testid="select-projectType">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Government Demand Priority">Government Demand Priority</SelectItem>
                  <SelectItem value="Private Sector Opportunity">Private Sector Opportunity</SelectItem>
                </SelectContent>
              </Select>
              {errors.projectType && <p className="text-sm text-destructive">This field is required</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="projectWebsite">Project Website or Digital Profile</Label>
            <Input
              id="projectWebsite"
              {...register("projectWebsite")}
              placeholder="https://..."
              data-testid="input-projectWebsite"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactPerson">Contact Person *</Label>
              <Input
                id="contactPerson"
                {...register("contactPerson", { required: true })}
                placeholder="Full name"
                data-testid="input-contactPerson"
              />
              {errors.contactPerson && <p className="text-sm text-destructive">This field is required</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactDetails">Contact Details *</Label>
              <Input
                id="contactDetails"
                {...register("contactDetails", { required: true })}
                placeholder="Email and/or phone"
                data-testid="input-contactDetails"
              />
              {errors.contactDetails && <p className="text-sm text-destructive">This field is required</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Strategic Rationale */}
      <Card>
        <CardHeader>
          <CardTitle>2. Strategic Rationale</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="projectDescription">Brief Project Description (max 500 words) *</Label>
            <Textarea
              id="projectDescription"
              {...register("projectDescription", { required: true })}
              placeholder="Describe your project in detail"
              rows={6}
              data-testid="input-projectDescription"
            />
            {errors.projectDescription && <p className="text-sm text-destructive">This field is required</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="pifahPillar">Which PIFAH Pillar does this project fall under? *</Label>
            <Select value={selectedPillar} onValueChange={(value) => setValue("pifahPillar", value)}>
              <SelectTrigger data-testid="select-pifahPillar">
                <SelectValue placeholder="Select pillar" />
              </SelectTrigger>
              <SelectContent>
                {PILLARS.map((pillar) => (
                  <SelectItem key={pillar} value={pillar}>{pillar}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.pifahPillar && <p className="text-sm text-destructive">This field is required</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="alignmentToNationalPriorities">Alignment to National Health Priorities / SDGs / Agenda 2063</Label>
            <Textarea
              id="alignmentToNationalPriorities"
              {...register("alignmentToNationalPriorities")}
              placeholder="Describe how this project aligns with national priorities, SDGs, and Agenda 2063"
              rows={4}
              data-testid="input-alignmentToNationalPriorities"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Checkbox
                id="regionalIntegrationPotential"
                checked={regionalIntegration}
                onCheckedChange={(checked) => setValue("regionalIntegrationPotential", checked as boolean)}
                data-testid="checkbox-regionalIntegration"
              />
              <Label htmlFor="regionalIntegrationPotential" className="cursor-pointer">
                Regional integration potential
              </Label>
            </div>

            {regionalIntegration && (
              <div className="space-y-2 ml-6">
                <Label htmlFor="regionalIntegrationDetails">Please provide details</Label>
                <Textarea
                  id="regionalIntegrationDetails"
                  {...register("regionalIntegrationDetails")}
                  placeholder="e.g., AfCFTA relevance, cross-border service delivery, mutual recognition/regulatory alignment"
                  rows={3}
                  data-testid="input-regionalIntegrationDetails"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 3. Market Opportunity */}
      <Card>
        <CardHeader>
          <CardTitle>3. Market Opportunity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="marketSize">Market Size / Potential</Label>
            <Input
              id="marketSize"
              {...register("marketSize")}
              placeholder="USD value, CAGR, demand gap"
              data-testid="input-marketSize"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetPopulation">Target Population / Beneficiaries</Label>
            <Input
              id="targetPopulation"
              {...register("targetPopulation")}
              placeholder="Estimated number of beneficiaries"
              data-testid="input-targetPopulation"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="existingSolutions">Existing Solutions</Label>
            <Textarea
              id="existingSolutions"
              {...register("existingSolutions")}
              placeholder="What solutions currently exist?"
              rows={3}
              data-testid="input-existingSolutions"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="uniqueSellingProposition">Unique Selling Proposition (USP)</Label>
            <Textarea
              id="uniqueSellingProposition"
              {...register("uniqueSellingProposition")}
              placeholder="What makes your project unique?"
              rows={3}
              data-testid="input-uniqueSellingProposition"
            />
          </div>
        </CardContent>
      </Card>

      {/* 4. Economic & Health Impact */}
      <Card>
        <CardHeader>
          <CardTitle>4. Economic & Health Impact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="expectedHealthOutcomes">Expected Health Outcomes</Label>
            <Textarea
              id="expectedHealthOutcomes"
              {...register("expectedHealthOutcomes")}
              placeholder="What health outcomes do you expect?"
              rows={3}
              data-testid="input-expectedHealthOutcomes"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="economicBenefits">Economic Benefits</Label>
            <Textarea
              id="economicBenefits"
              {...register("economicBenefits")}
              placeholder="What economic benefits will this project generate?"
              rows={3}
              data-testid="input-economicBenefits"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="socialImpact">Social Impact</Label>
            <Textarea
              id="socialImpact"
              {...register("socialImpact")}
              placeholder="What social impact will this project have?"
              rows={3}
              data-testid="input-socialImpact"
            />
          </div>

          <div className="space-y-3">
            <Label>Does the project contribute to any of the following?</Label>
            <div className="space-y-2">
              {["Youth Development", "Gender Inclusion", "Women's and girls' sexual and reproductive health (SRH)"].map((area) => (
                <div key={area} className="flex items-center gap-2">
                  <Checkbox
                    id={area}
                    checked={contributionAreas.includes(area)}
                    onCheckedChange={() => toggleContributionArea(area)}
                    data-testid={`checkbox-contribution-${area.replace(/\s+/g, '-')}`}
                  />
                  <Label htmlFor={area} className="cursor-pointer">{area}</Label>
                </div>
              ))}
            </div>

            {contributionAreas.length > 0 && (
              <div className="space-y-2 mt-3">
                <Label htmlFor="contributionDescription">Briefly describe the contribution and expected results</Label>
                <Textarea
                  id="contributionDescription"
                  {...register("contributionDescription")}
                  placeholder="Include indicators/targets if available"
                  rows={3}
                  data-testid="input-contributionDescription"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="environmentalConsiderations">Environmental/Climate Resilience Considerations</Label>
            <Textarea
              id="environmentalConsiderations"
              {...register("environmentalConsiderations")}
              placeholder="Environmental impact and sustainability considerations"
              rows={3}
              data-testid="input-environmentalConsiderations"
            />
          </div>
        </CardContent>
      </Card>

      {/* 5. Financial Information */}
      <Card>
        <CardHeader>
          <CardTitle>5. Financial Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="estimatedInvestment">Estimated Investment Required (USD)</Label>
            <Input
              id="estimatedInvestment"
              {...register("estimatedInvestment")}
              placeholder="e.g., $5,000,000"
              data-testid="input-estimatedInvestment"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="costBreakdown">Cost Breakdown</Label>
            <Textarea
              id="costBreakdown"
              {...register("costBreakdown")}
              placeholder="Provide a breakdown of costs"
              rows={4}
              data-testid="input-costBreakdown"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentFundingModel">Current Funding Model (Existing Projects Only)</Label>
            <Textarea
              id="currentFundingModel"
              {...register("currentFundingModel")}
              placeholder="How is the project currently funded?"
              rows={3}
              data-testid="input-currentFundingModel"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="proposedFinancingStructure">Proposed Financing Structure</Label>
            <Textarea
              id="proposedFinancingStructure"
              {...register("proposedFinancingStructure")}
              placeholder="e.g., grants, equity, debt"
              rows={3}
              data-testid="input-proposedFinancingStructure"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expectedReturn">Expected Return / Financial Viability Indicators</Label>
            <Textarea
              id="expectedReturn"
              {...register("expectedReturn")}
              placeholder="If available, provide expected returns or viability indicators"
              rows={3}
              data-testid="input-expectedReturn"
            />
          </div>
        </CardContent>
      </Card>

      {/* 6. Implementation Readiness */}
      <Card>
        <CardHeader>
          <CardTitle>6. Implementation Readiness</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentStage">Current Project Stage *</Label>
            <Select value={selectedStage} onValueChange={(value) => setValue("currentStage", value)}>
              <SelectTrigger data-testid="select-currentStage">
                <SelectValue placeholder="Select stage" />
              </SelectTrigger>
              <SelectContent>
                {PROJECT_STAGES.map((stage) => (
                  <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.currentStage && <p className="text-sm text-destructive">This field is required</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="keyMilestones">Key Milestones Achieved</Label>
            <Textarea
              id="keyMilestones"
              {...register("keyMilestones")}
              placeholder="List major milestones achieved so far"
              rows={3}
              data-testid="input-keyMilestones"
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="governmentApprovals"
              checked={govApprovals}
              onCheckedChange={(checked) => setValue("governmentApprovals", checked as boolean)}
              data-testid="checkbox-governmentApprovals"
            />
            <Label htmlFor="governmentApprovals" className="cursor-pointer">
              Government Approvals Secured
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="partnerships">Partnerships in Place</Label>
            <Textarea
              id="partnerships"
              {...register("partnerships")}
              placeholder="List existing partnerships and collaborators"
              rows={3}
              data-testid="input-partnerships"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="regulatoryAlignment">Regulatory / Policy Alignment</Label>
            <Textarea
              id="regulatoryAlignment"
              {...register("regulatoryAlignment")}
              placeholder="How does this project align with regulatory and policy frameworks?"
              rows={3}
              data-testid="input-regulatoryAlignment"
            />
          </div>
        </CardContent>
      </Card>

      {/* 7. Risk & Mitigation */}
      <Card>
        <CardHeader>
          <CardTitle>7. Risk & Mitigation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="majorRisks">Major Risks Identified</Label>
            <Textarea
              id="majorRisks"
              {...register("majorRisks")}
              placeholder="e.g., political, regulatory, currency risks"
              rows={4}
              data-testid="input-majorRisks"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mitigationMeasures">Proposed Mitigation Measures</Label>
            <Textarea
              id="mitigationMeasures"
              {...register("mitigationMeasures")}
              placeholder="How will you mitigate these risks?"
              rows={4}
              data-testid="input-mitigationMeasures"
            />
          </div>
        </CardContent>
      </Card>

      {/* 8. Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>8. Timeline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="plannedStartDate">Planned Start Date / Ongoing</Label>
            <Input
              id="plannedStartDate"
              {...register("plannedStartDate")}
              placeholder="e.g., Q2 2025 or Ongoing"
              data-testid="input-plannedStartDate"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="implementationHorizon">Implementation Horizon</Label>
            <Input
              id="implementationHorizon"
              {...register("implementationHorizon")}
              placeholder="short-term / medium-term / long-term"
              data-testid="input-implementationHorizon"
            />
          </div>
        </CardContent>
      </Card>

      {/* 9. Support Required from PIFAH / AUDA-NEPAD */}
      <Card>
        <CardHeader>
          <CardTitle>9. Support Required from PIFAH / AUDA-NEPAD</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            "Technical Assistance/Capacity Building",
            "Investment Facilitation",
            "Project Preparation and Structuring",
            "Policy / Regulatory Alignment Support",
            "Other"
          ].map((support) => (
            <div key={support} className="flex items-center gap-2">
              <Checkbox
                id={support}
                checked={supportRequired.includes(support)}
                onCheckedChange={() => toggleSupportArea(support)}
                data-testid={`checkbox-support-${support.replace(/\s+/g, '-')}`}
              />
              <Label htmlFor={support} className="cursor-pointer">{support}</Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 10. Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle>10. Additional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otherNotes">Other Notes</Label>
            <Textarea
              id="otherNotes"
              {...register("otherNotes")}
              placeholder="Any additional information you'd like to share"
              rows={4}
              data-testid="input-otherNotes"
            />
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end gap-3 pb-8">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.location.href = "/"}
          data-testid="button-cancel"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={submitMutation.isPending}
          data-testid="button-submit-project"
        >
          {submitMutation.isPending ? "Submitting..." : "Submit Project"}
        </Button>
      </div>
    </form>
  );
}

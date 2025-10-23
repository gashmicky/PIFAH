import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Filter, CheckCircle2, Clock, XCircle, Eye, Download, FileText, X } from "lucide-react";
import { PILLAR_LIST } from "@/data/pillarColors";
import { format } from "date-fns";
import type { Project } from "@shared/schema";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ProjectsTableProps {
  roleFilter?: "all" | "pending_review" | "pending_approval";
  showAllColumns?: boolean;
}

export function ProjectsTable({ roleFilter = "all", showAllColumns = true }: ProjectsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [countryFilter, setCountryFilter] = useState<string>("all");
  const [pillarFilter, setPillarFilter] = useState<string>("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  const { data: countries = [] } = useQuery<any[]>({
    queryKey: ['/api/countries'],
  });

  const filteredProjects = useMemo(() => {
    let filtered = [...projects];

    // Apply role-specific filtering
    if (roleFilter === "pending_review") {
      filtered = filtered.filter(p => p.status === "pending");
    } else if (roleFilter === "pending_approval") {
      filtered = filtered.filter(p => p.status === "under_review");
    }

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        p =>
          p.projectTitle.toLowerCase().includes(query) ||
          p.country.toLowerCase().includes(query) ||
          p.implementingEntity.toLowerCase().includes(query) ||
          p.contactPerson.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(p => p.status === statusFilter);
    }

    // Apply country filter
    if (countryFilter !== "all") {
      filtered = filtered.filter(p => p.country === countryFilter);
    }

    // Apply pillar filter
    if (pillarFilter !== "all") {
      filtered = filtered.filter(p => p.pifahPillar === pillarFilter);
    }

    return filtered;
  }, [projects, searchQuery, statusFilter, countryFilter, pillarFilter, roleFilter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case "under_review":
        return (
          <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">
            <Clock className="w-3 h-3 mr-1" />
            Under Review
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-500/10 text-red-600 border-red-500/20">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getApprovalStatus = (project: Project) => {
    const statuses = [];
    
    if (project.reviewedBy) {
      statuses.push(
        <Badge key="focal" className="bg-blue-500/10 text-blue-600 border-blue-500/20 text-xs">
          Focal Reviewed
        </Badge>
      );
    }
    
    if (project.approvedBy) {
      statuses.push(
        <Badge key="final" className="bg-green-500/10 text-green-600 border-green-500/20 text-xs">
          Final Approved
        </Badge>
      );
    }
    
    if (statuses.length === 0) {
      statuses.push(
        <Badge key="none" className="bg-gray-500/10 text-gray-600 border-gray-500/20 text-xs">
          No Reviews
        </Badge>
      );
    }
    
    return <div className="flex gap-1 flex-wrap">{statuses}</div>;
  };

  const escapeCSV = (value: string | null | undefined): string => {
    if (!value) return "";
    const stringValue = String(value);
    if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  };

  const exportToCSV = () => {
    const headers = [
      "Project ID",
      "Project Title",
      "Country",
      "Region",
      "PIFAH Pillar",
      "Status",
      "Implementing Entity",
      "Contact Person",
      "Contact Details",
      "Estimated Investment",
      "Current Stage",
      "Submitted By ID",
      "Submitted Date",
      "Reviewed By ID",
      "Focal Review Date",
      "Approved By ID",
      "Final Approval Date",
    ];

    const rows = filteredProjects.map(p => [
      escapeCSV(p.id),
      escapeCSV(p.projectTitle),
      escapeCSV(p.country),
      escapeCSV(p.region),
      escapeCSV(p.pifahPillar),
      escapeCSV(p.status),
      escapeCSV(p.implementingEntity),
      escapeCSV(p.contactPerson),
      escapeCSV(p.contactDetails),
      escapeCSV(p.estimatedInvestment),
      escapeCSV(p.currentStage),
      escapeCSV(p.submittedBy),
      p.submittedAt ? escapeCSV(format(new Date(p.submittedAt), "yyyy-MM-dd HH:mm")) : "",
      escapeCSV(p.reviewedBy || ""),
      p.reviewedAt ? escapeCSV(format(new Date(p.reviewedAt), "yyyy-MM-dd HH:mm")) : "",
      escapeCSV(p.approvedBy || ""),
      p.approvedAt ? escapeCSV(format(new Date(p.approvedAt), "yyyy-MM-dd HH:mm")) : "",
    ]);

    const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pifah-projects-${format(new Date(), "yyyy-MM-dd-HHmm")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    const doc = new jsPDF('l', 'mm', 'a4'); // Landscape orientation
    
    // Add title
    doc.setFontSize(16);
    doc.setTextColor(22, 163, 74); // Green color
    doc.text('PIFAH Projects Export', 14, 15);
    
    // Add export date
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated: ${format(new Date(), "yyyy-MM-dd HH:mm")}`, 14, 22);
    doc.text(`Total Projects: ${filteredProjects.length}`, 14, 27);
    
    // Prepare table data
    const tableData = filteredProjects.map(p => [
      p.projectTitle,
      p.country,
      p.pifahPillar,
      p.status,
      p.implementingEntity,
      p.estimatedInvestment || 'N/A',
      p.submittedAt ? format(new Date(p.submittedAt), "yyyy-MM-dd") : '',
    ]);
    
    // Generate table
    autoTable(doc, {
      startY: 32,
      head: [['Project Title', 'Country', 'PIFAH Pillar', 'Status', 'Implementing Entity', 'Investment', 'Submitted']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [22, 163, 74], // Green
        textColor: [255, 255, 255],
        fontSize: 9,
        fontStyle: 'bold',
      },
      bodyStyles: {
        fontSize: 8,
        cellPadding: 3,
      },
      alternateRowStyles: {
        fillColor: [245, 247, 250],
      },
      columnStyles: {
        0: { cellWidth: 50 }, // Project Title
        1: { cellWidth: 30 }, // Country
        2: { cellWidth: 45 }, // PIFAH Pillar
        3: { cellWidth: 25 }, // Status
        4: { cellWidth: 45 }, // Implementing Entity
        5: { cellWidth: 30 }, // Investment
        6: { cellWidth: 25 }, // Submitted
      },
      margin: { top: 32 },
    });
    
    // Save the PDF
    doc.save(`pifah-projects-${format(new Date(), "yyyy-MM-dd-HHmm")}.pdf`);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const uniqueCountries = Array.from(new Set(projects.map(p => p.country))).sort();

  return (
    <>
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <CardTitle>Projects Overview</CardTitle>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={exportToCSV}
              data-testid="button-export-csv"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={exportToPDF}
              data-testid="button-export-pdf"
            >
              <FileText className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              data-testid="input-search-projects"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger data-testid="select-status-filter">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="under_review">Under Review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Select value={countryFilter} onValueChange={setCountryFilter}>
            <SelectTrigger data-testid="select-country-filter">
              <SelectValue placeholder="All Countries" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              {uniqueCountries.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={pillarFilter} onValueChange={setPillarFilter}>
            <SelectTrigger data-testid="select-pillar-filter">
              <SelectValue placeholder="All Pillars" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Pillars</SelectItem>
              {PILLAR_LIST.map((pillar) => (
                <SelectItem key={pillar} value={pillar}>
                  {pillar}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Results count */}
        <div className="text-sm text-muted-foreground">
          Showing {filteredProjects.length} of {projects.length} projects
        </div>

        {/* Table */}
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-muted z-10">
                <TableRow>
                  <TableHead className="min-w-[250px]">Project Title</TableHead>
                  <TableHead className="min-w-[120px]">Country</TableHead>
                  <TableHead className="min-w-[180px]">PIFAH Pillar</TableHead>
                  <TableHead className="min-w-[120px]">Status</TableHead>
                  <TableHead className="min-w-[150px]">Approval Status</TableHead>
                  {showAllColumns && (
                    <>
                      <TableHead className="min-w-[200px]">Implementing Entity</TableHead>
                      <TableHead className="min-w-[150px]">Contact Person</TableHead>
                      <TableHead className="min-w-[120px]">Submitted Date</TableHead>
                    </>
                  )}
                  <TableHead className="min-w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={showAllColumns ? 9 : 6}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No projects found matching your filters
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProjects.map((project) => (
                    <TableRow
                      key={project.id}
                      className="hover-elevate cursor-pointer"
                      data-testid={`row-project-${project.id}`}
                    >
                      <TableCell className="font-medium">{project.projectTitle}</TableCell>
                      <TableCell>{project.country}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {project.pifahPillar}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(project.status)}</TableCell>
                      <TableCell>{getApprovalStatus(project)}</TableCell>
                      {showAllColumns && (
                        <>
                          <TableCell className="text-sm">{project.implementingEntity}</TableCell>
                          <TableCell className="text-sm">{project.contactPerson}</TableCell>
                          <TableCell className="text-sm">
                            {project.submittedAt
                              ? format(new Date(project.submittedAt), "MMM dd, yyyy")
                              : "N/A"}
                          </TableCell>
                        </>
                      )}
                      <TableCell>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedProject(project)}
                          data-testid={`button-view-${project.id}`}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Project Details Dialog */}
    <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">{selectedProject?.projectTitle}</DialogTitle>
          <DialogDescription>
            Complete project details and information
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-4">
          {selectedProject && (
            <div className="space-y-6">
              {/* General Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-primary">General Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Country</p>
                    <p className="font-medium">{selectedProject.country}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Region</p>
                    <p className="font-medium">{selectedProject.region}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">PIFAH Pillar</p>
                    <Badge variant="outline">{selectedProject.pifahPillar}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    {getStatusBadge(selectedProject.status)}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Project Type</p>
                    <p className="font-medium">{selectedProject.projectType || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Current Stage</p>
                    <p className="font-medium">{selectedProject.currentStage || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Project Summary */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-primary">Project Summary</h3>
                <p className="text-sm">{selectedProject.projectSummary}</p>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-primary">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Implementing Entity</p>
                    <p className="font-medium">{selectedProject.implementingEntity}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Contact Person</p>
                    <p className="font-medium">{selectedProject.contactPerson}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-muted-foreground">Contact Details</p>
                    <p className="font-medium">{selectedProject.contactDetails}</p>
                  </div>
                </div>
              </div>

              {/* Financial Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-primary">Financial Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Estimated Investment</p>
                    <p className="font-medium">{selectedProject.estimatedInvestment || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Funding Sources</p>
                    <p className="font-medium">{selectedProject.fundingSources || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Expected ROI</p>
                    <p className="font-medium">{selectedProject.expectedROI || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Investment Timeline</p>
                    <p className="font-medium">{selectedProject.investmentTimeline || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Strategic Information */}
              {selectedProject.strategicRationale && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-primary">Strategic Rationale</h3>
                  <p className="text-sm">{selectedProject.strategicRationale}</p>
                </div>
              )}

              {/* Market Information */}
              {selectedProject.marketOpportunity && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-primary">Market Opportunity</h3>
                  <p className="text-sm">{selectedProject.marketOpportunity}</p>
                </div>
              )}

              {/* Impact */}
              {selectedProject.expectedImpact && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-primary">Expected Impact</h3>
                  <p className="text-sm">{selectedProject.expectedImpact}</p>
                </div>
              )}

              {/* Workflow Status */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-primary">Workflow Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Submitted At</p>
                    <p className="font-medium">
                      {selectedProject.submittedAt 
                        ? format(new Date(selectedProject.submittedAt), "MMM dd, yyyy HH:mm")
                        : "N/A"}
                    </p>
                  </div>
                  {selectedProject.reviewedBy && (
                    <>
                      <div>
                        <p className="text-sm text-muted-foreground">Reviewed By</p>
                        <p className="font-medium">{selectedProject.reviewedBy}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Reviewed At</p>
                        <p className="font-medium">
                          {selectedProject.reviewedAt 
                            ? format(new Date(selectedProject.reviewedAt), "MMM dd, yyyy HH:mm")
                            : "N/A"}
                        </p>
                      </div>
                    </>
                  )}
                  {selectedProject.approvedBy && (
                    <>
                      <div>
                        <p className="text-sm text-muted-foreground">Approved By</p>
                        <p className="font-medium">{selectedProject.approvedBy}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Approved At</p>
                        <p className="font-medium">
                          {selectedProject.approvedAt 
                            ? format(new Date(selectedProject.approvedAt), "MMM dd, yyyy HH:mm")
                            : "N/A"}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
    </>
  );
}

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { ArrowLeft, Search, Filter, FileText, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';

interface SubmittedReportsProps {
  onBack: () => void;
}

interface Report {
  reportId: string;
  project: string;
  auditType: string;
  date: string;
  activities: string[];
  responses: Record<string, any>;
  status: string;
  totalQuestions?: number;
}

// Activity-based question counts
const activityQuestions: Record<string, number> = {
  'Excavation Work': 8,
  'Scaffolding': 10,
  'Concrete Work': 12,
  'Steel Erection': 9,
  'Electrical Work': 11,
  'Painting Work': 7,
  'Welding Work': 10,
  'Hot Work': 8,
  'Work at Height': 9,
  'Material Handling': 6,
};

export default function SubmittedReports({ onBack }: SubmittedReportsProps) {
  const [reports, setReports] = useState<Report[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProject, setFilterProject] = useState('all');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [projectsMap, setProjectsMap] = useState<Record<string, string>>({});

  useEffect(() => {
    // Load reports from localStorage
    const savedReports = JSON.parse(localStorage.getItem('auditReports') || '[]');
    setReports(savedReports);
    
    // Load projects to get project names
    const defaultProjects = [
      { id: 'PROJ001', name: 'Metro Rail Phase 2 - Mumbai' },
      { id: 'PROJ002', name: 'Highway NH-48 - Gujarat' },
      { id: 'PROJ003', name: 'Warehouse Construction - Pune' },
      { id: 'PROJ004', name: 'Bridge Construction - Delhi' },
      { id: 'PROJ005', name: 'Residential Complex - Bangalore' },
    ];
    
    const uploadedProjects = JSON.parse(localStorage.getItem('projects') || '[]');
    
    const allProjects = [
      ...defaultProjects,
      ...uploadedProjects.map((project: any) => ({
        id: project.projectId,
        name: project.projectName,
      })),
    ];
    
    // Create a map of project ID to project name
    const map: Record<string, string> = {};
    allProjects.forEach((project) => {
      map[project.id] = project.name;
    });
    setProjectsMap(map);
  }, []);
  
  const getProjectName = (projectId: string) => {
    return projectsMap[projectId] || projectId;
  };

  const getProjectInitial = (projectId: string) => {
    const name = projectsMap[projectId] || projectId;
    return name.charAt(0).toUpperCase();
  };

  const getAvatarColor = (projectId: string) => {
    const colors = [
      'bg-[#57664C]', // dark olive
      'bg-[#80AD9B]', // sage green
      'bg-[#A68D86]', // dusty rose
      'bg-[#6B8E7D]', // variant
      'bg-[#9C8276]', // variant
      'bg-[#4A5940]', // darker olive
      'bg-[#6D9985]', // darker sage
      'bg-[#8B7268]', // darker rose
    ];
    const index = projectId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  const getTotalQuestions = (report: Report) => {
    // Calculate total questions based on selected activities
    return report.activities.reduce((total, activity) => {
      return total + (activityQuestions[activity] || 10);
    }, 0);
  };
      
  const getAnsweredQuestions = (report: Report) => {
    // Count how many questions have been answered
    return Object.values(report.responses).filter((r: any) => r.answer).length;
  };

  const getCompletionRatio = (report: Report) => {
    const total = getTotalQuestions(report);
    const answered = getAnsweredQuestions(report);
    return `${answered}/${total}`;
  };

  const calculateNCStatus = (report: Report) => {
    const total = getTotalQuestions(report);
    const answered = getAnsweredQuestions(report);
    
    // If not all questions answered, status is Pending
    if (answered < total) {
      return 'pending';
    }
    
    // If all answered, check for open NCs
    const responses = Object.values(report.responses);
    const nonConforming = responses.filter((r: any) => r.answer === 'No');
    const ncOpen = nonConforming.filter((r: any) => r.closureAvailable === 'No').length;
    
    return ncOpen > 0 ? 'nc_open' : 'clear';
  };

  const getStats = (report: Report) => {
    const responses = Object.values(report.responses);
    const totalChecks = getTotalQuestions(report);
    const answered = getAnsweredQuestions(report);
    const conforming = responses.filter((r: any) => r.answer === 'Yes').length;
    const nonConforming = responses.filter((r: any) => r.answer === 'No').length;
    const ncClosed = responses.filter((r: any) => r.answer === 'No' && r.closureAvailable === 'Yes').length;
    const ncOpen = responses.filter((r: any) => r.answer === 'No' && r.closureAvailable === 'No').length;
    
    return { totalChecks, answered, conforming, nonConforming, ncClosed, ncOpen };
  };

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.reportId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getProjectName(report.project).toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.auditType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesProject = filterProject === 'all' || report.project === filterProject;
    
    return matchesSearch && matchesProject;
  });

  const projects = Array.from(new Set(reports.map((r) => r.project)));

  if (selectedReport) {
    const stats = getStats(selectedReport);
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-6">
            <Button variant="ghost" onClick={() => setSelectedReport(null)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Reports
            </Button>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>Report Details</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{selectedReport.reportId}</p>
                </div>
                <Badge className={stats.ncOpen > 0 ? 'bg-red-500' : 'bg-green-500'}>
                  {stats.ncOpen > 0 ? 'NC Open' : 'All Clear'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Project</p>
                  <p>{getProjectName(selectedReport.project)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Audit Type</p>
                  <p>{selectedReport.auditType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p>{new Date(selectedReport.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="capitalize">{selectedReport.status}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Activities</p>
                <div className="flex flex-wrap gap-2">
                  {selectedReport.activities.map((activity) => (
                    <Badge key={activity} variant="outline">
                      {activity}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Card>
                  <CardContent className="pt-4 text-center">
                    <div className="text-gray-600 text-sm">Total</div>
                    <div className="text-blue-600">{stats.totalChecks}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4 text-center">
                    <div className="text-gray-600 text-sm">Conforming</div>
                    <div className="text-green-600">{stats.conforming}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4 text-center">
                    <div className="text-gray-600 text-sm">Non-Conforming</div>
                    <div className="text-red-600">{stats.nonConforming}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4 text-center">
                    <div className="text-gray-600 text-sm">NC Closed</div>
                    <div className="text-green-600">{stats.ncClosed}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4 text-center">
                    <div className="text-gray-600 text-sm">NC Open</div>
                    <div className="text-red-600">{stats.ncOpen}</div>
                  </CardContent>
                </Card>
              </div>

              {stats.nonConforming > 0 && (
                <div>
                  <h3 className="mb-3">Non-Conformances</h3>
                  <div className="space-y-3">
                    {Object.entries(selectedReport.responses)
                      .filter(([_, response]: [string, any]) => response.answer === 'No')
                      .map(([key, response]: [string, any]) => (
                        <Card key={key} className="border-l-4 border-l-red-500">
                          <CardContent className="pt-4">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <p className="text-sm text-gray-600">Activity: {key.split('-')[0]}</p>
                                {response.ncStatement && (
                                  <p className="mt-2">{response.ncStatement}</p>
                                )}
                              </div>
                              <Badge className={response.closureAvailable === 'Yes' ? 'bg-green-500' : 'bg-red-500'}>
                                {response.closureAvailable === 'Yes' ? 'Closed' : 'Open'}
                              </Badge>
                            </div>
                            {response.closureAvailable === 'Yes' && response.closureAction && (
                              <div className="mt-3 p-3 bg-green-50 rounded">
                                <p className="text-sm text-gray-600">Closure Action:</p>
                                <p className="text-sm mt-1">{response.closureAction}</p>
                              </div>
                            )}
                            {response.closureAvailable === 'No' && (
                              <div className="mt-3 p-3 bg-orange-50 rounded">
                                <p className="text-sm text-gray-600">Expected Action:</p>
                                <p className="text-sm mt-1">{response.expectedAction}</p>
                                <p className="text-sm text-gray-600 mt-2">Expected Date:</p>
                                <p className="text-sm mt-1">{response.expectedDate}</p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAF9] p-6 md:p-8">
      <div className="container mx-auto max-w-9xl">
        {/* Header Section */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={onBack} 
            className="text-[#57664C] hover:bg-white/80 hover:text-[#57664C] transition-all"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        {/* Main Card */}
        <Card className="shadow-xl border-0 bg-white rounded-2xl overflow-hidden">
          {/* Card Header with gradient */}
          <CardHeader className="bg-gradient-to-r from-[#57664C] to-[#6B8E7D] text-white border-0 py-8">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl font-bold tracking-tight">Submitted Reports</CardTitle>
                <p className="text-white/80 mt-2 text-sm">
                  {reports.length} {reports.length === 1 ? 'report' : 'reports'} total
                </p>
              </div>
              <div className="hidden md:flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <FileText className="w-5 h-5" />
                <span className="text-sm">Audit Management</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8 bg-[#F8FAF9]">
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#A68D86] w-5 h-5" />
                <Input
                  placeholder="Search by report number, project, or audit type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 border-2 border-[#A68D86]/20 focus:border-[#80AD9B] focus:ring-[#80AD9B] rounded-xl bg-white text-[#57664C] placeholder:text-[#A68D86]/60"
                />
              </div>
              <Select value={filterProject} onValueChange={setFilterProject}>
                <SelectTrigger className="w-full md:w-64 h-12 border-2 border-[#A68D86]/20 rounded-xl bg-white text-[#57664C]">
                  <Filter className="w-4 h-4 mr-2 text-[#A68D86]" />
                  <SelectValue placeholder="Filter by project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  {projects.map((project) => (
                    <SelectItem key={project} value={project}>
                      {getProjectName(project)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Empty State */}
            {filteredReports.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-[#A68D86]/30">
                <div className="bg-[#F8FAF9] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-10 h-10 text-[#A68D86]" />
                </div>
                <p className="text-[#57664C] text-xl font-medium">No reports found</p>
                <p className="text-[#A68D86] text-sm mt-2">
                  {reports.length === 0
                    ? 'Start by creating a new audit report'
                    : 'Try adjusting your search filters'}
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-[#A68D86]/10">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-[#57664C]/5 to-[#80AD9B]/5 border-b-2 border-[#A68D86]/10 hover:bg-gradient-to-r hover:from-[#57664C]/5 hover:to-[#80AD9B]/5">
                      <TableHead className="font-bold text-[#57664C] py-4">Project</TableHead>
                      <TableHead className="font-bold text-[#57664C]">Audit Type</TableHead>
                      <TableHead className="font-bold text-[#57664C]">Date</TableHead>
                      <TableHead className="font-bold text-[#57664C]">Completion</TableHead>
                      <TableHead className="font-bold text-[#57664C]">NC Status</TableHead>
                      <TableHead className="text-right font-bold text-[#57664C]">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.map((report) => {
                      const ncStatus = calculateNCStatus(report);
                      const total = getTotalQuestions(report);
                      const answered = getAnsweredQuestions(report);
                      const percentage = Math.round((answered / total) * 100);
                      
                      return (
                        <TableRow 
                          key={report.reportId} 
                          className="hover:bg-[#F8FAF9]/80 transition-all duration-200 border-b border-[#A68D86]/10"
                        >
                          <TableCell className="py-5">
                            <div className="flex items-center gap-4">
                              <div
                                className={`w-12 h-12 rounded-full ${getAvatarColor(report.project)} flex items-center justify-center text-white flex-shrink-0 shadow-md`}
                              >
                                <span className="text-xl font-semibold">{getProjectInitial(report.project)}</span>
                              </div>
                              <div>
                                <p className="font-semibold text-[#57664C]">{getProjectName(report.project)}</p>
                                <p className="text-xs text-[#A68D86] font-medium mt-0.5">{report.reportId}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium text-[#57664C]/90">{report.auditType}</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-[#57664C]/80">{new Date(report.date).toLocaleDateString()}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="font-bold text-[#80AD9B]">
                                {answered}/{total}
                              </div>
                              <div className="flex-1 bg-[#A68D86]/10 rounded-full h-2.5 max-w-[120px]">
                                <div
                                  className="bg-gradient-to-r from-[#80AD9B] to-[#6B8E7D] h-2.5 rounded-full transition-all duration-500 shadow-sm"
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                              <span className="text-xs font-semibold text-[#57664C]/70 min-w-[35px]">{percentage}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {ncStatus === 'pending' ? (
                              <Badge className="bg-[#A68D86] hover:bg-[#9C8276] text-white border-0 px-3 py-1.5 shadow-sm">
                                <Clock className="w-3.5 h-3.5 mr-1.5" />
                                Pending
                              </Badge>
                            ) : ncStatus === 'clear' ? (
                              <Badge className="bg-[#80AD9B] hover:bg-[#6D9985] text-white border-0 px-3 py-1.5 shadow-sm">
                                <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                                All Clear
                              </Badge>
                            ) : (
                              <Badge className="bg-[#C85A54] hover:bg-[#B54A44] text-white border-0 px-3 py-1.5 shadow-sm">
                                <AlertCircle className="w-3.5 h-3.5 mr-1.5" />
                                NC Open
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedReport(report)}
                              className="border-2 border-[#57664C] text-[#57664C] hover:bg-[#57664C] hover:text-white transition-all duration-200 font-medium px-4 rounded-lg"
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
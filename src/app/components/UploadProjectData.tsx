import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface UploadProjectDataProps {
  onBack: () => void;
}

export default function UploadProjectData({ onBack }: UploadProjectDataProps) {
  const [formData, setFormData] = useState({
    projectName: '',
    clientName: '',
    location: '',
    scopeOfWork: '',
    startDate: '',
    endDate: '',
    pmName: '',
    contact: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const projects = JSON.parse(localStorage.getItem('projects') || '[]');

    const newProject = {
      ...formData,
      projectId: `UPROJ${String(projects.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
    };

    projects.push(newProject);
    localStorage.setItem('projects', JSON.stringify(projects));

    toast.success('Project data uploaded successfully!', {
      style: {
        background: 'var(--color-success)',
        color: 'white',
      },
    });

    setFormData({
      projectName: '',
      clientName: '',
      location: '',
      scopeOfWork: '',
      startDate: '',
      endDate: '',
      pmName: '',
      contact: '',
    });
  };

  return (
    <div
      className="min-h-screen p-6"
      style={{ backgroundColor: 'var(--color-background)' }}
    >
      <div className="container mx-auto max-w-9xl">
        {/* Header */}
        <div className="mb-6 ">
          <Button variant="ghost" onClick={onBack} className="hover:bg-white/80">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-primary">
              Upload Project Data
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="projectName">Project Name *</Label>
                  <Input
                    id="projectName"
                    value={formData.projectName}
                    onChange={(e) =>
                      handleChange('projectName', e.target.value)
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clientName">Client Name *</Label>
                  <Input
                    id="clientName"
                    value={formData.clientName}
                    onChange={(e) =>
                      handleChange('clientName', e.target.value)
                    }
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      handleChange('location', e.target.value)
                    }
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="scopeOfWork">Scope of Work *</Label>
                  <Textarea
                    id="scopeOfWork"
                    rows={4}
                    value={formData.scopeOfWork}
                    onChange={(e) =>
                      handleChange('scopeOfWork', e.target.value)
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      handleChange('startDate', e.target.value)
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      handleChange('endDate', e.target.value)
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pmName">Project Manager *</Label>
                  <Input
                    id="pmName"
                    value={formData.pmName}
                    onChange={(e) =>
                      handleChange('pmName', e.target.value)
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact">Contact *</Label>
                  <Input
                    id="contact"
                    type="tel"
                    value={formData.contact}
                    onChange={(e) =>
                      handleChange('contact', e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  className="text-accent border-[var(--color-accent)]"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  className="bg-primary text-white hover:opacity-90"
                >
                  Upload Project Data
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

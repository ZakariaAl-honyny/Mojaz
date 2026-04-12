'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { 
  GraduationCap, 
  Search, 
  Plus, 
  Filter,
  User,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  MoreVertical,
  FileText,
  Download,
  Users
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Mock trainees data
const mockTrainees = [
  {
    id: '1',
    name: 'Ahmed Al-Salmi',
    applicationNo: 'MOJ-2025-48291037',
    category: 'B',
    trainingHours: 12,
    requiredHours: 30,
    status: 'in-progress',
    lastSession: '2025-03-15',
    center: 'North Riyadh'
  },
  {
    id: '2',
    name: 'Salim Al-Harbi',
    applicationNo: 'MOJ-2025-99210382',
    category: 'B',
    trainingHours: 20,
    requiredHours: 20,
    status: 'completed',
    lastSession: '2025-03-10',
    center: 'North Riyadh'
  },
  {
    id: '3',
    name: 'Ali Al-Otaibi',
    applicationNo: 'MOJ-2025-38472190',
    category: 'C',
    trainingHours: 8,
    requiredHours: 40,
    status: 'in-progress',
    lastSession: '2025-03-14',
    center: 'East Riyadh'
  },
  {
    id: '4',
    name: 'Fahad Al-Mutairi',
    applicationNo: 'MOJ-2025-19283746',
    category: 'B',
    trainingHours: 30,
    requiredHours: 30,
    status: 'completed',
    lastSession: '2025-03-12',
    center: 'West Riyadh'
  },
  {
    id: '5',
    name: 'Mohammed Al-Dossary',
    applicationNo: 'MOJ-2025-56473829',
    category: 'A',
    trainingHours: 0,
    requiredHours: 15,
    status: 'not-started',
    lastSession: null,
    center: 'North Riyadh'
  }
];

const getStatusBadge = (status: string) => {
  const statusClasses: any = {
    'completed': 'bg-success/10 text-success',
    'in-progress': 'bg-warning/10 text-warning',
    'not-started': 'bg-neutral-100 text-neutral-600',
    'scheduled': 'bg-blue-100 text-blue-600'
  };
  
  return (
    <Badge className={cn("font-bold text-xs uppercase px-3 py-1", statusClasses[status])}>
      {status.replace('-', ' ')}
    </Badge>
  );
};

export default function EmployeeTrainingPage() {
  const t = useTranslations('employee.training');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [trainees] = useState(mockTrainees);

  const filteredTrainees = trainees.filter(trainee => {
    const matchesSearch = trainee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trainee.applicationNo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || trainee.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const completedCount = trainees.filter(t => t.status === 'completed').length;
  const inProgressCount = trainees.filter(t => t.status === 'in-progress').length;
  const notStartedCount = trainees.filter(t => t.status === 'not-started').length;

  return (
    <div className="space-y-8 py-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-black text-neutral-900 tracking-tight leading-none">
            {t('title')}
          </h1>
          <p className="text-lg text-neutral-500 max-w-xl font-medium leading-relaxed">
            {t('subtitle')}
          </p>
        </div>
        <Button className="h-12 px-6 font-bold rounded-xl bg-primary-500 hover:bg-primary-600 shadow-lg shadow-primary-500/20">
          <Plus className="w-5 h-5 me-2" />
          {t('createSession')}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-primary-500" />
            </div>
            <div>
              <p className="text-sm text-neutral-500 font-medium">Total Trainees</p>
              <p className="text-2xl font-black text-neutral-900">{trainees.length}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-neutral-500 font-medium">{t('filter.completed')}</p>
              <p className="text-2xl font-black text-neutral-900">{completedCount}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="text-sm text-neutral-500 font-medium">{t('filter.pending')}</p>
              <p className="text-2xl font-black text-neutral-900">{inProgressCount}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-neutral-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-neutral-500" />
            </div>
            <div>
              <p className="text-sm text-neutral-500 font-medium">{t('filter.notStarted') || 'Not Started'}</p>
              <p className="text-2xl font-black text-neutral-900">{notStartedCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="border-none shadow-lg rounded-2xl overflow-hidden bg-neutral-50">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute start-4 top-3.5 h-5 w-5 text-neutral-300" />
            <Input 
              className="h-11 ps-11 rounded-xl bg-white" 
              placeholder={t('search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterStatus === 'all' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('all')}
              className={cn(
                "h-11 font-bold rounded-xl",
                filterStatus === 'all' ? "bg-primary-500" : "border-neutral-200"
              )}
            >
              {t('filter.all')}
            </Button>
            <Button
              variant={filterStatus === 'completed' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('completed')}
              className={cn(
                "h-11 font-bold rounded-xl",
                filterStatus === 'completed' ? "bg-primary-500" : "border-neutral-200"
              )}
            >
              {t('filter.completed')}
            </Button>
            <Button
              variant={filterStatus === 'in-progress' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('in-progress')}
              className={cn(
                "h-11 font-bold rounded-xl",
                filterStatus === 'in-progress' ? "bg-primary-500" : "border-neutral-200"
              )}
            >
              {t('filter.pending')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Trainees Table */}
      <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white">
        <CardHeader className="p-6 pb-0">
          <CardTitle className="text-xl font-bold text-neutral-900">{t('allTrainees')}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-100">
                  <th className="text-start py-3 px-4 text-sm font-bold text-neutral-400 uppercase tracking-wider">Applicant</th>
                  <th className="text-start py-3 px-4 text-sm font-bold text-neutral-400 uppercase tracking-wider">App No.</th>
                  <th className="text-start py-3 px-4 text-sm font-bold text-neutral-400 uppercase tracking-wider">Progress</th>
                  <th className="text-start py-3 px-4 text-sm font-bold text-neutral-400 uppercase tracking-wider">Status</th>
                  <th className="text-start py-3 px-4 text-sm font-bold text-neutral-400 uppercase tracking-wider">Last Session</th>
                  <th className="text-end py-3 px-4 text-sm font-bold text-neutral-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTrainees.map((trainee) => (
                  <tr key={trainee.id} className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                          <User className="w-5 h-5 text-primary-500" />
                        </div>
                        <div>
                          <p className="font-bold text-neutral-900">{trainee.name}</p>
                          <p className="text-xs text-neutral-500">Category {trainee.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-mono text-sm font-medium text-neutral-600">{trainee.applicationNo}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden max-w-[100px]">
                          <div 
                            className="h-full bg-primary-500 rounded-full" 
                            style={{ width: `${(trainee.trainingHours / trainee.requiredHours) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold text-neutral-900">
                          {trainee.trainingHours}/{trainee.requiredHours}h
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(trainee.status)}
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-neutral-500">
                        {trainee.lastSession || '-'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-end">
                      <Button variant="outline" className="h-9 font-bold rounded-lg border-neutral-200">
                        <FileText className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredTrainees.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
              <p className="text-neutral-500 font-medium">No trainees found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
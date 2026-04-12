'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { 
  ClipboardList, 
  Search, 
  Plus, 
  Filter,
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  XCircle,
  Target,
  Car,
  FileText,
  Download,
  ChevronRight,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Mock test schedule data
const mockTests = {
  upcoming: [
    {
      id: '1',
      applicant: 'Ahmed Al-Salmi',
      applicationNo: 'MOJ-2025-48291037',
      type: 'practical',
      date: '2025-04-15',
      time: '08:00',
      center: 'North Riyadh',
      status: 'scheduled'
    },
    {
      id: '2',
      applicant: 'Ali Al-Otaibi',
      applicationNo: 'MOJ-2025-38472190',
      type: 'theory',
      date: '2025-04-16',
      time: '10:00',
      center: 'East Riyadh',
      status: 'scheduled'
    },
    {
      id: '3',
      applicant: 'Fahad Al-Mutairi',
      applicationNo: 'MOJ-2025-19283746',
      type: 'practical',
      date: '2025-04-17',
      time: '08:00',
      center: 'West Riyadh',
      status: 'scheduled'
    }
  ],
  completed: [
    {
      id: 'c1',
      applicant: 'Salim Al-Harbi',
      applicationNo: 'MOJ-2025-99210382',
      type: 'theory',
      date: '2025-03-10',
      score: 82,
      passed: true,
      center: 'North Riyadh'
    },
    {
      id: 'c2',
      applicant: 'Omar Al-Rashid',
      applicationNo: 'MOJ-2025-77612834',
      type: 'practical',
      date: '2025-03-08',
      score: 65,
      passed: false,
      center: 'North Riyadh'
    }
  ]
};

const getTypeIcon = (type: string) => {
  return type === 'theory' ? (
    <Target className="w-5 h-5 text-orange-500" />
  ) : (
    <Car className="w-5 h-5 text-blue-500" />
  );
};

export default function EmployeeTestsPage() {
  const t = useTranslations('employee.testing');
  const [tab, setTab] = useState<'schedule' | 'results' | 'reports'>('schedule');
  const [tests] = useState(mockTests);

  const upcomingCount = tests.upcoming.length;
  const completedCount = tests.completed.length;
  const passedCount = tests.completed.filter(t => t.passed).length;
  const passRate = completedCount > 0 ? Math.round((passedCount / completedCount) * 100) : 0;

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
        <Button className="h-12 px-6 font-bold rounded-xl bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/20">
          <Plus className="w-5 h-5 me-2" />
          Schedule Test
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-neutral-500 font-medium">{t('upcoming')}</p>
              <p className="text-2xl font-black text-neutral-900">{upcomingCount}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-neutral-500 font-medium">{t('completed')}</p>
              <p className="text-2xl font-black text-neutral-900">{completedCount}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-neutral-500 font-medium">Passed</p>
              <p className="text-2xl font-black text-neutral-900">{passedCount}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-primary-500" />
            </div>
            <div>
              <p className="text-sm text-neutral-500 font-medium">Pass Rate</p>
              <p className="text-2xl font-black text-neutral-900">{passRate}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-neutral-200 pb-1">
        <Button
          variant={tab === 'schedule' ? 'default' : 'ghost'}
          onClick={() => setTab('schedule')}
          className={cn(
            "h-11 font-bold rounded-t-xl rounded-b-none",
            tab === 'schedule' ? "bg-orange-500" : "text-neutral-500"
          )}
        >
          <Calendar className="w-4 h-4 me-2" />
          {t('schedule')}
        </Button>
        <Button
          variant={tab === 'results' ? 'default' : 'ghost'}
          onClick={() => setTab('results')}
          className={cn(
            "h-11 font-bold rounded-t-xl rounded-b-none",
            tab === 'results' ? "bg-orange-500" : "text-neutral-500"
          )}
        >
          <FileText className="w-4 h-4 me-2" />
          {t('enterResults')}
        </Button>
        <Button
          variant={tab === 'reports' ? 'default' : 'ghost'}
          onClick={() => setTab('reports')}
          className={cn(
            "h-11 font-bold rounded-t-xl rounded-b-none",
            tab === 'reports' ? "bg-orange-500" : "text-neutral-500"
          )}
        >
          <BarChart3 className="w-4 h-4 me-2" />
          {t('reports')}
        </Button>
      </div>

      {/* Schedule Tab */}
      {tab === 'schedule' && (
        <div className="space-y-4">
          <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white">
            <CardHeader className="p-6 pb-4">
              <CardTitle className="text-xl font-bold text-neutral-900 flex items-center gap-3">
                <Calendar className="w-5 h-5 text-orange-500" />
                Upcoming Tests
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="space-y-3">
                {tests.upcoming.map((test) => (
                  <div 
                    key={test.id}
                    className="p-4 bg-neutral-50 rounded-xl flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                        {getTypeIcon(test.type)}
                      </div>
                      <div>
                        <p className="font-bold text-neutral-900">{test.applicant}</p>
                        <p className="text-xs text-neutral-500">{test.applicationNo}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-end">
                        <p className="font-bold text-neutral-900">{test.date}</p>
                        <p className="text-xs text-neutral-500">{test.time} - {test.center}</p>
                      </div>
                      <Button variant="outline" className="h-9 font-bold rounded-lg border-neutral-200">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
                
                {tests.upcoming.length === 0 && (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                    <p className="text-neutral-500 font-medium">No upcoming tests</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Results Tab */}
      {tab === 'results' && (
        <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white">
          <CardHeader className="p-6 pb-4">
            <CardTitle className="text-xl font-bold text-neutral-900 flex items-center gap-3">
              <FileText className="w-5 h-5 text-orange-500" />
              Test Results
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {tests.completed.map((test) => (
                <div 
                  key={test.id}
                  className={cn(
                    "p-4 rounded-xl flex items-center justify-between border",
                    test.passed ? "bg-success/5 border-success/20" : "bg-error/5 border-error/20"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      test.passed ? "bg-success/10" : "bg-error/10"
                    )}>
                      {test.passed ? (
                        <CheckCircle2 className="w-6 h-6 text-success" />
                      ) : (
                        <XCircle className="w-6 h-6 text-error" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-neutral-900">{test.applicant}</p>
                      <p className="text-xs text-neutral-500">{test.applicationNo}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-end">
                      <p className={cn(
                        "text-2xl font-black",
                        test.passed ? "text-success" : "text-error"
                      )}>
                        {test.score}%
                      </p>
                      <p className="text-xs text-neutral-500">{test.date}</p>
                    </div>
                    <div className={cn(
                      "px-3 py-1 rounded-full text-xs font-bold uppercase",
                      test.passed ? "bg-success/10 text-success" : "bg-error/10 text-error"
                    )}>
                      {test.passed ? 'Pass' : 'Fail'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reports Tab */}
      {tab === 'reports' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white">
            <CardContent className="p-8">
              <BarChart3 className="w-12 h-12 text-neutral-300 mb-4" />
              <h3 className="text-xl font-bold text-neutral-900 mb-2">Pass Rate by Category</h3>
              <p className="text-neutral-500 font-medium mb-6">View breakdown of pass rates by license category</p>
              <Button variant="outline" className="w-full h-11 font-bold rounded-xl border-neutral-200">
                <ChevronRight className="w-4 h-4 me-2" />
                View Full Report
              </Button>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white">
            <CardContent className="p-8">
              <Calendar className="w-12 h-12 text-neutral-300 mb-4" />
              <h3 className="text-xl font-bold text-neutral-900 mb-2">Test Volume</h3>
              <p className="text-neutral-500 font-medium mb-6">View daily and weekly test volume trends</p>
              <Button variant="outline" className="w-full h-11 font-bold rounded-xl border-neutral-200">
                <ChevronRight className="w-4 h-4 me-2" />
                View Full Report
              </Button>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white">
            <CardContent className="p-8">
              <Users className="w-12 h-12 text-neutral-300 mb-4" />
              <h3 className="text-xl font-bold text-neutral-900 mb-2">Examiner Performance</h3>
              <p className="text-neutral-500 font-medium mb-6">View examiner statistics and metrics</p>
              <Button variant="outline" className="w-full h-11 font-bold rounded-xl border-neutral-200">
                <ChevronRight className="w-4 h-4 me-2" />
                View Full Report
              </Button>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white">
            <CardContent className="p-8">
              <Download className="w-12 h-12 text-neutral-300 mb-4" />
              <h3 className="text-xl font-bold text-neutral-900 mb-2">Export Data</h3>
              <p className="text-neutral-500 font-medium mb-6">Export test data to Excel or PDF</p>
              <Button variant="outline" className="w-full h-11 font-bold rounded-xl border-neutral-200">
                <Download className="w-4 h-4 me-2" />
                Export
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
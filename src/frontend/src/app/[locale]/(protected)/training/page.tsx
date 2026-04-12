'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { 
  GraduationCap, 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  CheckCircle2,
  Plus,
  Filter,
  Search,
  BookOpen,
  Car
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Mock training sessions data
const mockTrainingSessions = {
  completed: [
    {
      id: '1',
      date: '2025-03-15',
      time: '08:00 - 10:00',
      duration: 2,
      instructor: 'Ahmed Al-Mutairi',
      center: 'North Riyadh Driving Center',
      type: 'practical',
      notes: 'Focus on lane changing and highway merging'
    },
    {
      id: '2',
      date: '2025-03-12',
      time: '08:00 - 10:00',
      duration: 2,
      instructor: 'Ahmed Al-Mutairi',
      center: 'North Riyadh Driving Center',
      type: 'practical',
      notes: 'Parallel parking practice'
    },
    {
      id: '3',
      date: '2025-03-08',
      time: '16:00 - 18:00',
      duration: 2,
      instructor: 'Saud Al-Dossary',
      center: 'North Riyadh Driving Center',
      type: 'practical',
      notes: 'Traffic sign recognition'
    },
    {
      id: '4',
      date: '2025-03-05',
      time: '08:00 - 10:00',
      duration: 2,
      instructor: 'Saud Al-Dossary',
      center: 'North Riyadh Driving Center',
      type: 'practical',
      notes: 'Basic vehicle control'
    }
  ],
  upcoming: [
    {
      id: 'up1',
      date: '2025-04-01',
      time: '08:00 - 10:00',
      duration: 2,
      instructor: 'Ahmed Al-Mutairi',
      center: 'North Riyadh Driving Center',
      type: 'practical',
      notes: 'Roundabout navigation'
    }
  ],
  totalHoursCompleted: 12,
  hoursRequired: 30
};

const SessionCard = ({ session, isUpcoming = false }: { session: any; isUpcoming?: boolean }) => {
  const t = useTranslations('training');
  
  return (
    <Card className={cn(
      "border-none shadow-lg rounded-2xl overflow-hidden bg-white",
      isUpcoming ? "border-2 border-primary-100" : ""
    )}>
      <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center",
            isUpcoming ? "bg-primary-100" : "bg-success/10"
          )}>
            {isUpcoming ? (
              <Calendar className="w-6 h-6 text-primary-500" />
            ) : (
              <CheckCircle2 className="w-6 h-6 text-success" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-bold text-neutral-900">
                {session.date}
              </h4>
              <span className="text-sm text-neutral-500">• {session.time}</span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="flex items-center gap-1 text-neutral-500">
                <User className="w-4 h-4" />
                {session.instructor}
              </span>
              <span className="flex items-center gap-1 text-neutral-500">
                <MapPin className="w-4 h-4" />
                {session.center}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {isUpcoming ? (
            <Button className="h-10 font-bold rounded-xl bg-primary-500 hover:bg-primary-600">
              Join Session
            </Button>
          ) : (
            <Badge className="bg-success/10 text-success font-bold text-xs">
              {t('completed')}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default function TrainingPage() {
  const t = useTranslations('training');
  const [sessions] = useState(mockTrainingSessions);
  const [filter, setFilter] = useState<'all' | 'completed' | 'upcoming'>('all');

  const filteredSessions = filter === 'all' 
    ? [...sessions.upcoming, ...sessions.completed]
    : filter === 'completed'
      ? sessions.completed
      : sessions.upcoming;

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
          {t('bookSession')}
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-gradient-to-br from-primary-500 to-primary-600 text-white">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-100 font-medium mb-2">{t('totalHours')}</p>
                <p className="text-4xl font-black">
                  {sessions.totalHoursCompleted}
                  <span className="text-xl font-bold text-primary-200">/{sessions.hoursRequired}</span>
                </p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Clock className="w-8 h-8" />
              </div>
            </div>
            <div className="mt-4">
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white rounded-full" 
                  style={{ width: `${(sessions.totalHoursCompleted / sessions.hoursRequired) * 100}%` }}
                />
              </div>
              <p className="text-xs text-primary-100 mt-2">
                {sessions.hoursRequired - sessions.totalHoursCompleted} hours remaining
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-500 font-medium mb-2">{t('completed')}</p>
                <p className="text-4xl font-black text-neutral-900">
                  {sessions.completed.length}
                </p>
              </div>
              <div className="w-16 h-16 bg-success/10 rounded-2xl flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-success" />
              </div>
            </div>
            <p className="text-sm text-neutral-500 mt-2">
              {sessions.completed.length} sessions completed
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-500 font-medium mb-2">{t('upcoming')}</p>
                <p className="text-4xl font-black text-neutral-900">
                  {sessions.upcoming.length}
                </p>
              </div>
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center">
                <Calendar className="w-8 h-8 text-primary-500" />
              </div>
            </div>
            <p className="text-sm text-neutral-500 mt-2">
              Next session: {sessions.upcoming[0]?.date}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
          className={cn(
            "h-11 font-bold rounded-xl",
            filter === 'all' ? "bg-primary-500" : "border-neutral-200"
          )}
        >
          All Sessions
        </Button>
        <Button
          variant={filter === 'upcoming' ? 'default' : 'outline'}
          onClick={() => setFilter('upcoming')}
          className={cn(
            "h-11 font-bold rounded-xl",
            filter === 'upcoming' ? "bg-primary-500" : "border-neutral-200"
          )}
        >
          {t('upcoming')}
        </Button>
        <Button
          variant={filter === 'completed' ? 'default' : 'outline'}
          onClick={() => setFilter('completed')}
          className={cn(
            "h-11 font-bold rounded-xl",
            filter === 'completed' ? "bg-primary-500" : "border-neutral-200"
          )}
        >
          {t('completed')}
        </Button>
      </div>

      {/* Sessions List */}
      <div className="space-y-4">
        {filteredSessions.map((session) => (
          <SessionCard 
            key={session.id} 
            session={session} 
            isUpcoming={session.date === sessions.upcoming.find(s => s.id === session.id)?.date}
          />
        ))}
        
        {filteredSessions.length === 0 && (
          <Card className="border-none shadow-lg rounded-2xl overflow-hidden bg-neutral-50">
            <CardContent className="p-12 flex flex-col items-center justify-center text-center">
              <GraduationCap className="w-16 h-16 text-neutral-300 mb-4" />
              <h3 className="text-xl font-bold text-neutral-600 mb-2">{t('noSessions')}</h3>
              <p className="text-neutral-400 mb-6">{t('noSessionsDesc')}</p>
              <Button className="h-11 font-bold rounded-xl bg-primary-500 hover:bg-primary-600">
                <Plus className="w-5 h-5 me-2" />
                {t('bookSession')}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Notes Section */}
      <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-neutral-50">
        <CardHeader className="p-6 pb-2">
          <CardTitle className="text-xl font-bold text-neutral-900 flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-primary-500" />
            Instructor Notes
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sessions.completed.slice(0, 4).map((session) => (
              <div key={session.id} className="p-4 bg-white rounded-xl border border-neutral-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-neutral-900">{session.date}</span>
                  <Badge variant="outline" className="text-xs font-bold">
                    {session.duration}h
                  </Badge>
                </div>
                <p className="text-sm text-neutral-500">{session.notes}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
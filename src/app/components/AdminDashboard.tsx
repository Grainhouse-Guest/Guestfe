import { useState } from 'react';
import { User } from '../App';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Calendar as CalendarIcon, TrendingUp, Users, CheckCircle, Percent } from 'lucide-react';
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { ko } from 'date-fns/locale';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

interface AdminDashboardProps {
  user: User;
}

export function AdminDashboard({ user }: AdminDashboardProps) {
  const today = new Date();
  const [dateFrom, setDateFrom] = useState<Date>(today);
  const [dateTo, setDateTo] = useState<Date>(today);
  const [quickRange, setQuickRange] = useState('today');

  const handleQuickRange = (range: string) => {
    setQuickRange(range);
    const today = new Date();
    
    switch (range) {
      case 'today':
        setDateFrom(today);
        setDateTo(today);
        break;
      case 'month':
        setDateFrom(startOfMonth(today));
        setDateTo(endOfMonth(today));
        break;
      case 'custom':
        // Keep current dates
        break;
    }
  };

  // Mock data
  const kpiData = {
    totalRegistered: 248,
    totalCheckedIn: 195,
    checkInRate: 78.6,
    freeGuests: 180,
    paidGuests: 68
  };

  const hourlyData = [
    { hour: '22:00', count: 12 },
    { hour: '23:00', count: 28 },
    { hour: '00:00', count: 45 },
    { hour: '01:00', count: 38 },
    { hour: '02:00', count: 32 },
    { hour: '03:00', count: 25 },
    { hour: '04:00', count: 15 }
  ];

  const dailyData = [
    { date: '01/25', registered: 35, checkedIn: 28 },
    { date: '01/26', registered: 42, checkedIn: 38 },
    { date: '01/27', registered: 28, checkedIn: 22 },
    { date: '01/28', registered: 48, checkedIn: 40 },
    { date: '01/29', registered: 38, checkedIn: 30 },
    { date: '01/30', registered: 32, checkedIn: 25 },
    { date: '01/31', registered: 25, checkedIn: 12 }
  ];

  const creatorData = [
    { name: 'admin', registered: 45, checkedIn: 38, rate: 84.4 },
    { name: 'dj_martin', registered: 68, checkedIn: 55, rate: 80.9 },
    { name: 'promoter_kim', registered: 85, checkedIn: 70, rate: 82.4 },
    { name: 'staff_john', registered: 32, checkedIn: 22, rate: 68.8 },
    { name: 'external_event1', registered: 18, checkedIn: 10, rate: 55.6 }
  ];

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl mb-2">대시보드</h1>
        <p className="text-muted-foreground">게스트 통계와 분석을 확인하세요</p>
      </div>

      {/* Date Range Selector */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={quickRange === 'today' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleQuickRange('today')}
            >
              오늘
            </Button>
            <Button
              variant={quickRange === 'month' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleQuickRange('month')}
            >
              이번 달
            </Button>
            <Button
              variant={quickRange === 'custom' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleQuickRange('custom')}
            >
              사용자 정의
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  {format(dateFrom, 'PPP', { locale: ko })}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateFrom}
                  onSelect={(date) => date && setDateFrom(date)}
                  locale={ko}
                />
              </PopoverContent>
            </Popover>

            <span className="text-muted-foreground">~</span>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  {format(dateTo, 'PPP', { locale: ko })}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateTo}
                  onSelect={(date) => date && setDateTo(date)}
                  locale={ko}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">총 등록</span>
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-3xl mb-1">{kpiData.totalRegistered}</div>
          <div className="text-xs text-muted-foreground">명</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">총 입장</span>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-3xl mb-1">{kpiData.totalCheckedIn}</div>
          <div className="text-xs text-muted-foreground">명</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">입장률</span>
            <Percent className="w-5 h-5 text-purple-500" />
          </div>
          <div className="text-3xl mb-1">{kpiData.checkInRate}%</div>
          <div className="text-xs text-green-600 flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" />
            +5.2% vs 지난주
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">무료/유료</span>
            <Users className="w-5 h-5 text-orange-500" />
          </div>
          <div className="text-3xl mb-1">{kpiData.freeGuests}/{kpiData.paidGuests}</div>
          <div className="text-xs text-muted-foreground">
            무료 {((kpiData.freeGuests / kpiData.totalRegistered) * 100).toFixed(0)}%
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Hourly Check-in */}
        <Card className="p-6">
          <h3 className="mb-4">시간대별 입장</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(var(--primary))" name="입장 수" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Daily Trend */}
        <Card className="p-6">
          <h3 className="mb-4">일별 추이</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="registered" stroke="hsl(var(--primary))" name="등록" strokeWidth={2} />
              <Line type="monotone" dataKey="checkedIn" stroke="#10b981" name="입장" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Creator Stats Table */}
      <Card className="p-6">
        <h3 className="mb-4">생성자별 게스트 통계</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>이름</TableHead>
                <TableHead className="text-right">등록</TableHead>
                <TableHead className="text-right">입장</TableHead>
                <TableHead className="text-right">입장률</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {creatorData.map((creator) => (
                <TableRow key={creator.name}>
                  <TableCell>{creator.name}</TableCell>
                  <TableCell className="text-right">{creator.registered}</TableCell>
                  <TableCell className="text-right">{creator.checkedIn}</TableCell>
                  <TableCell className="text-right">
                    <span className={creator.rate >= 75 ? 'text-green-600' : 'text-orange-600'}>
                      {creator.rate}%
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
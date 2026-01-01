import { useState } from 'react';
import { User } from '../App';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { ChevronLeft, ChevronRight, Search, Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { toast } from 'sonner';

interface Guest {
  id: string;
  name: string;
  phone?: string;
  type: 'FREE' | 'PAID';
  status: 'REGISTERED' | 'CHECKED_IN';
  createdBy: string;
  businessDate: string;
  checkedInAt?: string;
  checkedInBy?: string;
}

interface DoorPageProps {
  user: User;
}

export function DoorPage({ user }: DoorPageProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmGuest, setConfirmGuest] = useState<Guest | null>(null);

  // Mock data - in real app this would come from database
  const [guests, setGuests] = useState<Guest[]>([
    {
      id: '1',
      name: '김민수',
      phone: '010-1234-5678',
      type: 'FREE',
      status: 'REGISTERED',
      createdBy: 'admin',
      businessDate: format(new Date(), 'yyyy-MM-dd')
    },
    {
      id: '2',
      name: '이지은',
      phone: '010-9876-5432',
      type: 'PAID',
      status: 'CHECKED_IN',
      createdBy: 'dj_martin',
      businessDate: format(new Date(), 'yyyy-MM-dd'),
      checkedInAt: '2026-01-01T23:30:00',
      checkedInBy: 'staff_john'
    },
    {
      id: '3',
      name: '박서준',
      phone: '010-5555-1234',
      type: 'FREE',
      status: 'REGISTERED',
      createdBy: 'promoter_kim',
      businessDate: format(new Date(), 'yyyy-MM-dd')
    },
    {
      id: '4',
      name: '최유진',
      phone: '010-1111-2222',
      type: 'PAID',
      status: 'REGISTERED',
      createdBy: 'admin',
      businessDate: format(new Date(), 'yyyy-MM-dd')
    },
    {
      id: '5',
      name: '정해인',
      type: 'FREE',
      status: 'CHECKED_IN',
      createdBy: 'staff_john',
      businessDate: format(new Date(), 'yyyy-MM-dd'),
      checkedInAt: '2026-01-01T22:15:00',
      checkedInBy: 'staff_john'
    },
    {
      id: '6',
      name: '송혜교',
      phone: '010-7777-8888',
      type: 'PAID',
      status: 'CHECKED_IN',
      createdBy: 'dj_martin',
      businessDate: format(new Date(), 'yyyy-MM-dd'),
      checkedInAt: '2026-01-01T23:45:00',
      checkedInBy: 'admin'
    },
    {
      id: '7',
      name: '강동원',
      phone: '010-3333-4444',
      type: 'FREE',
      status: 'REGISTERED',
      createdBy: 'promoter_kim',
      businessDate: format(new Date(), 'yyyy-MM-dd')
    },
    {
      id: '8',
      name: '한소희',
      type: 'FREE',
      status: 'REGISTERED',
      createdBy: 'dj_martin',
      businessDate: format(new Date(), 'yyyy-MM-dd')
    },
    {
      id: '9',
      name: '이동욱',
      phone: '010-9999-0000',
      type: 'PAID',
      status: 'REGISTERED',
      createdBy: 'admin',
      businessDate: format(new Date(), 'yyyy-MM-dd')
    },
    {
      id: '10',
      name: '수지',
      phone: '010-6666-7777',
      type: 'FREE',
      status: 'REGISTERED',
      createdBy: 'promoter_kim',
      businessDate: format(new Date(), 'yyyy-MM-dd')
    }
  ]);

  const businessDate = format(selectedDate, 'yyyy-MM-dd');

  const filteredGuests = guests.filter((guest) => {
    const matchesDate = guest.businessDate === businessDate;
    const matchesSearch = guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (guest.phone && guest.phone.includes(searchQuery));
    const matchesStatus = guest.status === 'REGISTERED';
    return matchesDate && matchesSearch && matchesStatus;
  });

  const handleCheckIn = (guest: Guest) => {
    setConfirmGuest(guest);
  };

  const confirmCheckIn = () => {
    if (!confirmGuest) return;

    setGuests(guests.map(g => 
      g.id === confirmGuest.id 
        ? { 
            ...g, 
            status: 'CHECKED_IN', 
            checkedInAt: new Date().toISOString(),
            checkedInBy: user.username
          }
        : g
    ));
    
    toast.success(`${confirmGuest.name}님 입장 처리 완료`);
    setConfirmGuest(null);
    setSearchQuery(''); // Clear search after check-in
  };

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const stats = {
    total: filteredGuests.length,
    checkedIn: filteredGuests.filter(g => g.status === 'CHECKED_IN').length,
    pending: filteredGuests.filter(g => g.status === 'REGISTERED').length
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl mb-2">도어 체크인</h1>
        <p className="text-muted-foreground">게스트 입장을 처리하세요</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">총 게스트</div>
          <div className="text-2xl">{stats.total}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">입장 완료</div>
          <div className="text-2xl text-green-600">{stats.checkedIn}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">대기 중</div>
          <div className="text-2xl text-orange-600">{stats.pending}</div>
        </Card>
      </div>

      {/* Controls */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Date Selector */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => changeDate(-1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="min-w-[200px]">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  {format(selectedDate, 'PPP', { locale: ko })}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  locale={ko}
                />
              </PopoverContent>
            </Popover>

            <Button
              variant="outline"
              size="icon"
              onClick={() => changeDate(1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="이름 또는 전화번호 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              autoFocus
            />
          </div>
        </div>
      </Card>

      {/* Guest List */}
      <div className="space-y-2">
        {filteredGuests.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">
              모든 게스트가 입장했습니다
            </p>
          </Card>
        ) : (
          filteredGuests.map((guest) => (
            <Card key={guest.id} className="p-4 hover:bg-accent/50 transition-colors">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg font-medium">{guest.name}</span>
                    <Badge variant={guest.type === 'FREE' ? 'secondary' : 'default'}>
                      {guest.type === 'FREE' ? '무료' : '유료'}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    {guest.phone && <span>📞 {guest.phone}</span>}
                    <span>등록: {guest.createdBy}</span>
                    {guest.checkedInAt && (
                      <>
                        <span>입장: {format(new Date(guest.checkedInAt), 'HH:mm')}</span>
                        <span>처리: {guest.checkedInBy}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {guest.status === 'REGISTERED' ? (
                    <Button
                      size="lg"
                      onClick={() => handleCheckIn(guest)}
                      className="min-w-[120px]"
                    >
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      입장 완료
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-md">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>완료됨</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmGuest !== null} onOpenChange={(open) => !open && setConfirmGuest(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>입장 처리 확인</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center text-lg mb-4">
              <span className="font-semibold">{confirmGuest?.name}</span>님을<br />
              입장 처리하시겠습니까?
            </p>
            <div className="bg-muted p-4 rounded-md space-y-2 text-sm">
              {confirmGuest?.phone && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">전화번호</span>
                  <span>{confirmGuest.phone}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">타입</span>
                <span>{confirmGuest?.type === 'FREE' ? '무료' : '유료'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">등록자</span>
                <span>{confirmGuest?.createdBy}</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmGuest(null)}>
              취소
            </Button>
            <Button onClick={confirmCheckIn}>
              확인
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
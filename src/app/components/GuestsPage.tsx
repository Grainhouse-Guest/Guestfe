import { useState } from 'react';
import { User } from '../App';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from './ui/dialog';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Switch } from './ui/switch';
import { ChevronLeft, ChevronRight, Plus, Search, Edit, Trash2, Calendar as CalendarIcon, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { toast } from 'sonner';
import { Users } from 'lucide-react';

interface Guest {
  id: string;
  name: string;
  phone?: string;
  type: 'FREE' | 'PAID';
  status: 'REGISTERED' | 'CHECKED_IN';
  createdBy: string;
  businessDate: string;
  checkedInAt?: string;
}

interface GuestsPageProps {
  user: User;
}

export function GuestsPage({ user }: GuestsPageProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'FREE' | 'PAID'>('ALL');
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
      checkedInAt: '2026-01-01T23:30:00'
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
      checkedInAt: '2026-01-01T22:15:00'
    },
    {
      id: '6',
      name: '송혜교',
      phone: '010-7777-8888',
      type: 'PAID',
      status: 'CHECKED_IN',
      createdBy: 'dj_martin',
      businessDate: format(new Date(), 'yyyy-MM-dd'),
      checkedInAt: '2026-01-01T23:45:00'
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
    }
  ]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formIsPaid, setFormIsPaid] = useState(false);

  const businessDate = format(selectedDate, 'yyyy-MM-dd');

  // Filter logic based on user role
  const canSeeAllGuests = user.role === 'ADMIN' || user.role === 'STAFF';
  
  const filteredGuests = guests.filter((guest) => {
    const matchesDate = guest.businessDate === businessDate;
    const matchesSearch = guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (guest.phone && guest.phone.includes(searchQuery));
    const matchesType = filterType === 'ALL' ? true : guest.type === filterType;
    
    // DJ/PROMOTER/EXTERNAL_EVENT can only see their own guests
    const matchesCreator = canSeeAllGuests ? true : guest.createdBy === user.username;
    
    return matchesDate && matchesSearch && matchesType && matchesCreator;
  });

  const handleAddGuest = () => {
    if (!formName.trim()) {
      toast.error('이름을 입력해주세요');
      return;
    }

    const newGuest: Guest = {
      id: Date.now().toString(),
      name: formName,
      phone: formPhone || undefined,
      type: formIsPaid ? 'PAID' : 'FREE',
      status: 'REGISTERED',
      createdBy: user.username,
      businessDate
    };

    setGuests([...guests, newGuest]);
    toast.success('게스트가 등록되었습니다');
    
    // Reset form
    setFormName('');
    setFormPhone('');
    setFormIsPaid(false);
    setIsAddDialogOpen(false);
  };

  const handleUpdateGuest = () => {
    if (!editingGuest || !formName.trim()) return;

    setGuests(guests.map(g => 
      g.id === editingGuest.id 
        ? { ...g, name: formName, phone: formPhone || undefined, type: formIsPaid ? 'PAID' : 'FREE' }
        : g
    ));
    toast.success('게스트 정보가 수정되었습니다');
    setEditingGuest(null);
    setFormName('');
    setFormPhone('');
    setFormIsPaid(false);
  };

  const handleDeleteGuest = (guestId: string) => {
    setGuests(guests.filter(g => g.id !== guestId));
    toast.success('게스트가 삭제되었습니다');
  };

  const openEditDialog = (guest: Guest) => {
    setEditingGuest(guest);
    setFormName(guest.name);
    setFormPhone(guest.phone || '');
    setFormIsPaid(guest.type === 'PAID');
  };

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-1">게스트 리스트</h1>
        <p className="text-sm text-muted-foreground">게스트를 등록하고 관리하세요</p>
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

          {/* Filter Buttons */}
          <div className="flex gap-2">
            <Button
              variant={filterType === 'ALL' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType('ALL')}
            >
              <Filter className="w-4 h-4 mr-2" />
              전체
            </Button>
            <Button
              variant={filterType === 'FREE' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType('FREE')}
            >
              무료
            </Button>
            <Button
              variant={filterType === 'PAID' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType('PAID')}
            >
              유료
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
            />
          </div>

          {/* Add Button */}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                게스트 추가
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>새 게스트 등록</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">이름 *</Label>
                  <Input
                    id="name"
                    placeholder="게스트 이름"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">전화번호</Label>
                  <Input
                    id="phone"
                    placeholder="010-0000-0000"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="paid">유료 게스트</Label>
                  <Switch
                    id="paid"
                    checked={formIsPaid}
                    onCheckedChange={setFormIsPaid}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  취소
                </Button>
                <Button onClick={handleAddGuest}>등록</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </Card>

      {/* Guest List */}
      <div className="space-y-2">
        {filteredGuests.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">아직 등록된 게스트가 없어요</p>
          </Card>
        ) : (
          filteredGuests.map((guest) => (
            <Card key={guest.id} className="p-4">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-lg">{guest.name}</span>
                    <Badge variant={guest.type === 'FREE' ? 'free' : 'paid'}>
                      {guest.type === 'FREE' ? '무료' : '유료'}
                    </Badge>
                    <Badge variant={guest.status === 'CHECKED_IN' ? 'checked' : 'registered'}>
                      {guest.status === 'CHECKED_IN' ? '입장완료' : '등록'}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    {guest.phone && <span>📞 {guest.phone}</span>}
                    <span>등록: {guest.createdBy}</span>
                    {guest.checkedInAt && (
                      <span>입장: {format(new Date(guest.checkedInAt), 'HH:mm')}</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {guest.status === 'REGISTERED' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(guest)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteGuest(guest.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </>
                  )}
                  {guest.status === 'CHECKED_IN' && (
                    <span className="text-sm text-muted-foreground px-3 py-2">
                      수정/삭제 불가
                    </span>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={editingGuest !== null} onOpenChange={(open) => !open && setEditingGuest(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>게스트 정보 수정</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">이름 *</Label>
              <Input
                id="edit-name"
                placeholder="게스트 이름"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">전화번호</Label>
              <Input
                id="edit-phone"
                placeholder="010-0000-0000"
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="edit-paid">유료 게스트</Label>
              <Switch
                id="edit-paid"
                checked={formIsPaid}
                onCheckedChange={setFormIsPaid}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingGuest(null)}>
              취소
            </Button>
            <Button onClick={handleUpdateGuest}>수정</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
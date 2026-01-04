import { useState } from 'react';
import { User, UserRole } from '../App';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Switch } from './ui/switch';
import { Plus, Edit, Trash2, Calendar as CalendarIcon, Eye, EyeOff } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { toast } from 'sonner';

interface StaffMember {
  id: string;
  username: string;
  displayName: string;
  role: UserRole;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  createdAt: string;
}

interface AdminStaffPageProps {
  user: User;
}

export function AdminStaffPage({ user }: AdminStaffPageProps) {
  const [staff, setStaff] = useState<StaffMember[]>([
    {
      id: '1',
      username: 'admin',
      displayName: '관리자',
      role: 'ADMIN',
      isActive: true,
      createdAt: '2025-12-01'
    },
    {
      id: '2',
      username: 'staff_john',
      displayName: '존 스태프',
      role: 'STAFF',
      isActive: true,
      createdAt: '2025-12-15'
    },
    {
      id: '3',
      username: 'dj_martin',
      displayName: 'DJ Martin',
      role: 'DJ',
      isActive: true,
      createdAt: '2025-12-20'
    },
    {
      id: '4',
      username: 'promoter_kim',
      displayName: '김프로모터',
      role: 'PROMOTER',
      isActive: true,
      startDate: '2026-01-01',
      endDate: '2026-01-31',
      createdAt: '2025-12-28'
    }
  ]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Form state
  const [formUsername, setFormUsername] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formDisplayName, setFormDisplayName] = useState('');
  const [formRole, setFormRole] = useState<UserRole>('STAFF');
  const [formStartDate, setFormStartDate] = useState<Date>();
  const [formEndDate, setFormEndDate] = useState<Date>();

  const resetForm = () => {
    setFormUsername('');
    setFormPassword('');
    setFormDisplayName('');
    setFormRole('STAFF');
    setFormStartDate(undefined);
    setFormEndDate(undefined);
    setShowPassword(false);
  };

  const handleCreateStaff = () => {
    if (!formUsername.trim() || !formPassword.trim() || !formDisplayName.trim()) {
      toast.error('모든 필수 항목을 입력해주세요');
      return;
    }

    if (staff.some(s => s.username === formUsername)) {
      toast.error('이미 존재하는 아이디입니다');
      return;
    }

    if ((formRole === 'PROMOTER' || formRole === 'EXTERNAL_EVENT') && (!formStartDate || !formEndDate)) {
      toast.error('접근 기간을 설정해주세요');
      return;
    }

    const newStaff: StaffMember = {
      id: Date.now().toString(),
      username: formUsername,
      displayName: formDisplayName,
      role: formRole,
      isActive: true,
      startDate: formStartDate ? format(formStartDate, 'yyyy-MM-dd') : undefined,
      endDate: formEndDate ? format(formEndDate, 'yyyy-MM-dd') : undefined,
      createdAt: format(new Date(), 'yyyy-MM-dd')
    };

    setStaff([...staff, newStaff]);
    toast.success(`${formDisplayName} 계정이 생성되었습니다`, {
      description: `아이디: ${formUsername}, 임시 비밀번호: ${formPassword}`
    });
    
    resetForm();
    setIsCreateDialogOpen(false);
  };

  const handleUpdateStaff = () => {
    if (!editingStaff || !formDisplayName.trim()) return;

    setStaff(staff.map(s => 
      s.id === editingStaff.id 
        ? { 
            ...s, 
            displayName: formDisplayName,
            role: formRole,
            startDate: formStartDate ? format(formStartDate, 'yyyy-MM-dd') : undefined,
            endDate: formEndDate ? format(formEndDate, 'yyyy-MM-dd') : undefined
          }
        : s
    ));
    
    toast.success('계정 정보가 수정되었습니다');
    setEditingStaff(null);
    resetForm();
  };

  const handleToggleActive = (staffId: string) => {
    setStaff(staff.map(s => 
      s.id === staffId ? { ...s, isActive: !s.isActive } : s
    ));
    toast.success('상태가 변경되었습니다');
  };

  const handleDeleteStaff = (staffId: string, staffName: string) => {
    if (confirm(`${staffName} 계정을 정말 삭제하시겠습니까?`)) {
      setStaff(staff.filter(s => s.id !== staffId));
      toast.success('계정이 삭제되었습니다');
    }
  };

  const openEditDialog = (member: StaffMember) => {
    setEditingStaff(member);
    setFormDisplayName(member.displayName);
    setFormRole(member.role);
    setFormPassword(''); // Reset password field for editing
    setFormStartDate(member.startDate ? new Date(member.startDate) : undefined);
    setFormEndDate(member.endDate ? new Date(member.endDate) : undefined);
  };

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case 'ADMIN': return 'default';
      case 'STAFF': return 'secondary';
      default: return 'outline';
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'ADMIN': return '관리자';
      case 'STAFF': return '스태프';
      case 'DJ': return 'DJ';
      case 'PROMOTER': return '프로모터';
      case 'EXTERNAL_EVENT': return '외부행사';
    }
  };

  const needsDateRange = formRole === 'PROMOTER' || formRole === 'EXTERNAL_EVENT';

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl mb-2">스탭 관리</h1>
          <p className="text-muted-foreground">직원 계정을 생성하고 관리하세요</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              계정 생성
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>새 스태프 계정 생성</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="username">아이디 *</Label>
                <Input
                  id="username"
                  placeholder="영문/숫자"
                  value={formUsername}
                  onChange={(e) => setFormUsername(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">임시 비밀번호 *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="8자 이상"
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="displayName">이름 *</Label>
                <Input
                  id="displayName"
                  placeholder="표시될 이름"
                  value={formDisplayName}
                  onChange={(e) => setFormDisplayName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">직책 *</Label>
                <Select value={formRole} onValueChange={(value) => setFormRole(value as UserRole)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">관리자</SelectItem>
                    <SelectItem value="STAFF">스태프</SelectItem>
                    <SelectItem value="DJ">DJ</SelectItem>
                    <SelectItem value="PROMOTER">프로모터</SelectItem>
                    <SelectItem value="EXTERNAL_EVENT">외부행사</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {needsDateRange && (
                <>
                  <div className="space-y-2">
                    <Label>접근 기간 *</Label>
                    <div className="flex gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="flex-1">
                            <CalendarIcon className="w-4 h-4 mr-2" />
                            {formStartDate ? format(formStartDate, 'PP', { locale: ko }) : '시작일'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={formStartDate}
                            onSelect={setFormStartDate}
                            locale={ko}
                          />
                        </PopoverContent>
                      </Popover>

                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="flex-1">
                            <CalendarIcon className="w-4 h-4 mr-2" />
                            {formEndDate ? format(formEndDate, 'PP', { locale: ko }) : '종료일'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={formEndDate}
                            onSelect={setFormEndDate}
                            locale={ko}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsCreateDialogOpen(false);
                resetForm();
              }}>
                취소
              </Button>
              <Button onClick={handleCreateStaff}>생성</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Staff List */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>이름</TableHead>
                <TableHead>아이디</TableHead>
                <TableHead>직책</TableHead>
                <TableHead>접근 기간</TableHead>
                <TableHead>상태</TableHead>
                <TableHead className="text-right">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>{member.displayName}</TableCell>
                  <TableCell className="font-mono text-sm">{member.username}</TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(member.role)}>
                      {getRoleLabel(member.role)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {member.startDate && member.endDate 
                      ? `${format(new Date(member.startDate), 'yy.MM.dd')} ~ ${format(new Date(member.endDate), 'yy.MM.dd')}`
                      : '-'
                    }
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={member.isActive}
                      onCheckedChange={() => handleToggleActive(member.id)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(member)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteStaff(member.id, member.displayName)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editingStaff !== null} onOpenChange={(open) => {
        if (!open) {
          setEditingStaff(null);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>계정 정보 수정</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>아이디</Label>
              <Input value={editingStaff?.username} disabled />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-password">새 비밀번호</Label>
              <div className="relative">
                <Input
                  id="edit-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="변경하려면 입력 (8자 이상)"
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">비밀번호를 변경하지 않으려면 비워두세요</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-displayName">이름 *</Label>
              <Input
                id="edit-displayName"
                placeholder="표시될 이름"
                value={formDisplayName}
                onChange={(e) => setFormDisplayName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-role">직책 *</Label>
              <Select value={formRole} onValueChange={(value) => setFormRole(value as UserRole)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">관리자</SelectItem>
                  <SelectItem value="STAFF">스태프</SelectItem>
                  <SelectItem value="DJ">DJ</SelectItem>
                  <SelectItem value="PROMOTER">프로모터</SelectItem>
                  <SelectItem value="EXTERNAL_EVENT">외부행사</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {needsDateRange && (
              <div className="space-y-2">
                <Label>접근 기간 *</Label>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="flex-1">
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        {formStartDate ? format(formStartDate, 'PP', { locale: ko }) : '시작일'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formStartDate}
                        onSelect={setFormStartDate}
                        locale={ko}
                      />
                    </PopoverContent>
                  </Popover>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="flex-1">
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        {formEndDate ? format(formEndDate, 'PP', { locale: ko }) : '종료일'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formEndDate}
                        onSelect={setFormEndDate}
                        locale={ko}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setEditingStaff(null);
              resetForm();
            }}>
              취소
            </Button>
            <Button onClick={handleUpdateStaff}>수정</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
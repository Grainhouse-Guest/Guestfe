import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { AlertCircle } from 'lucide-react';
import { Users } from 'lucide-react';
import { Eye, EyeOff } from 'lucide-react';

interface LoginPageProps {
  onLogin: (username: string, password: string) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && password.length >= 3) {
      onLogin(username, password);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardContent className="pt-8 pb-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold mb-2 tracking-tight">Club Guestlist</h1>
            <p className="text-sm text-muted-foreground">프리미엄 게스트 관리 시스템</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">아이디</Label>
              <Input
                id="username"
                type="text"
                placeholder="아이디를 입력하세요"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="비밀번호를 입력하세요"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="absolute right-0 top-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full mt-6"
              disabled={!username.trim() || password.length < 3}
            >
              로그인
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground mb-3">데모 계정</p>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between px-3 py-2 rounded-md bg-accent/50">
                <span className="text-muted-foreground">관리자</span>
                <code className="text-foreground font-mono">admin</code>
              </div>
              <div className="flex items-center justify-between px-3 py-2 rounded-md bg-accent/50">
                <span className="text-muted-foreground">스태프</span>
                <code className="text-foreground font-mono">staff</code>
              </div>
              <div className="flex items-center justify-between px-3 py-2 rounded-md bg-accent/50">
                <span className="text-muted-foreground">DJ</span>
                <code className="text-foreground font-mono">dj</code>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
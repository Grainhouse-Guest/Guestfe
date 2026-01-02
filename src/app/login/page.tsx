'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    TextInput,
    PasswordInput,
    Checkbox,
    Anchor,
    Paper,
    Title,
    Text,
    Container,
    Group,
    Button,
    Box,
} from '@mantine/core';

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        // TODO: Implement actual login logic with global state or auth provider
        // For demo purposes, we'll just mimic the previous behavior
        console.log('Login attempt:', username);

        // Redirect to dashboard (mock)
        router.push('/dashboard');
    };

    return (
        <Box className="min-h-screen flex items-center justify-center bg-[#0B1120] relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-900/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[100px]" />
            </div>

            <Container size={420} my={40} className="relative z-10 w-full">
                <Title
                    ta="center"
                    className="text-white font-extrabold text-[32px] mb-2 tracking-tight"
                >
                    Guest Service
                </Title>
                <Text c="dimmed" size="sm" ta="center" mt={5} mb={30}>
                    통합 게스트 관리 솔루션
                </Text>

                <Paper withBorder shadow="md" p={30} mt={30} radius="md" className="bg-[#1A1B1E]/80 border-gray-800 backdrop-blur-sm">
                    <TextInput
                        label="아이디"
                        placeholder="Username"
                        required
                        value={username}
                        onChange={(event) => setUsername(event.currentTarget.value)}
                        className="mb-4"
                        styles={{
                            input: { backgroundColor: '#25262B', borderColor: '#373A40', color: 'white' },
                            label: { color: '#C1C2C5' }
                        }}
                    />
                    <PasswordInput
                        label="비밀번호"
                        placeholder="Password"
                        required
                        mt="md"
                        value={password}
                        onChange={(event) => setPassword(event.currentTarget.value)}
                        styles={{
                            input: { backgroundColor: '#25262B', borderColor: '#373A40', color: 'white' },
                            label: { color: '#C1C2C5' }
                        }}
                    />

                    <Group justify="space-between" mt="lg">
                        <Checkbox label="아이디 저장" size="xs" styles={{ label: { color: '#C1C2C5' } }} />
                        <Anchor component="button" size="sm" c="dimmed">
                            비밀번호 찾기
                        </Anchor>
                    </Group>

                    <Button fullWidth mt="xl" size="md" color="cyan" onClick={handleLogin}>
                        로그인
                    </Button>
                </Paper>
            </Container>
        </Box>
    );
}

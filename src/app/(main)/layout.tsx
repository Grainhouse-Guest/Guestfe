'use client';

import { AppShell, Burger, Group, NavLink, Text, Avatar, Menu, rem, Box } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
    IconLayoutDashboard,
    IconUsers,
    IconDoorEnter,
    IconSettings,
    IconLogout,
    IconUser
} from '@tabler/icons-react';
import { usePathname, useRouter } from 'next/navigation';

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const [opened, { toggle }] = useDisclosure();
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = () => {
        // TODO: Clear auth state
        router.push('/login');
    };

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{
                width: 300,
                breakpoint: 'sm',
                collapsed: { mobile: !opened },
            }}
            padding="md"
        >
            <AppShell.Header>
                <Group h="100%" px="md" justify="space-between">
                    <Group>
                        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                        <Text fw={900} size="xl" variant="gradient" gradient={{ from: 'cyan', to: 'indigo', deg: 45 }}>
                            Guest Service
                        </Text>
                    </Group>

                    <Menu shadow="md" width={200}>
                        <Menu.Target>
                            <Group gap="xs" style={{ cursor: 'pointer' }}>
                                <Avatar color="cyan" radius="xl">AD</Avatar>
                                <Box visibleFrom="xs">
                                    <Text size="sm" fw={500}>Admin User</Text>
                                    <Text size="xs" c="dimmed">Club Octagon</Text>
                                </Box>
                            </Group>
                        </Menu.Target>

                        <Menu.Dropdown>
                            <Menu.Label>Application</Menu.Label>
                            <Menu.Item leftSection={<IconUser style={{ width: rem(14), height: rem(14) }} />}>
                                내 프로필
                            </Menu.Item>
                            <Menu.Item leftSection={<IconSettings style={{ width: rem(14), height: rem(14) }} />}>
                                설정
                            </Menu.Item>
                            <Menu.Divider />
                            <Menu.Item
                                color="red"
                                leftSection={<IconLogout style={{ width: rem(14), height: rem(14) }} />}
                                onClick={handleLogout}
                            >
                                로그아웃
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </Group>
            </AppShell.Header>

            <AppShell.Navbar p="md">
                <NavLink
                    label="대시보드"
                    leftSection={<IconLayoutDashboard size="1rem" stroke={1.5} />}
                    active={pathname === '/dashboard'}
                    onClick={() => router.push('/dashboard')}
                    variant="light"
                    color="cyan"
                    mb={5}
                />
                <NavLink
                    label="게스트 관리"
                    leftSection={<IconUsers size="1rem" stroke={1.5} />}
                    active={pathname === '/guests'}
                    onClick={() => router.push('/guests')}
                    variant="light"
                    color="cyan"
                    mb={5}
                />
                <NavLink
                    label="입장 현황 (Door)"
                    leftSection={<IconDoorEnter size="1rem" stroke={1.5} />}
                    active={pathname === '/door'}
                    onClick={() => router.push('/door')}
                    variant="light"
                    color="cyan"
                    mb={5}
                />
                <NavLink
                    label="스태프 관리"
                    leftSection={<IconUsers size="1rem" stroke={1.5} />}
                    active={pathname === '/staff'}
                    onClick={() => router.push('/staff')}
                    variant="light"
                    color="cyan"
                    mb={5}
                />
                <NavLink
                    label="설정"
                    leftSection={<IconSettings size="1rem" stroke={1.5} />}
                    active={pathname === '/settings'}
                    onClick={() => router.push('/settings')}
                    variant="light"
                    color="cyan"
                />
            </AppShell.Navbar>

            <AppShell.Main>
                {children}
            </AppShell.Main>
        </AppShell>
    );
}

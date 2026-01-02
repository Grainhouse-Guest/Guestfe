'use client';

import { SimpleGrid, Paper, Text, Group, ThemeIcon, Title } from '@mantine/core';
import { IconUserPlus, IconUsers, IconDoorEnter, IconTrendingUp } from '@tabler/icons-react';

export default function DashboardPage() {
    const stats = [
        { title: '오늘 입장객', value: '1,245', diff: 12, icon: IconDoorEnter, color: 'cyan' },
        { title: '현재 대기', value: '85', diff: -5, icon: IconUsers, color: 'indigo' },
        { title: '신규 게스트', value: '3,820', diff: 18, icon: IconUserPlus, color: 'teal' },
        { title: '총 매출 (예상)', value: '₩45.2M', diff: 30, icon: IconTrendingUp, color: 'grape' },
    ];

    const StatCards = stats.map((stat) => (
        <Paper withBorder p="md" radius="md" key={stat.title}>
            <Group justify="space-between">
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                    {stat.title}
                </Text>
                <ThemeIcon color={stat.color} variant="light" size={38} radius="md">
                    <stat.icon size="1.8rem" stroke={1.5} />
                </ThemeIcon>
            </Group>

            <Group align="flex-end" gap="xs" mt={25}>
                <Text className="text-2xl font-bold font-mono">{stat.value}</Text>
                <Text c={stat.diff > 0 ? 'teal' : 'red'} size="sm" fw={500} className="flex items-center">
                    <span>{stat.diff > 0 ? '+' : ''}{stat.diff}%</span>
                </Text>
            </Group>

            <Text size="xs" c="dimmed" mt={7}>
                전일 대비 증감
            </Text>
        </Paper>
    ));

    return (
        <>
            <Title order={2} mb="lg">Dashboard</Title>
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>{StatCards}</SimpleGrid>

            <SimpleGrid cols={{ base: 1, md: 2 }} mt="lg">
                <Paper withBorder p="md" radius="md" h={400}>
                    <Title order={4} mb="md">실시간 입장 현황</Title>
                    <div className="h-full flex items-center justify-center text-gray-500 bg-gray-900/50 rounded border border-gray-800 border-dashed">
                        Chart Placeholder
                    </div>
                </Paper>
                <Paper withBorder p="md" radius="md" h={400}>
                    <Title order={4} mb="md">MD별 실적</Title>
                    <div className="h-full flex items-center justify-center text-gray-500 bg-gray-900/50 rounded border border-gray-800 border-dashed">
                        Table Placeholder
                    </div>
                </Paper>
            </SimpleGrid>
        </>
    );
}

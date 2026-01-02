import '@mantine/core/styles.css';
import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from '@mantine/core';

export const metadata = {
    title: 'Guest Service',
    description: 'Club Guest Management System',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" {...mantineHtmlProps}>
            <head>
                <ColorSchemeScript defaultColorScheme="dark" />
            </head>
            <body>
                <MantineProvider defaultColorScheme="dark" theme={{
                    primaryColor: 'cyan',
                    fontFamily: 'Inter, sans-serif',
                    headings: { fontFamily: 'Inter, sans-serif' },
                }}>
                    {children}
                </MantineProvider>
            </body>
        </html>
    );
}

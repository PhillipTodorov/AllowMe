import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import '../globals.css';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'Attendance Allowance Application',
  description: 'Apply for Attendance Allowance benefit',
};

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="bg-gray-50 min-h-screen">
        <NextIntlClientProvider messages={messages}>
          <Header locale={locale} />
          <main className="max-w-2xl mx-auto px-4 py-8">
            {children}
          </main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

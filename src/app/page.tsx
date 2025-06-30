'use client';
// app/page.tsx
import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues with the main component
const MultiAgentArchitectureSystem = dynamic(
  () => import('@/src/lib/components/MultiAgentArchitectureSystem'),
  { ssr: false }
);

export default function HomePage() {
  return (
    <main className="w-full h-screen overflow-hidden">
      <MultiAgentArchitectureSystem />
    </main>
  );
}
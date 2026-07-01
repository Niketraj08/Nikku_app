'use client';

import { useEffect, useState } from 'react';
import SplashScreen from '@/components/ui/SplashScreen';
import HeroSection from '@/components/home/HeroSection';
import VideoSection from '@/components/home/VideoSection';
import CategoriesSection from '@/components/home/CategoriesSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import CTASection from '@/components/home/CTASection';
import api from '@/lib/api';
import type { HomepageData } from '@/types';

export default function HomePage() {
  const [data, setData] = useState<HomepageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    api.get('/homepage')
      .then((res) => setData(res.data.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  const hp = data?.homepage;

  return (
    <>
      <HeroSection
        title={hp?.heroTitle || 'AKKI STUDY X'}
        subtitle={hp?.heroSubtitle || 'Premium Edition — Learn without limits'}
        cta={hp?.heroCta || 'Start Learning Free'}
      />
      <VideoSection
        title="Featured Courses"
        subtitle="Hand-picked content for maximum learning"
        videos={data?.featured || []}
        viewAllHref="/library?featured=true"
      />
      <VideoSection
        title="Popular Videos"
        subtitle="Most watched by our community"
        videos={data?.popular || []}
        viewAllHref="/library?popular=true"
      />
      <CategoriesSection categories={data?.categories || []} />
      <VideoSection
        title="Trending Content"
        subtitle="What everyone is watching right now"
        videos={data?.trending || []}
        viewAllHref="/library?trending=true"
      />
      <TestimonialsSection testimonials={hp?.testimonials || []} />
      <CTASection
        title={hp?.ctaTitle || 'Ready to Start Your Learning Journey?'}
        subtitle={hp?.ctaSubtitle || 'Join thousands of students learning for free'}
      />
      {loading && !data && (
        <div className="py-20 text-center text-sm text-slate-400">
          Loading content... Make sure the backend is running.
        </div>
      )}
    </>
  );
}

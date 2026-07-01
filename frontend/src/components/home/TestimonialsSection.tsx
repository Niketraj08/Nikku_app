'use client';

import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';

interface Testimonial {
  name: string;
  role: string;
  content: string;
  avatar: string;
  rating: number;
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  if (!testimonials?.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <div className="mb-6 text-center">
        <h2 className="text-xl font-extrabold text-slate-800 md:text-2xl">What Students Say</h2>
        <p className="mt-1 text-sm text-slate-500">Trusted by thousands of learners worldwide</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="collection-card p-6"
          >
            <div className="mb-3 flex gap-0.5 text-amber-400">
              {Array.from({ length: t.rating }).map((_, j) => (
                <FaStar key={j} className="text-sm" />
              ))}
            </div>
            <p className="text-sm leading-relaxed text-slate-600">&ldquo;{t.content}&rdquo;</p>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-sm font-bold text-white">
                {t.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">{t.name}</p>
                <p className="text-xs text-slate-500">{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

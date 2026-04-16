'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';

import emailjs from '@emailjs/browser';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'loading') return;

    // Basic client-side validation
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.message.trim()) {
      setErrorMsg('All fields are required.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMsg('');

    try {
      // 1. Save to database via API route
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Submission failed');
      }

      // 2. EmailJS Notification to Admin
      const emailParams = {
        from_name: form.name,
        from_email: form.email,
        phone: form.phone,
        message: form.message,
      };

      // Replace missing PUBLIC_KEY with NEXT_PUBLIC_EMAILJS_PUBLIC_KEY config
      await emailjs.send(
        "service_g6z9i09",
        "template_tvafhl8",
        emailParams,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
      );

      setStatus('success');
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="py-24 px-6 relative">
      <div className="blob w-96 h-96 bg-[#952EBE] bottom-0 right-0 opacity-10" />
      <div className="blob w-80 h-80 bg-[#3A46DA] top-0 left-0 opacity-10" />

      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-xs font-semibold tracking-[0.3em] uppercase text-[#952EBE]">
            Let&apos;s Create
          </span>
          <h2 className="text-4xl md:text-5xl font-black mt-3 text-white">
            Start Your <span className="gradient-text">Story</span>
          </h2>
          <p className="text-white/50 mt-4 max-w-lg mx-auto">
            Tell us about your project and we&apos;ll get back within 24 hours.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-5 gap-8 items-start">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2 space-y-6"
          >
            {[
              { label: 'Email', value: 'Neonframeworks0@gmail.com', href: 'mailto:Neonframeworks0@gmail.com' },
              { label: 'Phone', value: '+91 85095 54451', href: 'tel:+918509554451' },
              { label: 'Location', value: 'Lalpur, Ranchi, Jharkhand', href: 'https://maps.google.com/?q=Lalpur,+Ranchi,+Jharkhand' },
              { label: 'Response Time', value: 'Within 24 hours' },
            ].map((item) => (
              <div key={item.label} className="glass rounded-xl p-4">
                <div className="text-[#952EBE] text-xs font-bold tracking-widest uppercase mb-1">
                  {item.label}
                </div>
                {item.href ? (
                  <a href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined} className="text-white/80 hover:text-white hover:underline transition-colors text-sm font-medium block">
                    {item.value}
                  </a>
                ) : (
                  <div className="text-white/80 text-sm font-medium">{item.value}</div>
                )}
              </div>
            ))}
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="md:col-span-3 glass rounded-2xl p-8 space-y-5"
            noValidate
          >
            <div>
              <label className="text-white/60 text-xs font-semibold uppercase tracking-wider block mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your name"
                maxLength={100}
                className="input-field w-full rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm"
                required
              />
            </div>

            <div>
              <label className="text-white/60 text-xs font-semibold uppercase tracking-wider block mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                maxLength={200}
                className="input-field w-full rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm"
                required
              />
            </div>

            <div>
              <label className="text-white/60 text-xs font-semibold uppercase tracking-wider block mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+91 ...."
                maxLength={20}
                className="input-field w-full rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm"
                required
              />
            </div>

            <div>
              <label className="text-white/60 text-xs font-semibold uppercase tracking-wider block mb-2">
                Your Project
              </label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Tell us about your vision, event date, location..."
                rows={5}
                maxLength={2000}
                className="input-field w-full rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm resize-none"
                required
              />
            </div>

            {status === 'error' && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 rounded-lg px-4 py-3">
                <AlertCircle size={16} />
                {errorMsg}
              </div>
            )}

            {status === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-green-400 text-sm bg-green-500/10 rounded-lg px-4 py-3"
              >
                <CheckCircle size={16} />
                Message sent! We&apos;ll be in touch within 24 hours.
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={status === 'loading' || status === 'success'}
              whileHover={{ scale: status === 'loading' ? 1 : 1.02 }}
              whileTap={{ scale: status === 'loading' ? 1 : 0.98 }}
              className="w-full py-4 rounded-xl font-bold text-sm bg-gradient-to-r from-[#952EBE] to-[#3A46DA] text-white disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-purple-500/25 transition-shadow"
            >
              {status === 'loading' ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending...
                </>
              ) : status === 'success' ? (
                <>
                  <CheckCircle size={16} />
                  Sent!
                </>
              ) : (
                <>
                  <Send size={16} />
                  Send Message
                </>
              )}
            </motion.button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}

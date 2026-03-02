'use client';

import { useState, FormEvent } from 'react';

/**
 * Reusable newsletter signup form.
 * Calls the /api/subscribe endpoint to add the email to ConvertKit.
 * Handles loading, success, and error states with visual feedback.
 */

interface NewsletterFormProps {
  /** Compact mode hides the heading/description (for inline use) */
  compact?: boolean;
}

export default function NewsletterForm({ compact = false }: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage('🎉 You\'re in! Check your inbox.');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className={`${compact ? '' : 'border border-cyberLime/20 bg-cyberLime/5 rounded-2xl p-8'} text-center`}>
        <p className="text-2xl font-outfit font-bold text-cyberLime mb-2">
          🎉 You&apos;re in!
        </p>
        <p className="text-gray-400 text-sm">
          Check your inbox for a welcome email.
        </p>
      </div>
    );
  }

  return (
    <div className={compact ? '' : 'border border-cyberLime/20 bg-cyberLime/5 rounded-2xl p-8 text-center'}>
      {!compact && (
        <>
          <h3 className="text-2xl font-outfit font-bold text-white mb-3">
            Get Production AI Patterns Weekly
          </h3>
          <p className="text-gray-400 mb-6 max-w-lg mx-auto">
            Battle-tested code, architecture decisions, and AI engineering
            insights. No fluff. Unsubscribe anytime.
          </p>
        </>
      )}
      <form
        onSubmit={handleSubmit}
        className={`flex flex-col sm:flex-row gap-3 ${compact ? '' : 'max-w-md mx-auto'}`}
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className="flex-1 bg-charcoal border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-cyberLime focus:outline-none transition-colors"
          required
          disabled={status === 'loading'}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="bg-cyberLime text-charcoal px-6 py-3 rounded-xl font-bold hover:bg-neonBlue transition-all duration-300 transform hover:scale-105 whitespace-nowrap disabled:opacity-50 disabled:hover:scale-100"
        >
          {status === 'loading' ? 'Subscribing...' : 'Subscribe Free'}
        </button>
      </form>
      {status === 'error' && (
        <p className="text-red-400 text-sm mt-3">{message}</p>
      )}
      {!compact && (
        <p className="text-[11px] text-slate-600 mt-3">
          Join 4,200+ engineers. No spam, ever.
        </p>
      )}
    </div>
  );
}

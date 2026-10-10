import React, { useState } from 'react';
import { Language, FeedbackSubmission } from '../types';
import { translations } from '../translations';
import { StorageService } from '../services/storage';
import { MessageSquare, Send, CheckCircle2, AlertCircle, Shield } from 'lucide-react';

interface FeedbackFormProps {
  currentLang: Language;
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({ currentLang }) => {
  const t = translations[currentLang];

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState<FeedbackSubmission['category']>('Timetable Correction');
  const [message, setMessage] = useState('');
  
  // Anti-spam honeypot & challenge
  const [honeypot, setHoneypot] = useState('');
  const [mathAnswer, setMathAnswer] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    // Spam honeypot detection
    if (honeypot.trim().length > 0) {
      console.warn('Spam submission detected and discarded via honeypot.');
      setStatusMessage({ type: 'success', text: t.feedbackSuccess });
      return;
    }

    // Basic Math verification challenge (What is 3 + 4?)
    if (mathAnswer.trim() !== '7') {
      setStatusMessage({
        type: 'error',
        text: 'Anti-spam check failed: Please calculate 3 + 4 = 7 to verify you are a human passenger.'
      });
      return;
    }

    // Form field validation
    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatusMessage({ type: 'error', text: t.feedbackError });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatusMessage({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }

    setIsSubmitting(true);

    try {
      StorageService.submitFeedback({
        name: name.trim(),
        email: email.trim(),
        contactNumber: phone.trim() || undefined,
        category,
        message: message.trim()
      });

      // Clear form
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      setMathAnswer('');
      setHoneypot('');

      setStatusMessage({
        type: 'success',
        text: t.feedbackSuccess
      });
    } catch {
      setStatusMessage({
        type: 'error',
        text: 'An unexpected error occurred while saving your feedback. Please try again or call the station master desk directly.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="feedback" className="py-12 bg-white border-b border-amber-950/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="text-xs uppercase tracking-wider font-semibold text-[#1b4332] mb-1 inline-flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-[#1b4332]" />
            <span>Passenger Communications</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            {t.feedbackTitle}
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            {t.feedbackSubtitle}
          </p>
        </div>

        {/* Feedback Card */}
        <div className="bg-[#faf9f5] rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          {statusMessage && (
            <div
              className={`p-4 rounded-lg mb-6 text-xs sm:text-sm flex items-start gap-3 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border border-rose-200 text-rose-900'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="leading-relaxed">{statusMessage.text}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 text-xs sm:text-sm">
            {/* Honeypot field for bot protection */}
            <div className="hidden" aria-hidden="true">
              <label>Leave this empty</label>
              <input
                type="text"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  {t.fullName} <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  {t.emailAddress} <span className="text-rose-600">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Category */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  {t.category} <span className="text-rose-600">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                >
                  <option value="Timetable Correction">{t.catCorrection}</option>
                  <option value="Feedback">{t.catFeedback}</option>
                  <option value="Complaint">{t.catComplaint}</option>
                  <option value="Suggestion">{t.catSuggestion}</option>
                  <option value="Other">{t.catOther}</option>
                </select>
              </div>

              {/* Optional Phone */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  {t.phoneOptional}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+94 7X XXX XXXX"
                  className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                {t.message} <span className="text-rose-600">*</span>
              </label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t.messagePlaceholder}
                className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
              ></textarea>
            </div>

            {/* Human Verification Challenge */}
            <div className="p-3 bg-slate-100 rounded border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <Shield className="w-4 h-4 text-emerald-700" />
                <span>Anti-Spam Human Verification: What is <strong>3 + 4</strong>?</span>
              </div>
              <input
                type="text"
                required
                value={mathAnswer}
                onChange={(e) => setMathAnswer(e.target.value)}
                placeholder="Answer (e.g. 7)"
                className="w-24 bg-white border border-slate-300 rounded px-2.5 py-1 text-center font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
              />
            </div>

            {/* Submit button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="text-[11px] text-slate-500">
                {t.spamProtectionNotice}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded bg-[#1b4332] hover:bg-[#143225] text-amber-300 font-semibold text-xs transition-colors shadow-sm cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? t.submitting : t.submitFeedback}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

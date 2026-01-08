'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui';
import { getFeedbackCaptchaChallenge, submitFeedback } from '@/lib/actions/feedback-submission';

interface FeedbackWidgetProps {
  defaultExpanded?: boolean;
}

export function FeedbackWidget({ defaultExpanded = false }: FeedbackWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [captcha, setCaptcha] = useState<{ question: string; token: string } | null>(null);
  const [feedbackType, setFeedbackType] = useState<'feature' | 'bug'>('feature');
  const formRef = useRef<HTMLFormElement>(null);

  // Load captcha when widget expands
  useEffect(() => {
    if (isExpanded && !captcha) {
      loadCaptcha();
    }
  }, [isExpanded, captcha]);

  const loadCaptcha = async () => {
    const newCaptcha = await getFeedbackCaptchaChallenge();
    setCaptcha(newCaptcha);
  };

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    setError(null);

    formData.append('type', feedbackType);
    if (captcha) {
      formData.append('captchaToken', captcha.token);
    }

    try {
      const result = await submitFeedback(formData);

      if (result.success) {
        setSuccess(true);
        setIsExpanded(false);
        setCaptcha(null);
        formRef.current?.reset();
        setFeedbackType('feature');
        // Reset success message after 5 seconds
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError(result.error || 'An error occurred');
        // Refresh captcha on error
        loadCaptcha();
      }
    } catch {
      setError('An error occurred. Please try again.');
      loadCaptcha();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 text-center">
        <span className="text-teal-600 font-medium text-sm">
          Thank you! Your feedback has been submitted.
        </span>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-rose-100 overflow-hidden shadow-sm">
      {/* Collapsed header - always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-rose-50/50 transition-colors"
        type="button"
      >
        <span className="text-sm font-medium text-stone-700 flex items-center gap-2">
          <span>💬</span>
          Send Feedback
        </span>
        <span className={`text-stone-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {/* Expanded form */}
      {isExpanded && (
        <form ref={formRef} action={handleSubmit} className="px-4 pb-4 space-y-3 border-t border-rose-100 pt-3">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-600 px-3 py-2 rounded-lg text-sm flex items-center gap-2">
              <span>⚠️</span>
              {error}
            </div>
          )}

          {/* Type selector */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setFeedbackType('feature')}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                feedbackType === 'feature'
                  ? 'bg-teal-100 text-teal-700 border-2 border-teal-300'
                  : 'bg-stone-100 text-stone-600 border-2 border-transparent hover:bg-stone-200'
              }`}
            >
              💡 Feature
            </button>
            <button
              type="button"
              onClick={() => setFeedbackType('bug')}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                feedbackType === 'bug'
                  ? 'bg-amber-100 text-amber-700 border-2 border-amber-300'
                  : 'bg-stone-100 text-stone-600 border-2 border-transparent hover:bg-stone-200'
              }`}
            >
              🐛 Bug
            </button>
          </div>

          {/* Description textarea */}
          <textarea
            name="description"
            required
            placeholder={feedbackType === 'feature'
              ? "Describe the feature you'd like to see (min 20 chars)..."
              : "Describe the bug you encountered (min 20 chars)..."
            }
            rows={3}
            className="w-full px-3 py-2 border-2 border-stone-200 rounded-xl bg-white text-sm transition-all duration-200 focus:outline-none focus:border-teal-400 placeholder:text-stone-400 resize-none"
          />

          {/* Optional email */}
          <input
            name="email"
            type="email"
            placeholder="Email (optional, for follow-up)"
            className="w-full px-3 py-2 border-2 border-stone-200 rounded-xl bg-white text-sm transition-all duration-200 focus:outline-none focus:border-teal-400 placeholder:text-stone-400"
          />

          {/* Honeypot field - hidden from users */}
          <input
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            className="absolute opacity-0 h-0 w-0 pointer-events-none"
            aria-hidden="true"
          />

          {/* Captcha */}
          {captcha && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-stone-600 whitespace-nowrap">
                {captcha.question}
              </span>
              <input
                name="captchaAnswer"
                type="text"
                required
                placeholder="Answer"
                className="w-20 px-3 py-2 border-2 border-stone-200 rounded-xl bg-white text-sm transition-all duration-200 focus:outline-none focus:border-teal-400 placeholder:text-stone-400"
              />
            </div>
          )}

          <Button
            type="submit"
            size="sm"
            isLoading={isSubmitting}
            loadingText="Submitting..."
            className="w-full"
          >
            Submit Feedback
          </Button>

          <p className="text-xs text-stone-400 text-center">
            Your feedback helps improve the app!
          </p>
        </form>
      )}
    </div>
  );
}

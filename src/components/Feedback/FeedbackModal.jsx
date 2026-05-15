import { useState, useEffect } from 'react';
import './FeedbackModal.css';

const FEEDBACK_STORAGE_KEY = 'hintro_feedback_list';
const CATEGORIES = ['General', 'Bug Report', 'Feature Request', 'UI / Design', 'Performance', 'Other'];
const RATINGS = [1, 2, 3, 4, 5];

function loadFeedback() {
  try {
    return JSON.parse(localStorage.getItem(FEEDBACK_STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveFeedback(list) {
  localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(list));
}

export default function FeedbackModal({ isOpen, onClose }) {
  const [step, setStep] = useState('form'); // 'form' | 'success' | 'history'
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [feedbackList, setFeedbackList] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setFeedbackList(loadFeedback());
      setStep('form');
      resetForm();
    }
  }, [isOpen]);

  function resetForm() {
    setRating(0);
    setHoverRating(0);
    setCategory(CATEGORIES[0]);
    setMessage('');
    setError('');
  }

  function handleSubmit() {
    if (!message.trim()) {
      setError('Please enter your feedback before submitting.');
      return;
    }
    if (rating === 0) {
      setError('Please select a rating.');
      return;
    }

    const entry = {
      id: Date.now(),
      rating,
      category,
      message: message.trim(),
      submittedAt: new Date().toISOString(),
    };

    const updated = [entry, ...loadFeedback()];
    saveFeedback(updated);
    setFeedbackList(updated);
    setStep('success');
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="feedback-overlay" onClick={handleClose}>
      <div className="feedback-modal" onClick={(e) => e.stopPropagation()}>
        {/* ── Header ── */}
        <div className="feedback-modal__header">
          <div>
            <h2 className="feedback-modal__title">
              {step === 'history' ? 'Feedback History' : 'Share Feedback'}
            </h2>
            <p className="feedback-modal__subtitle">
              {step === 'history'
                ? 'Your previously submitted feedback'
                : 'Help us improve Hintro with your thoughts'}
            </p>
          </div>
          <div className="feedback-modal__header-actions">
            {step === 'form' || step === 'success' ? (
              <button className="feedback-modal__link-btn" onClick={() => setStep('history')}>
                View History
              </button>
            ) : (
              <button className="feedback-modal__link-btn" onClick={() => setStep('form')}>
                New Feedback
              </button>
            )}
            <button className="feedback-modal__close" onClick={handleClose} aria-label="Close">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        {/* ── Form Step ── */}
        {step === 'form' && (
          <div className="feedback-modal__body">
            {/* Rating */}
            <div className="feedback-field">
              <label className="feedback-label">Overall Rating</label>
              <div className="star-rating">
                {RATINGS.map((val) => (
                  <button
                    key={val}
                    className={`star-rating__star${val <= (hoverRating || rating) ? ' star-rating__star--filled' : ''}`}
                    onClick={() => setRating(val)}
                    onMouseEnter={() => setHoverRating(val)}
                    onMouseLeave={() => setHoverRating(0)}
                    aria-label={`${val} star`}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </button>
                ))}
                {rating > 0 && (
                  <span className="star-rating__label">
                    {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
                  </span>
                )}
              </div>
            </div>

            {/* Category */}
            <div className="feedback-field">
              <label className="feedback-label">Category</label>
              <div className="feedback-categories">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    className={`feedback-category${category === cat ? ' feedback-category--active' : ''}`}
                    onClick={() => setCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Message */}
            <div className="feedback-field">
              <label className="feedback-label" htmlFor="feedback-msg">
                Your Feedback
              </label>
              <textarea
                id="feedback-msg"
                className="feedback-textarea"
                placeholder="Tell us what you think — what's working well, what could be improved..."
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (error) setError('');
                }}
                rows={4}
              />
              {error && <span className="feedback-error">{error}</span>}
            </div>

            <button className="feedback-submit" onClick={handleSubmit}>
              Submit Feedback
            </button>
          </div>
        )}

        {/* ── Success Step ── */}
        {step === 'success' && (
          <div className="feedback-modal__body feedback-success">
            <div className="feedback-success__icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h3 className="feedback-success__title">Thank you!</h3>
            <p className="feedback-success__text">
              Your feedback has been saved. We appreciate you taking the time to help us improve.
            </p>
            <button className="feedback-submit" onClick={resetForm} style={{ marginTop: 0 }}>
              Send More Feedback
            </button>
          </div>
        )}

        {/* ── History Step ── */}
        {step === 'history' && (
          <div className="feedback-modal__body">
            {feedbackList.length === 0 ? (
              <div className="feedback-empty">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                </svg>
                <p>No feedback submitted yet.</p>
              </div>
            ) : (
              <ul className="feedback-history">
                {feedbackList.map((item) => (
                  <li key={item.id} className="feedback-history__item">
                    <div className="feedback-history__top">
                      <span className="feedback-history__category">{item.category}</span>
                      <span className="feedback-history__date">
                        {new Date(item.submittedAt).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="feedback-history__stars">
                      {RATINGS.map((v) => (
                        <span key={v} className={`feedback-history__star${v <= item.rating ? ' feedback-history__star--on' : ''}`}>★</span>
                      ))}
                    </div>
                    <p className="feedback-history__message">{item.message}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

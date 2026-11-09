import { useState, useEffect } from 'react';
import './App.css';

import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-css';

import EditorModule from 'react-simple-code-editor';
import axios from 'axios';
import Markdown from 'react-markdown';

const Editor = EditorModule.default ?? EditorModule;

// Sample code snippets for user testing
const SAMPLES = {
  basic: `function sum() {
  return 1 + 1;
}`,
  buggyAsync: `async function fetchUserData(userId) {
  let response = fetch('https://api.example.com/users/' + userId);
  let data = response.json();
  
  if (data.status = 200) {
    console.log("Found user: " + data.user);
    return data.user;
  }
  
  return null;
}`,
  memoryLeak: `function monitorUser(userId) {
  let cache = [];
  
  setInterval(function() {
    let raw = getEvents(userId);
    cache.push(raw);
    console.log("Cache size:", cache.length);
  }, 1000);
}`
};

// Code block with syntax highlighting and Copy button
function CodeBlock({ inline, className, children, ...props }) {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const lang = match ? match[1] : '';
  const codeString = String(children).replace(/\n$/, '');

  const isBlock = match || codeString.includes('\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isBlock) {
    let highlighted = '';
    try {
      const grammar = (lang && Prism.languages[lang]) || Prism.languages.javascript;
      if (grammar) {
        highlighted = Prism.highlight(codeString, grammar, lang || 'javascript');
      }
    } catch {
      highlighted = '';
    }

    return (
      <div className="code-block-card">
        <div className="code-block-header">
          <div className="window-dots">
            <span className="dot dot-red"></span>
            <span className="dot dot-yellow"></span>
            <span className="dot dot-green"></span>
          </div>
          <span className="code-lang-tag">{lang ? lang.toUpperCase() : 'CODE'}</span>
          <button className="copy-code-btn" onClick={handleCopy} type="button">
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
        <pre className={`language-${lang || 'javascript'}`}>
          {highlighted ? (
            <code dangerouslySetInnerHTML={{ __html: highlighted }} />
          ) : (
            <code>{codeString}</code>
          )}
        </pre>
      </div>
    );
  }

  return (
    <code className="inline-code" {...props}>
      {children}
    </code>
  );
}

// Custom H2 with colored section pills
function CustomH2({ children, ...props }) {
  const text = String(children);
  let sectionType = 'section-default';

  if (/assessment/i.test(text)) sectionType = 'section-assessment';
  else if (/issue|vulnerabilit/i.test(text)) sectionType = 'section-issues';
  else if (/improvement/i.test(text)) sectionType = 'section-improvements';
  else if (/correct|refactor/i.test(text)) sectionType = 'section-code';
  else if (/recommendation|takeaway/i.test(text)) sectionType = 'section-recommendations';

  return (
    <div className={`section-header-wrapper ${sectionType}`}>
      <h2 className="review-section-title" {...props}>
        {children}
      </h2>
    </div>
  );
}

function App() {
  const [code, setCode] = useState(SAMPLES.basic);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedReview, setCopiedReview] = useState(false);

  useEffect(() => {
    window.Prism = Prism;
  }, []);

  // Keyboard shortcut: Cmd+Enter or Ctrl+Enter to review
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        reviewCode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [code, loading]);

  async function reviewCode() {
    if (loading || !code.trim()) return;

    setLoading(true);
    setReview('');

    try {
      const response = await axios.post(
        'https://codelens-ai-backend-9idf.onrender.com/api/ai/get-review',
        { code }
      );

      setReview(response.data.review);
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || error.message || 'Error communicating with review server.';
      setReview(`## ⚠️ Review Error\n\n${msg}\n\n*Please ensure the backend server is running on port 3000.*`);
    } finally {
      setLoading(false);
    }
  }

  const copyFullReview = () => {
    if (!review) return;
    navigator.clipboard.writeText(review);
    setCopiedReview(true);
    setTimeout(() => setCopiedReview(false), 2000);
  };

  const lineCount = code.split('\n').length;
  const charCount = code.length;

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <header className="top-nav">
        <div className="nav-brand">
          <div className="brand-icon">⚡</div>
          <div className="brand-text">
            <h1>CodeLens AI</h1>
            <span className="brand-subtitle">Automated Senior Code Reviewer</span>
          </div>
        </div>

        <div className="nav-actions">
          <div className="sample-selector">
            <span className="selector-label">Load Sample:</span>
            <button
              className="sample-btn"
              onClick={() => setCode(SAMPLES.basic)}
              disabled={loading}
            >
              Simple
            </button>
            <button
              className="sample-btn"
              onClick={() => setCode(SAMPLES.buggyAsync)}
              disabled={loading}
            >
              Async Bug
            </button>
            <button
              className="sample-btn"
              onClick={() => setCode(SAMPLES.memoryLeak)}
              disabled={loading}
            >
              Memory Leak
            </button>
          </div>

          <button
            className="clear-btn"
            onClick={() => setCode('')}
            disabled={loading || !code}
          >
            Clear
          </button>
        </div>
      </header>

      {/* Main Split Panels */}
      <main className="main-content">
        {/* Left Side: Code Input */}
        <section className="panel panel-left">
          <div className="panel-header">
            <div className="panel-title-group">
              <span className="panel-dot"></span>
              <span className="panel-title">Source Code</span>
              <span className="lang-pill">JavaScript</span>
            </div>
            <div className="editor-stats">
              <span>{lineCount} lines</span>
              <span>•</span>
              <span>{charCount} chars</span>
            </div>
          </div>

          <div className="editor-scroll-area">
            <Editor
              value={code}
              onValueChange={(val) => setCode(val)}
              highlight={(c) => Prism.highlight(c, Prism.languages.javascript, 'javascript')}
              padding={20}
              placeholder="// Paste or write your code here..."
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 15,
                lineHeight: '1.6',
                minHeight: '100%',
                backgroundColor: 'var(--bg-editor)',
                color: 'var(--text-primary)'
              }}
            />
          </div>

          <div className="editor-footer">
            <span className="shortcut-hint">
              Press <kbd>⌘</kbd> + <kbd>Enter</kbd> to analyze
            </span>

            <button
              onClick={reviewCode}
              disabled={loading || !code.trim()}
              className={`review-action-btn ${loading ? 'is-loading' : ''}`}
            >
              {loading ? (
                <>
                  <span className="btn-spinner"></span>
                  Analyzing Code...
                </>
              ) : (
                <>
                  <span>✨</span> Run Code Review
                </>
              )}
            </button>
          </div>
        </section>

        {/* Right Side: Structured Review Output */}
        <section className="panel panel-right">
          <div className="panel-header">
            <div className="panel-title-group">
              <span className={`status-indicator ${loading ? 'pulse' : review ? 'complete' : 'idle'}`}></span>
              <span className="panel-title">Review Report</span>
              {review && <span className="status-badge">Analysis Complete</span>}
            </div>

            {review && (
              <button className="copy-review-btn" onClick={copyFullReview}>
                {copiedReview ? '✓ Report Copied' : '📋 Copy Report'}
              </button>
            )}
          </div>

          <div className="review-scroll-area">
            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner-large"></div>
                <h3>Senior Review in Progress...</h3>
                <p>Inspecting code quality, security vulnerabilities, edge cases, and best practices.</p>

                <div className="skeleton-cards">
                  <div className="skeleton-card skeleton-pulse"></div>
                  <div className="skeleton-card skeleton-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="skeleton-card skeleton-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            ) : review ? (
              <div className="markdown-body">
                <Markdown
                  components={{
                    code: CodeBlock,
                    h2: CustomH2
                  }}
                >
                  {review}
                </Markdown>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🛡️</div>
                <h3>Ready for Deep Code Review</h3>
                <p>
                  Paste any code snippet on the left and click <strong>Run Code Review</strong> to get an instant senior-level analysis.
                </p>

                <div className="feature-grid">
                  <div className="feature-item">
                    <span className="feat-icon">🎯</span>
                    <div>
                      <strong>Architecture & Clean Code</strong>
                      <p>Readability, modularity, and maintainability check</p>
                    </div>
                  </div>
                  <div className="feature-item">
                    <span className="feat-icon">⚠️</span>
                    <div>
                      <strong>Bug & Vulnerability Hunter</strong>
                      <p>Identifies memory leaks, logic bugs, and edge cases</p>
                    </div>
                  </div>
                  <div className="feature-item">
                    <span className="feat-icon">⚡</span>
                    <div>
                      <strong>Performance & Scalability</strong>
                      <p>Big-O complexity, unnecessary allocations, and async traps</p>
                    </div>
                  </div>
                  <div className="feature-item">
                    <span className="feat-icon">✅</span>
                    <div>
                      <strong>Production-Ready Refactor</strong>
                      <p>Includes complete corrected code ready to copy-paste</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;

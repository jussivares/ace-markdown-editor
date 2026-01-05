import React, { useState } from 'react';

// Warm Notes Dark - ACE Markdown Editor Concept
// Filosofia: Cozy, pehmeät kulmat, lämmin tunnelma, dark mode

const WarmNotesMockup = () => {
  const [activeNote, setActiveNote] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [splitRatio, setSplitRatio] = useState(0.5);
  const [viewMode, setViewMode] = useState('split'); // 'split', 'edit', 'preview'
  
  const notes = [
    { id: 1, title: 'Project Ideas', emoji: '💡', date: 'Today', preview: 'Some thoughts on the new markdown editor...' },
    { id: 2, title: 'Meeting Notes', emoji: '📝', date: 'Yesterday', preview: 'Discussed roadmap and priorities...' },
    { id: 3, title: 'Book Summary', emoji: '📚', date: '3 days ago', preview: 'Key takeaways from the book...' },
    { id: 4, title: 'Travel Plans', emoji: '✈️', date: 'Last week', preview: 'Destinations to visit this year...' },
    { id: 5, title: 'Recipe Collection', emoji: '🍳', date: 'Last week', preview: 'Favorite recipes to try...' },
  ];

  const currentContent = `# Project Ideas

Some thoughts on the new markdown editor...

## Features to Build

- **Live preview** with syntax highlighting
- *Autosave* every few seconds
- Export to PDF and HTML
- Dark mode support 🌙

## Code Example

\`\`\`javascript
const greeting = "Hello, World!";
console.log(greeting);
\`\`\`

> "The best writing tool is the one that gets out of your way."

### Next Steps

1. Finalize the design
2. Build the prototype
3. Test on iPad

---

*Last updated: Today*`;

  const renderPreview = (content) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('# ')) return <h1 key={i} style={styles.previewH1}>{line.slice(2)}</h1>;
      if (line.startsWith('## ')) return <h2 key={i} style={styles.previewH2}>{line.slice(3)}</h2>;
      if (line.startsWith('### ')) return <h3 key={i} style={styles.previewH3}>{line.slice(4)}</h3>;
      if (line.startsWith('> ')) return <blockquote key={i} style={styles.blockquote}>{line.slice(2)}</blockquote>;
      if (line.startsWith('- ')) return <li key={i} style={styles.listItem}>{renderInline(line.slice(2))}</li>;
      if (line.match(/^\d+\. /)) return <li key={i} style={styles.listItemOrdered}>{renderInline(line.replace(/^\d+\. /, ''))}</li>;
      if (line === '---') return <hr key={i} style={styles.hr} />;
      if (line.startsWith('```') || line.startsWith('*Last')) return null;
      if (line === '') return <br key={i} />;
      return <p key={i} style={styles.previewP}>{renderInline(line)}</p>;
    });
  };

  const renderInline = (text) => {
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong style="color:#f4d9b0">$1</strong>');
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    text = text.replace(/`(.*?)`/g, '<code style="background:#3d3530;padding:2px 8px;border-radius:6px;font-family:SF Mono,monospace;color:#f0a8a8;font-size:0.9em">$1</code>');
    return <span dangerouslySetInnerHTML={{ __html: text }} />;
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <aside style={{
        ...styles.sidebar,
        width: sidebarOpen ? '260px' : '0px',
        padding: sidebarOpen ? '20px' : '0px',
        opacity: sidebarOpen ? 1 : 0,
      }}>
        {/* Search */}
        <div style={styles.searchContainer}>
          <span style={styles.searchIcon}>🔍</span>
          <input 
            type="text" 
            placeholder="Search notes..." 
            style={styles.searchInput}
          />
        </div>
        
        {/* New Note Button */}
        <button style={styles.newNoteBtn}>
          <span style={styles.newNotePlus}>+</span>
          <span>New Note</span>
        </button>
        
        {/* Notes List */}
        <div style={styles.notesList}>
          <div style={styles.sectionLabel}>Recent</div>
          {notes.map((note, idx) => (
            <div
              key={note.id}
              onClick={() => setActiveNote(idx)}
              style={{
                ...styles.noteCard,
                backgroundColor: activeNote === idx ? 'rgba(240, 168, 168, 0.12)' : 'transparent',
                borderColor: activeNote === idx ? 'rgba(240, 168, 168, 0.3)' : 'transparent',
              }}
            >
              <div style={styles.noteEmoji}>{note.emoji}</div>
              <div style={styles.noteInfo}>
                <div style={styles.noteTitle}>{note.title}</div>
                <div style={styles.notePreview}>{note.preview}</div>
                <div style={styles.noteDate}>{note.date}</div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Footer */}
        <div style={styles.sidebarFooter}>
          <div style={styles.userBadge}>
            <div style={styles.avatar}>J</div>
            <span style={styles.userName}>Jussi's Notes</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={styles.main}>
        {/* Toolbar */}
        <header style={styles.toolbar}>
          <div style={styles.toolbarLeft}>
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={styles.toolbarBtn}
            >
              {sidebarOpen ? '◀' : '▶'}
            </button>
            <div style={styles.breadcrumb}>
              <span style={styles.noteEmojiSmall}>{notes[activeNote].emoji}</span>
              <span style={styles.noteTitleToolbar}>{notes[activeNote].title}</span>
            </div>
            <div style={styles.savedBadge}>
              <span style={styles.savedDot}></span>
              Saved
            </div>
          </div>
          
          <div style={styles.toolbarCenter}>
            <div style={styles.viewToggle}>
              <button 
                onClick={() => setViewMode('edit')}
                style={{
                  ...styles.viewBtn,
                  backgroundColor: viewMode === 'edit' ? 'rgba(240, 168, 168, 0.2)' : 'transparent',
                  color: viewMode === 'edit' ? '#f0a8a8' : colors.textSecondary,
                }}
              >
                Edit
              </button>
              <button 
                onClick={() => setViewMode('split')}
                style={{
                  ...styles.viewBtn,
                  backgroundColor: viewMode === 'split' ? 'rgba(240, 168, 168, 0.2)' : 'transparent',
                  color: viewMode === 'split' ? '#f0a8a8' : colors.textSecondary,
                }}
              >
                Split
              </button>
              <button 
                onClick={() => setViewMode('preview')}
                style={{
                  ...styles.viewBtn,
                  backgroundColor: viewMode === 'preview' ? 'rgba(240, 168, 168, 0.2)' : 'transparent',
                  color: viewMode === 'preview' ? '#f0a8a8' : colors.textSecondary,
                }}
              >
                Preview
              </button>
            </div>
          </div>
          
          <div style={styles.toolbarRight}>
            <button style={styles.exportBtn}>
              <span>Export</span>
              <span style={styles.exportArrow}>▾</span>
            </button>
            <button style={styles.moreBtn}>•••</button>
          </div>
        </header>

        {/* Content Area */}
        <div style={styles.contentArea}>
          {/* Editor */}
          {(viewMode === 'edit' || viewMode === 'split') && (
            <div style={{ 
              ...styles.editorPane,
              width: viewMode === 'split' ? `${splitRatio * 100}%` : '100%',
            }}>
              <div style={styles.editorScroll}>
                <pre style={styles.editorText}>{currentContent}</pre>
              </div>
            </div>
          )}

          {/* Divider */}
          {viewMode === 'split' && (
            <div 
              style={styles.divider}
              onMouseDown={(e) => {
                const startX = e.clientX;
                const startRatio = splitRatio;
                const container = e.target.parentElement;
                
                const onMove = (moveE) => {
                  const delta = moveE.clientX - startX;
                  const containerWidth = container.offsetWidth;
                  const newRatio = Math.max(0.25, Math.min(0.75, startRatio + delta / containerWidth));
                  setSplitRatio(newRatio);
                };
                
                const onUp = () => {
                  document.removeEventListener('mousemove', onMove);
                  document.removeEventListener('mouseup', onUp);
                };
                
                document.addEventListener('mousemove', onMove);
                document.addEventListener('mouseup', onUp);
              }}
            >
              <div style={styles.dividerPill}></div>
            </div>
          )}

          {/* Preview */}
          {(viewMode === 'preview' || viewMode === 'split') && (
            <div style={{ 
              ...styles.previewPane,
              width: viewMode === 'split' ? `${(1 - splitRatio) * 100}%` : '100%',
            }}>
              <div style={styles.previewScroll}>
                <article style={styles.previewArticle}>
                  {renderPreview(currentContent)}
                  
                  {/* Code block */}
                  <div style={styles.codeBlock}>
                    <div style={styles.codeHeader}>
                      <div style={styles.codeDots}>
                        <span style={{...styles.codeDot, backgroundColor: '#ff6b6b'}}></span>
                        <span style={{...styles.codeDot, backgroundColor: '#feca57'}}></span>
                        <span style={{...styles.codeDot, backgroundColor: '#5cd85c'}}></span>
                      </div>
                      <span style={styles.codeLang}>javascript</span>
                    </div>
                    <pre style={styles.codeContent}>
                      <span style={{color: '#82aaff'}}>const</span>{' '}
                      <span style={{color: '#f0a8a8'}}>greeting</span>{' '}
                      <span style={{color: '#89ddff'}}>=</span>{' '}
                      <span style={{color: '#c3e88d'}}>"Hello, World!"</span>;{'\n'}
                      <span style={{color: '#82aaff'}}>console</span>.
                      <span style={{color: '#c792ea'}}>log</span>(
                      <span style={{color: '#f0a8a8'}}>greeting</span>);
                    </pre>
                  </div>
                  
                  <p style={styles.previewP}>
                    <em style={{color: colors.textMuted}}>Last updated: Today</em>
                  </p>
                </article>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// Design Tokens - Warm Notes Dark Theme
const colors = {
  // Backgrounds - warm cocoa/mocha tones
  bgDeepest: '#1e1a18',    // Deepest (outside edges)
  bgDeep: '#252120',       // Sidebar
  bgPrimary: '#2b2625',    // Main content
  bgElevated: '#332e2c',   // Cards, elevated surfaces
  bgHover: '#3d3530',      // Hover states
  
  // Text - creamy warm tones
  textPrimary: '#f4ebe4',    // Primary text (warm cream)
  textSecondary: '#b8a99e',  // Secondary text
  textMuted: '#7a6e66',      // Muted/placeholder
  
  // Accent - soft coral/rose
  accent: '#f0a8a8',          // Primary accent (soft coral)
  accentHover: '#f4bfbf',     // Lighter on hover
  accentMuted: '#d4908f',     // Muted version
  accentSubtle: 'rgba(240, 168, 168, 0.12)', // Very subtle
  
  // Secondary accent - warm gold
  gold: '#f4d9b0',
  
  // Borders
  border: '#3d3530',
  borderLight: '#4a433e',
};

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    backgroundColor: colors.bgDeepest,
    fontFamily: '"Nunito", "SF Pro Rounded", -apple-system, sans-serif',
    color: colors.textPrimary,
  },
  
  // Sidebar
  sidebar: {
    backgroundColor: colors.bgDeep,
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    overflow: 'hidden',
    borderRight: `1px solid ${colors.border}`,
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: colors.bgElevated,
    borderRadius: '12px',
    padding: '10px 14px',
    marginBottom: '16px',
    border: `1px solid ${colors.border}`,
  },
  searchIcon: {
    fontSize: '14px',
    marginRight: '10px',
    opacity: 0.6,
  },
  searchInput: {
    background: 'none',
    border: 'none',
    color: colors.textPrimary,
    fontSize: '14px',
    width: '100%',
    outline: 'none',
    fontFamily: 'inherit',
  },
  newNoteBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    backgroundColor: colors.accent,
    border: 'none',
    color: colors.bgDeep,
    padding: '12px 16px',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    fontFamily: 'inherit',
    marginBottom: '20px',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(240, 168, 168, 0.25)',
  },
  newNotePlus: {
    fontSize: '18px',
    fontWeight: '300',
  },
  notesList: {
    flex: 1,
    overflowY: 'auto',
  },
  sectionLabel: {
    fontSize: '11px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: colors.textMuted,
    marginBottom: '12px',
    paddingLeft: '4px',
  },
  noteCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '14px',
    marginBottom: '8px',
    borderRadius: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: '1px solid transparent',
  },
  noteEmoji: {
    fontSize: '24px',
    lineHeight: 1,
    marginTop: '2px',
  },
  noteInfo: {
    flex: 1,
    minWidth: 0,
  },
  noteTitle: {
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '4px',
    color: colors.textPrimary,
  },
  notePreview: {
    fontSize: '12px',
    color: colors.textSecondary,
    marginBottom: '6px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  noteDate: {
    fontSize: '11px',
    color: colors.textMuted,
  },
  sidebarFooter: {
    paddingTop: '16px',
    borderTop: `1px solid ${colors.border}`,
    marginTop: '16px',
  },
  userBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '10px',
    backgroundColor: colors.accent,
    color: colors.bgDeep,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '14px',
  },
  userName: {
    fontSize: '13px',
    fontWeight: '500',
    color: colors.textSecondary,
  },
  
  // Main
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: colors.bgPrimary,
    borderRadius: '20px 0 0 20px',
    overflow: 'hidden',
    marginLeft: '-1px',
  },
  
  // Toolbar
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 24px',
    backgroundColor: colors.bgPrimary,
    borderBottom: `1px solid ${colors.border}`,
  },
  toolbarLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  toolbarCenter: {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
  },
  toolbarRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  toolbarBtn: {
    background: colors.bgElevated,
    border: `1px solid ${colors.border}`,
    color: colors.textSecondary,
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  noteEmojiSmall: {
    fontSize: '18px',
  },
  noteTitleToolbar: {
    fontSize: '15px',
    fontWeight: '600',
    color: colors.textPrimary,
  },
  savedBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    color: colors.textMuted,
    backgroundColor: colors.bgElevated,
    padding: '5px 10px',
    borderRadius: '8px',
  },
  savedDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#5cd85c',
  },
  viewToggle: {
    display: 'flex',
    backgroundColor: colors.bgElevated,
    borderRadius: '10px',
    padding: '4px',
    gap: '2px',
  },
  viewBtn: {
    background: 'transparent',
    border: 'none',
    color: colors.textSecondary,
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    fontFamily: 'inherit',
    transition: 'all 0.2s ease',
  },
  exportBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: colors.bgElevated,
    border: `1px solid ${colors.border}`,
    color: colors.textPrimary,
    padding: '8px 14px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    fontFamily: 'inherit',
  },
  exportArrow: {
    fontSize: '10px',
    color: colors.textMuted,
  },
  moreBtn: {
    background: colors.bgElevated,
    border: `1px solid ${colors.border}`,
    color: colors.textSecondary,
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '14px',
    letterSpacing: '1px',
  },
  
  // Content Area
  contentArea: {
    flex: 1,
    display: 'flex',
    overflow: 'hidden',
    position: 'relative',
  },
  
  // Editor
  editorPane: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: colors.bgPrimary,
    minWidth: 0,
  },
  editorScroll: {
    flex: 1,
    padding: '32px',
    overflowY: 'auto',
  },
  editorText: {
    fontFamily: '"SF Mono", "JetBrains Mono", Consolas, monospace',
    fontSize: '14px',
    lineHeight: '1.8',
    color: colors.textPrimary,
    whiteSpace: 'pre-wrap',
    margin: 0,
  },
  
  // Divider
  divider: {
    width: '12px',
    backgroundColor: colors.bgElevated,
    cursor: 'col-resize',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s ease',
  },
  dividerPill: {
    width: '4px',
    height: '48px',
    backgroundColor: colors.borderLight,
    borderRadius: '4px',
    transition: 'all 0.2s ease',
  },
  
  // Preview
  previewPane: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: colors.bgElevated,
    minWidth: 0,
    borderRadius: '16px 0 0 16px',
  },
  previewScroll: {
    flex: 1,
    padding: '32px 40px',
    overflowY: 'auto',
  },
  previewArticle: {
    maxWidth: '680px',
    margin: '0 auto',
  },
  previewH1: {
    fontSize: '32px',
    fontWeight: '700',
    marginBottom: '24px',
    marginTop: '0',
    color: colors.textPrimary,
    letterSpacing: '-0.5px',
  },
  previewH2: {
    fontSize: '24px',
    fontWeight: '700',
    marginBottom: '16px',
    marginTop: '32px',
    color: colors.textPrimary,
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  previewH3: {
    fontSize: '18px',
    fontWeight: '700',
    marginBottom: '12px',
    marginTop: '24px',
    color: colors.textPrimary,
  },
  previewP: {
    fontSize: '16px',
    lineHeight: '1.8',
    marginBottom: '16px',
    color: colors.textPrimary,
  },
  blockquote: {
    borderLeft: `4px solid ${colors.accent}`,
    paddingLeft: '20px',
    margin: '24px 0',
    fontStyle: 'italic',
    color: colors.textSecondary,
    backgroundColor: colors.accentSubtle,
    padding: '16px 20px',
    borderRadius: '0 12px 12px 0',
  },
  listItem: {
    fontSize: '16px',
    lineHeight: '1.8',
    marginBottom: '10px',
    marginLeft: '24px',
    listStyleType: 'disc',
    color: colors.textPrimary,
  },
  listItemOrdered: {
    fontSize: '16px',
    lineHeight: '1.8',
    marginBottom: '10px',
    marginLeft: '24px',
    listStyleType: 'decimal',
    color: colors.textPrimary,
  },
  hr: {
    border: 'none',
    height: '2px',
    backgroundColor: colors.border,
    margin: '32px 0',
    borderRadius: '1px',
  },
  
  // Code Block
  codeBlock: {
    backgroundColor: colors.bgDeep,
    borderRadius: '16px',
    marginTop: '24px',
    marginBottom: '24px',
    overflow: 'hidden',
    border: `1px solid ${colors.border}`,
    boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
  },
  codeHeader: {
    padding: '12px 16px',
    borderBottom: `1px solid ${colors.border}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  codeDots: {
    display: 'flex',
    gap: '6px',
  },
  codeDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
  },
  codeLang: {
    fontSize: '11px',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontWeight: '600',
  },
  codeContent: {
    padding: '20px',
    fontFamily: '"SF Mono", "JetBrains Mono", Consolas, monospace',
    fontSize: '14px',
    lineHeight: '1.7',
    margin: 0,
    color: colors.textPrimary,
  },
};

export default WarmNotesMockup;

import { useState, useEffect, useRef } from "react";

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');

  [contenteditable]:empty:before {
    content: attr(data-placeholder);
    color: #3a4a5a;
    pointer-events: none;
  }

  @keyframes fadeInModal {
    from { opacity: 0; transform: scale(0.97); }
    to   { opacity: 1; transform: scale(1); }
  }

  @keyframes checkPop {
    0%   { transform: scale(0.5); opacity: 0; }
    60%  { transform: scale(1.3); opacity: 1; }
    100% { transform: scale(1);   opacity: 1; }
  }

  *, *::before, *::after { box-sizing: border-box; }

  body { margin: 0; padding: 0; }

  .digest-header {
    padding: 28px 40px 0 !important;
  }
  .digest-header-inner {
    flex-direction: row !important;
    align-items: flex-start !important;
  }
  .digest-content {
    padding: 32px 40px !important;
  }
  .digest-grid-weekly {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)) !important;
  }
  .digest-grid-curriculum {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)) !important;
  }
  .digest-grid-tips {
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)) !important;
  }
  .digest-tabs button {
    padding: 12px 24px !important;
    font-size: 13px !important;
  }
  .progress-badge {
    display: flex !important;
    flex-direction: column !important;
  }
  .tip-banner {
    flex-direction: row !important;
    align-items: center !important;
  }
  .expand-buttons {
    flex-direction: row !important;
    flex-wrap: wrap !important;
  }

  .prompt-grid {
    grid-template-columns: repeat(2, 1fr) !important;
  }

  @media (max-width: 768px) {
    .prompt-grid {
      grid-template-columns: 1fr !important;
    }
  }
    .digest-header {
      padding: 20px 16px 0 !important;
    }
    .digest-header-inner {
      flex-direction: column !important;
      gap: 16px !important;
    }
    .progress-badge {
      width: 100% !important;
    }
    .progress-badge-nums {
      display: flex;
      align-items: baseline;
      gap: 8px;
    }
    .digest-content {
      padding: 20px 16px !important;
    }
    .digest-tabs {
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }
    .digest-tabs button {
      padding: 10px 16px !important;
      font-size: 12px !important;
      white-space: nowrap !important;
    }
    .digest-grid-weekly {
      grid-template-columns: repeat(2, 1fr) !important;
    }
    .digest-grid-curriculum {
      grid-template-columns: repeat(2, 1fr) !important;
    }
    .digest-grid-tips {
      grid-template-columns: repeat(2, 1fr) !important;
    }
    .tip-banner {
      flex-direction: column !important;
      align-items: flex-start !important;
      gap: 8px !important;
    }
    .expand-buttons {
      flex-direction: column !important;
    }
    .expand-buttons a,
    .expand-buttons button {
      width: 100% !important;
      text-align: center !important;
    }
    h1 {
      font-size: 22px !important;
    }
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    .digest-header {
      padding: 24px 24px 0 !important;
    }
    .digest-content {
      padding: 28px 24px !important;
    }
    .digest-grid-weekly {
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)) !important;
    }
    .digest-grid-curriculum {
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)) !important;
    }
    .digest-grid-tips {
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)) !important;
    }
  }
`;

const COURSES = [
  {
    id: 1,
    level: "Beginner",
    levelNum: 1,
    title: "Introduction to Claude",
    description: "Understand what Claude is, how it works at a high level, and how to interact with it effectively for everyday tasks.",
    duration: "~2 hours",
    topics: ["What is Claude?", "How LLMs work (conceptually)", "Basic conversation patterns", "Setting context and tone"],
    url: "https://anthropic.skilljar.com/claude-101",
    color: "#4ade80",
    icon: "🌱"
  },
  {
    id: 2,
    level: "Beginner",
    levelNum: 1,
    title: "Prompt Engineering Fundamentals",
    description: "The art and science of crafting prompts — covering the key principles that separate mediocre results from excellent ones.",
    duration: "~3 hours",
    topics: ["Clear instructions", "Role assignment", "Output formatting", "Avoiding ambiguity"],
    url: "https://anthropic.skilljar.com/ai-fluency-framework-foundations",
    color: "#4ade80",
    icon: "✏️"
  },
  {
    id: 3,
    level: "Intermediate",
    levelNum: 2,
    title: "Advanced Prompting Techniques",
    description: "Go beyond basics with chain-of-thought prompting, few-shot examples, and structured output techniques that dramatically improve quality.",
    duration: "~4 hours",
    topics: ["Chain-of-thought (CoT)", "Few-shot examples", "Zero-shot vs few-shot", "XML tags for structure"],
    url: "https://anthropic.skilljar.com/claude-with-the-anthropic-api",
    color: "#60a5fa",
    icon: "🔗"
  },
  {
    id: 4,
    level: "Intermediate",
    levelNum: 2,
    title: "Working with the Claude API",
    description: "Learn to integrate Claude into applications using the Anthropic API — messages, system prompts, and managing conversations programmatically.",
    duration: "~5 hours",
    topics: ["API authentication", "Messages API", "System prompts via API", "Token management"],
    url: "https://anthropic.skilljar.com/claude-with-the-anthropic-api",
    color: "#60a5fa",
    icon: "⚙️"
  },
  {
    id: 5,
    level: "Intermediate",
    levelNum: 2,
    title: "Building with Claude: RAG & Context",
    description: "Understand retrieval-augmented generation (RAG), how to inject context into Claude, and how to handle large documents effectively.",
    duration: "~5 hours",
    topics: ["What is RAG?", "Injecting documents", "Context window strategy", "Chunking techniques"],
    url: "https://anthropic.skilljar.com/claude-with-the-anthropic-api",
    color: "#60a5fa",
    icon: "📚"
  },
  {
    id: 6,
    level: "Advanced",
    levelNum: 3,
    title: "Tool Use & Function Calling",
    description: "Extend Claude's capabilities by giving it tools — search, calculators, databases — and learn how agentic tool use transforms what's possible.",
    duration: "~6 hours",
    topics: ["Tool definitions", "Function calling patterns", "Multi-tool workflows", "Error handling"],
    url: "https://anthropic.skilljar.com/introduction-to-model-context-protocol",
    color: "#f472b6",
    icon: "🔧"
  },
  {
    id: 7,
    level: "Advanced",
    levelNum: 3,
    title: "Agentic AI & Multi-Step Workflows",
    description: "Design autonomous agents that can plan, reason, and execute multi-step tasks — including orchestration patterns and human-in-the-loop design.",
    duration: "~7 hours",
    topics: ["Agent architecture", "Planning loops", "Subagents & orchestrators", "Safety in agents"],
    url: "https://anthropic.skilljar.com/model-context-protocol-advanced-topics",
    color: "#f472b6",
    icon: "🤖"
  },
  {
    id: 8,
    level: "Advanced",
    levelNum: 3,
    title: "Evaluations & Production Reliability",
    description: "Learn to measure, test, and improve Claude's outputs systematically — building evals, red-teaming, and creating robust production pipelines.",
    duration: "~6 hours",
    topics: ["Building eval frameworks", "Automated testing", "Red-teaming prompts", "Monitoring in production"],
    url: "https://anthropic.skilljar.com/claude-code-in-action",
    color: "#f472b6",
    icon: "🧪"
  }
];

// Add N weekdays to a date, skipping Saturday and Sunday
function addWeekdays(date, days) {
  const result = new Date(date);
  let added = 0;
  while (added < days) {
    result.setDate(result.getDate() + 1);
    const dow = result.getDay();
    if (dow !== 0 && dow !== 6) added++;
  }
  return result;
}

function generateWeeklySchedule() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Module 1 = Mon Mar 10, Module 2 = Fri Mar 13, then every 2 weekdays
  const MODULE_DATES = [
    new Date(2026, 2, 10), // Mar 10 — Introduction to Claude
    new Date(2026, 2, 13), // Mar 13 — Prompt Engineering Fundamentals
  ];
  for (let i = 2; i < COURSES.length; i++) {
    MODULE_DATES.push(addWeekdays(MODULE_DATES[i - 1], 2));
  }

  const DAY_NAMES = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

  const thisMonday = new Date(today);
  const dow = today.getDay();
  thisMonday.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1));
  const nextMonday = new Date(thisMonday);
  nextMonday.setDate(thisMonday.getDate() + 7);
  const weekAfter = new Date(thisMonday);
  weekAfter.setDate(thisMonday.getDate() + 14);

  return COURSES.map((course, i) => {
    const date = new Date(MODULE_DATES[i]);
    date.setHours(0, 0, 0, 0);

    let weekLabel = "Upcoming";
    if (date < thisMonday) weekLabel = "This Week";
    else if (date >= thisMonday && date < nextMonday) weekLabel = "This Week";
    else if (date >= nextMonday && date < weekAfter) weekLabel = "Next Week";

    return {
      key: `module-${i}`,
      label: DAY_NAMES[date.getDay()],
      weekLabel,
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      course,
      focusTopic: course.topics[i % course.topics.length],
      isToday: date.toDateString() === today.toDateString(),
      isPast: date < today,
    };
  });
}

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const tips = [
  "Use XML tags like <context>, <task>, and <output> to give Claude clear structure.",
  "Few-shot examples are often more powerful than long instructions alone.",
  "Ask Claude to reason step-by-step before giving a final answer for complex tasks.",
  "Assign Claude a specific role: 'You are an expert data analyst...' sets the frame instantly.",
  "Iterate: treat your first prompt as a draft, not a final product.",
  "Be explicit about format — 'respond in JSON', 'use bullet points', 'write a table'.",
  "Use negative examples: 'Do NOT include...' is often as important as what to include.",
];

function NoteEditor({ course, notes, setNotes, images, setImages }) {
  const editorRef = useRef(null);
  const [focused, setFocused] = useState(false);
  const [activeFormats, setActiveFormats] = useState({ bold: false, italic: false, underline: false });
  const courseImages = images[course.id] || [];
  const hasContent = (notes[course.id] && notes[course.id] !== "<br>" && notes[course.id] !== "") || courseImages.length > 0;

  // Initialise editor HTML once on mount
  useEffect(() => {
    if (editorRef.current && notes[course.id] !== undefined) {
      editorRef.current.innerHTML = notes[course.id] || "";
    }
  }, [course.id]);

  const saveContent = () => {
    if (editorRef.current) {
      setNotes(prev => ({ ...prev, [course.id]: editorRef.current.innerHTML }));
    }
  };

  const updateActiveFormats = () => {
    setActiveFormats({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
    });
  };

  const applyFormat = (cmd) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, null);
    updateActiveFormats();
    saveContent();
  };

  const handlePaste = (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        e.preventDefault();
        const file = item.getAsFile();
        const reader = new FileReader();
        reader.onload = (ev) => {
          const id = Date.now() + Math.random();
          setImages(prev => ({ ...prev, [course.id]: [...(prev[course.id] || []), { id, src: ev.target.result }] }));
        };
        reader.readAsDataURL(file);
        return;
      }
    }
    // Plain text paste — let browser handle naturally then save
    setTimeout(saveContent, 0);
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const id = Date.now() + Math.random();
      setImages(prev => ({ ...prev, [course.id]: [...(prev[course.id] || []), { id, src: ev.target.result }] }));
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const removeImage = (imgId) => {
    setImages(prev => ({ ...prev, [course.id]: prev[course.id].filter(img => img.id !== imgId) }));
  };

  const clearAll = () => {
    if (editorRef.current) editorRef.current.innerHTML = "";
    setNotes(prev => ({ ...prev, [course.id]: "" }));
    setImages(prev => ({ ...prev, [course.id]: [] }));
  };

  const formatBtn = (label, cmd, title) => {
    const isActive = activeFormats[cmd];
    return (
      <button
        onMouseDown={e => { e.preventDefault(); applyFormat(cmd); }}
        title={`${title} (Ctrl+${label})`}
        style={{
          width: 30, height: 30, borderRadius: 6, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, fontWeight: 700, fontFamily: "'Inter', sans-serif",
          border: `1px solid ${isActive ? course.color + "88" : "rgba(255,255,255,0.09)"}`,
          background: isActive ? course.color + "22" : "rgba(255,255,255,0.04)",
          color: isActive ? course.color : "#8a9aaa",
          transition: "all 0.15s",
          ...(cmd === "italic" ? { fontStyle: "italic" } : {}),
          ...(cmd === "underline" ? { textDecoration: "underline" } : {}),
        }}
        onMouseEnter={e => { if (!isActive) { e.currentTarget.style.borderColor = course.color + "55"; e.currentTarget.style.color = course.color; }}}
        onMouseLeave={e => { if (!isActive) { e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"; e.currentTarget.style.color = "#8a9aaa"; }}}
      >
        {label}
      </button>
    );
  };

  const [lightbox, setLightbox] = useState(null);

  return (
    <div>
      {/* Lightbox modal */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(0,0,0,0.88)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 24, backdropFilter: "blur(6px)",
            animation: "fadeInModal 0.2s ease"
          }}
        >
          <div onClick={e => e.stopPropagation()} style={{ position: "relative", maxWidth: "95vw", maxHeight: "92vh" }}>
            <img
              src={lightbox}
              alt="Full screenshot"
              style={{
                display: "block",
                maxWidth: "95vw",
                maxHeight: "88vh",
                borderRadius: 10,
                boxShadow: "0 24px 80px rgba(0,0,0,0.7)",
                border: "1px solid rgba(255,255,255,0.1)"
              }}
            />
            <button
              onClick={() => setLightbox(null)}
              style={{
                position: "absolute", top: -14, right: -14,
                width: 32, height: 32, borderRadius: "50%",
                background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.15)",
                color: "#ccc", fontSize: 16, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s", lineHeight: 1
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "#f472b6"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#1a1a2e"; e.currentTarget.style.color = "#ccc"; }}
              title="Close"
            >×</button>
          </div>
          <div style={{ position: "absolute", bottom: 20, color: "rgba(255,255,255,0.3)", fontSize: 12 }}>
            Click anywhere outside to close
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {/* Formatting buttons */}
          {formatBtn("B", "bold", "Bold")}
          {formatBtn("I", "italic", "Italic")}
          {formatBtn("U", "underline", "Underline")}

          <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.08)", margin: "0 4px" }} />

          {/* Import image */}
          <label style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)",
            borderRadius: 6, padding: "5px 12px", cursor: "pointer",
            fontSize: 11, color: "#8a9aaa", letterSpacing: "0.05em", transition: "all 0.2s"
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = course.color + "66"; e.currentTarget.style.color = course.color; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"; e.currentTarget.style.color = "#8a9aaa"; }}
          >
            <span style={{ fontSize: 14 }}>🖼️</span> Import Image
            <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleImport} />
          </label>
          <span style={{ fontSize: 11, color: "#3a4a5a" }}>or paste a screenshot</span>
        </div>

        {hasContent && (
          <button onClick={clearAll} style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: 11, color: "#4a5a6a", padding: "2px 8px",
            borderRadius: 4, fontFamily: "'Inter', sans-serif", transition: "color 0.2s"
          }}
            onMouseEnter={e => e.target.style.color = "#f472b6"}
            onMouseLeave={e => e.target.style.color = "#4a5a6a"}
          >Clear all</button>
        )}
      </div>

      {/* Rich text editor */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={saveContent}
        onPaste={handlePaste}
        onFocus={() => { setFocused(true); updateActiveFormats(); }}
        onBlur={() => { setFocused(false); saveContent(); }}
        onKeyUp={updateActiveFormats}
        onMouseUp={updateActiveFormats}
        data-placeholder={`What did you learn in "${course.title}"? Jot down key concepts, insights, or questions...`}
        style={{
          width: "100%",
          minHeight: 120,
          background: "rgba(255,255,255,0.03)",
          border: `1px solid ${focused ? course.color + "66" : "rgba(255,255,255,0.07)"}`,
          borderRadius: 8,
          padding: "12px 14px",
          color: "#d0c8e0",
          fontSize: 13,
          lineHeight: 1.7,
          fontFamily: "'Inter', sans-serif",
          outline: "none",
          boxSizing: "border-box",
          transition: "border-color 0.2s",
          caretColor: course.color,
          wordBreak: "break-word",
          whiteSpace: "pre-wrap",
        }}
      />

      {/* Pasted / imported images */}
      {courseImages.length > 0 && (
        <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
          {courseImages.map(img => (
            <div key={img.id} style={{ position: "relative", borderRadius: 8, overflow: "hidden" }}
              onMouseEnter={e => e.currentTarget.querySelector(".img-overlay").style.opacity = "1"}
              onMouseLeave={e => e.currentTarget.querySelector(".img-overlay").style.opacity = "0"}
            >
              {/* Thumbnail */}
              <img
                src={img.src}
                alt="Note screenshot"
                onClick={() => setLightbox(img.src)}
                style={{
                  display: "block", width: "100%", height: 180,
                  objectFit: "cover", objectPosition: "top", borderRadius: 8, cursor: "zoom-in",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
                  transition: "transform 0.2s"
                }}
              />

              {/* Hover overlay — click to expand */}
              <div className="img-overlay" onClick={() => setLightbox(img.src)} style={{
                position: "absolute", inset: 0, borderRadius: 8,
                background: "rgba(0,0,0,0.45)",
                display: "flex", alignItems: "center", justifyContent: "center",
                opacity: 0, transition: "opacity 0.2s", cursor: "zoom-in"
              }}>
                <div style={{
                  background: "rgba(0,0,0,0.6)", borderRadius: 8,
                  padding: "6px 14px", color: "#fff", fontSize: 12,
                  border: "1px solid rgba(255,255,255,0.2)",
                  display: "flex", alignItems: "center", gap: 6
                }}>
                  <span style={{ fontSize: 15 }}>🔍</span> View full size
                </div>
              </div>

              {/* Remove button */}
              <button
                onClick={e => { e.stopPropagation(); removeImage(img.id); }}
                style={{
                  position: "absolute", top: 8, right: 8,
                  background: "rgba(0,0,0,0.7)", border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "50%", width: 26, height: 26,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", color: "#ccc", fontSize: 14, lineHeight: 1, transition: "all 0.2s"
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(244,114,182,0.9)"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(0,0,0,0.7)"; e.currentTarget.style.color = "#ccc"; }}
                title="Remove image"
              >×</button>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div style={{ marginTop: 8, fontSize: 11, color: "#3a4a5a" }}>
        {hasContent
          ? `${courseImages.length > 0 ? `${courseImages.length} image${courseImages.length > 1 ? "s" : ""} · ` : ""}Use Ctrl+B, Ctrl+I, Ctrl+U to format`
          : "Start typing or paste a screenshot to save notes"}
      </div>
    </div>
  );
}

function PromptLibrary({ promptCards, setPromptCards }) {
  const [generating, setGenerating] = useState(null); // card id being generated

  const addCard = () => {
    const id = Date.now();
    setPromptCards(prev => [...prev, {
      id,
      title: "New Prompt",
      icon: "✨",
      prompt: "",
      editingTitle: false
    }]);
  };

  const updateCard = (id, fields) => {
    setPromptCards(prev => prev.map(c => c.id === id ? { ...c, ...fields } : c));
  };

  const deleteCard = (id) => {
    setPromptCards(prev => prev.filter(c => c.id !== id));
  };

  const generateTitleAndIcon = async (id, promptText) => {
    if (!promptText.trim() || promptText.trim().length < 10) return;
    setGenerating(id);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 100,
          messages: [{
            role: "user",
            content: `Given this prompt, respond ONLY with a JSON object (no markdown, no explanation): {"title": "3-5 word title", "icon": "single relevant emoji"}\n\nPrompt: ${promptText.slice(0, 500)}`
          }]
        })
      });
      const data = await res.json();
      const text = data.content?.[0]?.text || "";
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      updateCard(id, { title: parsed.title || "Untitled Prompt", icon: parsed.icon || "✨" });
    } catch {
      updateCard(id, { title: "Untitled Prompt", icon: "✨" });
    } finally {
      setGenerating(null);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 32, gap: 16, flexWrap: "wrap" }}>
        <div>
          <h2 style={{ fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: "#5a6a7a", fontWeight: 500, margin: "0 0 8px" }}>
            Prompt &amp; Pattern Library
          </h2>
          <p style={{ color: "#5a6a7a", fontSize: 14, margin: 0 }}>
            Save your best prompts. Titles and icons are auto-generated — click any title to edit it.
          </p>
        </div>

        {/* + Add Prompt button */}
        <button
          onClick={addCard}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "10px 20px", borderRadius: 8, cursor: "pointer",
            fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500,
            border: "1px solid rgba(201,184,255,0.3)",
            background: "rgba(201,184,255,0.1)", color: "#c9b8ff",
            transition: "all 0.2s", whiteSpace: "nowrap", flexShrink: 0
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,184,255,0.18)"; e.currentTarget.style.borderColor = "rgba(201,184,255,0.5)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(201,184,255,0.1)"; e.currentTarget.style.borderColor = "rgba(201,184,255,0.3)"; }}
        >
          <span style={{ fontSize: 18, lineHeight: 1 }}>+</span>
          Add Prompt
        </button>
      </div>

      {/* Empty state */}
      {promptCards.length === 0 && (
        <div style={{
          textAlign: "center", padding: "64px 24px",
          border: "1px dashed rgba(255,255,255,0.08)", borderRadius: 14
        }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>📋</div>
          <div style={{ fontSize: 15, color: "#5a6a7a", marginBottom: 8 }}>No prompts saved yet</div>
          <div style={{ fontSize: 13, color: "#3a4a5a" }}>Click "+ Add Prompt" to create your first entry</div>
        </div>
      )}

      {/* 2-column card grid */}
      {promptCards.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }} className="prompt-grid">
          {promptCards.map(card => (
            <div key={card.id} style={{
              background: "rgba(255,255,255,0.02)",
              border: card.prompt.trim() ? "1px solid rgba(201,184,255,0.18)" : "1px solid rgba(255,255,255,0.06)",
              borderRadius: 14, overflow: "hidden",
              display: "flex", flexDirection: "column",
              transition: "border-color 0.3s"
            }}>
              {/* Card header */}
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "14px 16px",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                background: card.prompt.trim() ? "linear-gradient(135deg, rgba(201,184,255,0.06), transparent)" : "transparent"
              }}>
                <span style={{ fontSize: 20, lineHeight: 1, flexShrink: 0 }}>
                  {generating === card.id ? "⏳" : card.icon}
                </span>

                {/* Editable title */}
                {card.editingTitle ? (
                  <input
                    autoFocus
                    value={card.title}
                    onChange={e => updateCard(card.id, { title: e.target.value })}
                    onBlur={() => updateCard(card.id, { editingTitle: false })}
                    onKeyDown={e => { if (e.key === "Enter") updateCard(card.id, { editingTitle: false }); }}
                    style={{
                      flex: 1, background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(201,184,255,0.4)",
                      borderRadius: 6, padding: "4px 10px",
                      color: "#d8d0e8", fontSize: 13, fontWeight: 600,
                      fontFamily: "'Inter', sans-serif", outline: "none"
                    }}
                  />
                ) : (
                  <span
                    onClick={() => updateCard(card.id, { editingTitle: true })}
                    title="Click to edit title"
                    style={{
                      flex: 1, fontSize: 13, fontWeight: 600, color: "#d8d0e8",
                      cursor: "text", borderRadius: 4, padding: "4px 6px",
                      transition: "background 0.15s",
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    {generating === card.id ? "Generating title…" : card.title}
                  </span>
                )}

                {/* Delete button */}
                <button
                  onClick={() => deleteCard(card.id)}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    color: "#3a4a5a", fontSize: 16, lineHeight: 1,
                    padding: "2px 4px", borderRadius: 4,
                    transition: "color 0.2s", flexShrink: 0
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = "#f472b6"}
                  onMouseLeave={e => e.currentTarget.style.color = "#3a4a5a"}
                  title="Delete prompt"
                >×</button>
              </div>

              {/* Prompt textarea */}
              <textarea
                value={card.prompt}
                onChange={e => updateCard(card.id, { prompt: e.target.value })}
                onBlur={() => generateTitleAndIcon(card.id, card.prompt)}
                placeholder="Paste or type your prompt here…"
                style={{
                  flex: 1, width: "100%", minHeight: 160,
                  background: "transparent",
                  border: "none", resize: "vertical",
                  padding: "14px 16px",
                  color: "#c8c0d8", fontSize: 13, lineHeight: 1.7,
                  fontFamily: "'Inter', sans-serif",
                  outline: "none", boxSizing: "border-box",
                  caretColor: "#c9b8ff"
                }}
              />

              {/* Footer */}
              <div style={{
                padding: "8px 16px", borderTop: "1px solid rgba(255,255,255,0.04)",
                display: "flex", justifyContent: "space-between", alignItems: "center"
              }}>
                <span style={{ fontSize: 11, color: "#3a4a5a" }}>
                  {card.prompt.trim()
                    ? `${card.prompt.trim().split(/\s+/).filter(Boolean).length} words`
                    : "Start typing to auto-generate title"}
                </span>
                <button
                  onClick={() => generateTitleAndIcon(card.id, card.prompt)}
                  disabled={!card.prompt.trim() || generating === card.id}
                  style={{
                    background: "none", border: "none", cursor: card.prompt.trim() ? "pointer" : "default",
                    fontSize: 11, color: card.prompt.trim() ? "#7c6f8a" : "#2a3a4a",
                    fontFamily: "'Inter', sans-serif", padding: "2px 6px",
                    borderRadius: 4, transition: "color 0.2s"
                  }}
                  onMouseEnter={e => { if (card.prompt.trim()) e.currentTarget.style.color = "#c9b8ff"; }}
                  onMouseLeave={e => e.currentTarget.style.color = card.prompt.trim() ? "#7c6f8a" : "#2a3a4a"}
                  title="Re-generate title and icon"
                >
                  {generating === card.id ? "generating…" : "↻ regenerate"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [winWidth, setWinWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handler = () => setWinWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  const gridCols = winWidth < 500 ? "1fr" : "repeat(2, 1fr)";
  const [activeTab, setActiveTab] = useState("digest");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [completedCourses, setCompletedCourses] = useState(() => {
    try {
      const saved = localStorage.getItem("ai_digest_completed");
      if (saved) return new Set(JSON.parse(saved));
    } catch {}
    return new Set();
  });
  const [notes, setNotesRaw] = useState(() => {
    try {
      const saved = localStorage.getItem("ai_digest_notes");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed["custom_token_usage"]) parsed["custom_token_usage"] = "";
        return parsed;
      }
    } catch {}
    return { ...Object.fromEntries(COURSES.map(c => [c.id, ""])), custom_token_usage: "" };
  });
  const [noteImages, setNoteImagesRaw] = useState(() => {
    try {
      const saved = localStorage.getItem("ai_digest_images");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed["custom_token_usage"]) parsed["custom_token_usage"] = [];
        return parsed;
      }
    } catch {}
    return { ...Object.fromEntries(COURSES.map(c => [c.id, []])), custom_token_usage: [] };
  });

  const setNotes = (updater) => {
    setNotesRaw(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      try { localStorage.setItem("ai_digest_notes", JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const setNoteImages = (updater) => {
    setNoteImagesRaw(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      try { localStorage.setItem("ai_digest_images", JSON.stringify(next)); } catch {}
      return next;
    });
  };
  const [tipIndex, setTipIndex] = useState(0);
  const [animateTip, setAnimateTip] = useState(false);
  const [savedAnim, setSavedAnim] = useState(false);
  const [expandedNotes, setExpandedNotes] = useState(() =>
    Object.fromEntries(COURSES.map(c => [c.id, true]))
  );
  const [promptCards, setPromptCardsRaw] = useState(() => {
    try {
      const saved = localStorage.getItem("ai_digest_prompts");
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });
  const setPromptCards = (updater) => {
    setPromptCardsRaw(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      try { localStorage.setItem("ai_digest_prompts", JSON.stringify(next)); } catch {}
      return next;
    });
  };
  const schedule = generateWeeklySchedule();

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = globalStyles;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimateTip(true);
      setTimeout(() => {
        setTipIndex(i => (i + 1) % tips.length);
        setAnimateTip(false);
      }, 400);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const toggleComplete = (id) => {
    setCompletedCourses(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      try { localStorage.setItem("ai_digest_completed", JSON.stringify([...next])); } catch {}
      return next;
    });
  };

  const progress = Math.round((completedCourses.size / COURSES.length) * 100);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0f",
      color: "#e8e4dc",
      fontFamily: "'Inter', sans-serif",
      padding: "0",
      overflow: "hidden auto"
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #0f0f1a 0%, #1a0f2e 50%, #0f1a1a 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "32px 40px 0",
        position: "sticky", top: 0, zIndex: 100,
        backdropFilter: "blur(20px)"
      }} className="digest-header">
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, marginBottom: 24, flexWrap: "nowrap" }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 11, letterSpacing: "0.25em", color: "#7c6f8a", textTransform: "uppercase", marginBottom: 8 }}>
                Anthropic Learning Path
              </div>
              <h1 style={{
                fontSize: "clamp(20px, 3vw, 32px)", fontWeight: 700,
                background: "linear-gradient(135deg, #c9b8ff 0%, #8fd3f4 50%, #a8edca 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                margin: 0, letterSpacing: "-0.02em", lineHeight: 1.1, whiteSpace: "nowrap"
              }}>
                Your AI Mastery Digest
              </h1>
              <p style={{ color: "#7c8a9a", fontSize: 13, marginTop: 6, marginBottom: 0, whiteSpace: "nowrap" }}>
                From prompt engineering to agentic systems — one day at a time
              </p>
            </div>
            <div style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.09)",
              borderRadius: 14, padding: "14px 20px",
              flexShrink: 0
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, whiteSpace: "nowrap" }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#c9d8e8", letterSpacing: "0.18em", textTransform: "uppercase" }}>Progress</span>
                <span style={{ fontSize: 12, color: "#5a7a6a" }}>{completedCourses.size} of {COURSES.length} modules</span>
                <span style={{ fontSize: 16, fontWeight: 600, color: "#a8edca" }}>{progress}%</span>
                <div style={{ width: 140, height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{
                    height: "100%",
                    width: `${progress}%`,
                    background: "linear-gradient(90deg, #7c6fff, #60c8f0, #a8edca)",
                    borderRadius: 3,
                    transition: "width 0.6s ease"
                  }} />
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 0 }} className="digest-tabs">
            {[
              { key: "digest", label: "Weekly Digest" },
              { key: "curriculum", label: "Full Curriculum" },
              { key: "tips", label: "Daily Tips" },
              { key: "notes", label: "Learning Notes" },
              { key: "library", label: "Prompt & Pattern Library" }
            ].map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                background: "none", border: "none", cursor: "pointer",
                padding: "12px 24px",
                fontSize: 13, letterSpacing: "0.05em",
                color: activeTab === tab.key ? "#c9b8ff" : "#5a6a7a",
                borderBottom: activeTab === tab.key ? "2px solid #c9b8ff" : "2px solid transparent",
                transition: "all 0.2s", fontFamily: "'Inter', sans-serif"
              }}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 40px" }} className="digest-content">

        {/* WEEKLY DIGEST TAB */}
        {activeTab === "digest" && (
          <div>
            {/* Tip Banner */}
            <div style={{
              background: "linear-gradient(135deg, rgba(201,184,255,0.08), rgba(143,211,244,0.06))",
              border: "1px solid rgba(201,184,255,0.15)",
              borderRadius: 12, padding: "16px 24px",
              marginBottom: 32
            }}>
              <div style={{
                opacity: animateTip ? 0 : 1,
                transform: animateTip ? "translateY(-4px)" : "translateY(0)",
                transition: "all 0.3s ease",
                display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap"
              }}>
                <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>💡</span>
                <span style={{ fontSize: 11, color: "#7c6f8a", letterSpacing: "0.2em", textTransform: "uppercase", flexShrink: 0 }}>Prompt Tip of the Day · </span>
                <span style={{ fontSize: 14, color: "#c9d8e8", fontStyle: "italic" }}>{tips[tipIndex]}</span>
              </div>
            </div>

            {/* Weekly Grid */}
            {["This Week", "Next Week", "Upcoming"].map(weekLabel => {
              const weekSlots = schedule.filter(e => e.weekLabel === weekLabel);
              if (weekSlots.length === 0) return null;
              return (
                <div key={weekLabel} style={{ marginBottom: 36 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                    <span style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: weekLabel === "This Week" ? "#c9b8ff" : weekLabel === "Next Week" ? "#8fd3f4" : "#5a6a7a", fontWeight: 500 }}>{weekLabel}</span>
                    <div style={{ height: 1, flex: 1, background: "rgba(255,255,255,0.05)" }} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: gridCols, gap: 14 }}>
                    {weekSlots.map(entry => (
                      <div key={entry.key} onClick={() => { setSelectedCourse(entry.course); setActiveTab("curriculum"); }}
                        style={{
                          background: entry.isToday
                            ? "linear-gradient(135deg, rgba(201,184,255,0.12), rgba(143,211,244,0.08))"
                            : "rgba(255,255,255,0.02)",
                          border: entry.isToday ? "1px solid rgba(201,184,255,0.3)" : "1px solid rgba(255,255,255,0.05)",
                          borderRadius: 12, padding: 18, cursor: "pointer",
                          opacity: entry.isPast ? 0.45 : 1,
                          transition: "all 0.2s",
                          position: "relative", overflow: "hidden"
                        }}
                        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = entry.course.color + "55"; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = entry.isToday ? "rgba(201,184,255,0.3)" : "rgba(255,255,255,0.05)"; }}
                      >
                        {entry.isToday && (
                          <div style={{
                            position: "absolute", top: 10, right: 10,
                            background: "rgba(201,184,255,0.2)", borderRadius: 20,
                            padding: "2px 8px", fontSize: 9, color: "#c9b8ff", letterSpacing: "0.15em"
                          }}>TODAY</div>
                        )}
                        <div style={{ fontSize: 10, color: "#5a6a7a", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>
                          {entry.label} · {entry.date}
                        </div>
                        <div style={{ fontSize: 20, marginBottom: 8 }}>{entry.course.icon}</div>
                        <div style={{ fontSize: 13, color: "#d8d0e8", marginBottom: 6, lineHeight: 1.4, fontWeight: 500 }}>{entry.course.title}</div>
                        <div style={{
                          display: "inline-block", fontSize: 9, padding: "2px 7px",
                          borderRadius: 20, letterSpacing: "0.1em",
                          background: entry.course.color + "22", color: entry.course.color,
                          border: `1px solid ${entry.course.color}44`, marginBottom: 8
                        }}>
                          {entry.course.level}
                        </div>
                        <div style={{ fontSize: 11, color: "#6a7a8a" }}>
                          Focus: {entry.focusTopic}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* CURRICULUM TAB */}
        {activeTab === "curriculum" && (
          <div>
            {["Beginner", "Intermediate", "Advanced"].map(level => (
              <div key={level} style={{ marginBottom: 48 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                  <div style={{ height: 1, flex: 1, background: "rgba(255,255,255,0.06)" }} />
                  <span style={{
                    fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase",
                    color: level === "Beginner" ? "#4ade80" : level === "Intermediate" ? "#60a5fa" : "#f472b6",
                    padding: "4px 16px", border: `1px solid ${level === "Beginner" ? "#4ade8044" : level === "Intermediate" ? "#60a5fa44" : "#f472b644"}`,
                    borderRadius: 20
                  }}>{level}</span>
                  <div style={{ height: 1, flex: 1, background: "rgba(255,255,255,0.06)" }} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: gridCols, gap: 16 }}>
                  {COURSES.filter(c => c.level === level).map(course => {
                    const isSelected = selectedCourse?.id === course.id;
                    const isDone = completedCourses.has(course.id);
                    return (
                      <div key={course.id}
                        style={{
                          background: isSelected ? `linear-gradient(135deg, ${course.color}12, ${course.color}06)` : "rgba(255,255,255,0.02)",
                          border: `1px solid ${isSelected ? course.color + "55" : "rgba(255,255,255,0.06)"}`,
                          borderRadius: 14, padding: 24, cursor: "pointer",
                          transition: "all 0.2s", position: "relative"
                        }}
                        onClick={() => setSelectedCourse(isSelected ? null : course)}
                        onMouseEnter={e => !isSelected && (e.currentTarget.style.borderColor = course.color + "44")}
                        onMouseLeave={e => !isSelected && (e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)")}
                      >
                        {isDone && (
                          <div style={{ position: "absolute", top: 16, right: 16, fontSize: 16 }}>✅</div>
                        )}
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                          <span style={{ fontSize: 28 }}>{course.icon}</span>
                          <div>
                            <div style={{ fontSize: 15, color: "#d8d0e8", lineHeight: 1.3 }}>{course.title}</div>
                            <div style={{ fontSize: 11, color: "#5a6a7a", marginTop: 2 }}>{course.duration}</div>
                          </div>
                        </div>
                        <p style={{ fontSize: 13, color: "#7a8a9a", lineHeight: 1.6, margin: "0 0 16px", fontStyle: "italic" }}>{course.description}</p>

                        {isSelected && (
                          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 16, marginTop: 4 }}>
                            <div style={{ fontSize: 11, color: "#5a6a7a", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10 }}>Topics Covered</div>
                            {course.topics.map(t => (
                              <div key={t} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                                <div style={{ width: 4, height: 4, borderRadius: "50%", background: course.color, flexShrink: 0 }} />
                                <span style={{ fontSize: 13, color: "#9a8aaa" }}>{t}</span>
                              </div>
                            ))}
                            <div style={{ display: "flex", gap: 10, marginTop: 20 }} className="expand-buttons">
                              <a href={course.url} target="_blank" rel="noreferrer" style={{
                                background: course.color + "22", color: course.color,
                                border: `1px solid ${course.color}55`, borderRadius: 8,
                                padding: "8px 16px", fontSize: 12, textDecoration: "none",
                                letterSpacing: "0.05em", transition: "all 0.2s"
                              }}>
                                Open on Skilljar →
                              </a>
                              <button onClick={(e) => { e.stopPropagation(); toggleComplete(course.id); }} style={{
                                background: isDone ? "rgba(168,237,202,0.12)" : "rgba(255,255,255,0.04)",
                                color: isDone ? "#a8edca" : "#5a6a7a",
                                border: `1px solid ${isDone ? "#a8edca44" : "rgba(255,255,255,0.08)"}`,
                                borderRadius: 8, padding: "8px 16px", fontSize: 12, cursor: "pointer",
                                letterSpacing: "0.05em"
                              }}>
                                {isDone ? "Mark Incomplete" : "Mark Complete"}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TIPS TAB */}
        {activeTab === "tips" && (
          <div>
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: "#5a6a7a", fontWeight: 400, marginBottom: 8 }}>
                Prompt Engineering Tips
              </h2>
              <p style={{ color: "#5a6a7a", fontSize: 14, fontStyle: "italic" }}>
                Techniques to go beyond basic prompt engineering — the kind of knowledge that separates good outputs from exceptional ones.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16, marginBottom: 40 }} className="digest-grid-tips">
              {[
                { icon: "🧩", title: "Use XML Structure", tip: "Wrap different parts of your prompt in tags like <context>, <task>, <constraints>, and <output_format>. Claude is trained to respond better to structured inputs.", level: "Beginner" },
                { icon: "🎭", title: "Assign a Role", tip: "Start with 'You are a [specific expert]...' — this primes Claude's voice, depth, and approach before you even state the task.", level: "Beginner" },
                { icon: "💭", title: "Chain-of-Thought", tip: "Add 'Think step by step before answering' for complex reasoning tasks. This forces Claude to reason aloud, dramatically improving accuracy.", level: "Intermediate" },
                { icon: "📸", title: "Few-Shot Examples", tip: "Show Claude 2–3 examples of the exact input-output pairs you want. This is often more powerful than lengthy written instructions.", level: "Intermediate" },
                { icon: "🔁", title: "Iterative Refinement", tip: "Treat your first prompt as a hypothesis. Ask Claude to critique its own output, then refine. Often the 2nd or 3rd pass is dramatically better.", level: "Intermediate" },
                { icon: "🚫", title: "Use Negative Constraints", tip: "Tell Claude what NOT to do: 'Do not include caveats', 'Do not use bullet points', 'Do not hedge'. Negative constraints are underutilized.", level: "Beginner" },
                { icon: "🌡️", title: "Temperature & Creativity", tip: "When using the API, lower temperature (0.2–0.5) for factual or structured tasks; higher (0.7–1.0) for creative work. It changes the 'confidence' of outputs.", level: "Advanced" },
                { icon: "🔬", title: "Build Evals First", tip: "Before scaling any AI feature, define what 'good' looks like with 10–20 test cases. Intuition degrades; metrics don't.", level: "Advanced" },
                { icon: "🧪", title: "Red-Team Your Prompts", tip: "Try to break your own prompt — give it edge cases, unusual inputs, contradictory context. Robust prompts survive adversarial inputs.", level: "Advanced" },
              ].map((item, i) => (
                <div key={i} style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 12, padding: 22,
                  transition: "all 0.2s"
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(201,184,255,0.2)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <span style={{ fontSize: 24 }}>{item.icon}</span>
                    <div>
                      <div style={{ fontSize: 14, color: "#d8d0e8" }}>{item.title}</div>
                      <div style={{
                        fontSize: 10, padding: "1px 8px", borderRadius: 20, display: "inline-block", marginTop: 3,
                        background: item.level === "Beginner" ? "#4ade8022" : item.level === "Intermediate" ? "#60a5fa22" : "#f472b622",
                        color: item.level === "Beginner" ? "#4ade80" : item.level === "Intermediate" ? "#60a5fa" : "#f472b6",
                        letterSpacing: "0.1em"
                      }}>{item.level}</div>
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: "#7a8a9a", lineHeight: 1.7, margin: 0, fontStyle: "italic" }}>{item.tip}</p>
                </div>
              ))}
            </div>

            {/* Learning Path Callout */}
            <div style={{
              background: "linear-gradient(135deg, rgba(201,184,255,0.06), rgba(143,211,244,0.04))",
              border: "1px solid rgba(201,184,255,0.12)",
              borderRadius: 14, padding: 28
            }}>
              <div style={{ fontSize: 11, letterSpacing: "0.2em", color: "#7c6f8a", textTransform: "uppercase", marginBottom: 12 }}>Recommended Path for You</div>
              <p style={{ fontSize: 15, color: "#c9d8e8", lineHeight: 1.8, margin: "0 0 20px" }}>
                Since you already understand prompt engineering, your fastest path to mastery is:
              </p>
              {[
                "1. Master advanced prompting (chain-of-thought, XML tags, few-shot) — Week 1",
                "2. Learn the API to break free from the chat UI — Week 2",
                "3. Understand RAG to handle real documents and data — Week 3",
                "4. Explore tool use to make Claude genuinely autonomous — Week 4"
              ].map((step, i) => (
                <div key={i} style={{ fontSize: 13, color: "#8a9aaa", marginBottom: 10, display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#c9b8ff", marginTop: 6, flexShrink: 0 }} />
                  <span>{step}</span>
                </div>
              ))}
              <button onClick={() => setActiveTab("curriculum")} style={{
                marginTop: 16, background: "rgba(201,184,255,0.12)", color: "#c9b8ff",
                border: "1px solid rgba(201,184,255,0.25)", borderRadius: 8,
                padding: "10px 20px", fontSize: 12, cursor: "pointer", letterSpacing: "0.08em"
              }}>
                View Full Curriculum →
              </button>
            </div>
          </div>
        )}
        {/* LEARNING NOTES TAB */}
        {activeTab === "notes" && (
          <div>
            {/* Header row with Save button */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 32, gap: 16, flexWrap: "wrap" }}>
              <div>
                <h2 style={{ fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: "#5a6a7a", fontWeight: 500, margin: "0 0 8px" }}>
                  Learning Notes
                </h2>
                <p style={{ color: "#5a6a7a", fontSize: 14, margin: 0 }}>
                  Capture what you learn in each module. Notes auto-save as you type.
                </p>
              </div>

              {/* Save button */}
              <button
                onClick={() => {
                  try {
                    localStorage.setItem("ai_digest_notes", JSON.stringify(notes));
                    localStorage.setItem("ai_digest_images", JSON.stringify(noteImages));
                  } catch {}
                  setSavedAnim(true);
                  setTimeout(() => setSavedAnim(false), 2000);
                }}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "10px 20px", borderRadius: 8, cursor: "pointer",
                  fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500,
                  border: savedAnim ? "1px solid #a8edca88" : "1px solid rgba(201,184,255,0.3)",
                  background: savedAnim ? "rgba(168,237,202,0.12)" : "rgba(201,184,255,0.1)",
                  color: savedAnim ? "#a8edca" : "#c9b8ff",
                  transition: "all 0.4s ease",
                  whiteSpace: "nowrap",
                  flexShrink: 0
                }}
              >
                {savedAnim ? (
                  <>
                    <span style={{
                      display: "inline-block",
                      animation: "checkPop 0.35s ease",
                      fontSize: 15
                    }}>✓</span>
                    Saved
                  </>
                ) : (
                  <>
                    <span style={{ fontSize: 14 }}>💾</span>
                    Save Notes
                  </>
                )}
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {COURSES.map(course => {
                const isDone = completedCourses.has(course.id);
                const hasNote = notes[course.id]?.trim().length > 0 || (noteImages[course.id]?.length > 0);
                const isExpanded = expandedNotes[course.id];
                const wordCount = notes[course.id] ? notes[course.id].replace(/<[^>]+>/g, "").trim().split(/\s+/).filter(Boolean).length : 0;
                const toggleExpand = () => setExpandedNotes(prev => ({ ...prev, [course.id]: !prev[course.id] }));
                return (
                  <div key={course.id} style={{
                    background: "rgba(255,255,255,0.02)",
                    border: `1px solid ${hasNote ? course.color + "33" : "rgba(255,255,255,0.06)"}`,
                    borderRadius: 14,
                    overflow: "hidden",
                    transition: "border-color 0.3s"
                  }}>
                    {/* Module header — fully clickable to expand/collapse */}
                    <div
                      onClick={toggleExpand}
                      style={{
                        display: "flex", alignItems: "center", gap: 14,
                        padding: "16px 20px",
                        borderBottom: isExpanded ? "1px solid rgba(255,255,255,0.05)" : "none",
                        background: hasNote ? `linear-gradient(135deg, ${course.color}08, transparent)` : "transparent",
                        cursor: "pointer",
                        userSelect: "none"
                      }}
                    >
                      <span style={{ fontSize: 24, lineHeight: 1 }}>{course.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 14, fontWeight: 600, color: "#d8d0e8" }}>{course.title}</span>
                          <span style={{
                            fontSize: 10, padding: "2px 8px", borderRadius: 20,
                            background: course.color + "22", color: course.color,
                            border: `1px solid ${course.color}44`, letterSpacing: "0.1em"
                          }}>{course.level}</span>
                          {isDone && <span style={{ fontSize: 11, color: "#a8edca" }}>✅ Complete</span>}
                        </div>
                        <div style={{ fontSize: 11, color: "#5a6a7a", marginTop: 3 }}>{course.duration}</div>
                      </div>

                      {/* Word count + chevron */}
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                        {hasNote && (
                          <div style={{
                            fontSize: 10, color: course.color, letterSpacing: "0.1em",
                            background: course.color + "15", padding: "3px 10px",
                            borderRadius: 20, border: `1px solid ${course.color}33`,
                            whiteSpace: "nowrap"
                          }}>
                            {wordCount} {wordCount === 1 ? "word" : "words"}
                          </div>
                        )}
                        <div style={{
                          width: 24, height: 24, borderRadius: 6,
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          transition: "all 0.25s ease",
                          color: "#6a7a8a", fontSize: 11,
                          transform: isExpanded ? "rotate(0deg)" : "rotate(-90deg)"
                        }}>
                          ▾
                        </div>
                      </div>
                    </div>

                    {/* Collapsible editor body */}
                    <div style={{
                      display: isExpanded ? "block" : "none",
                      padding: "16px 20px"
                    }}>
                      <NoteEditor course={course} notes={notes} setNotes={setNotes} images={noteImages} setImages={setNoteImages} />
                    </div>
                  </div>
                );
              })}

              {/* --- Custom note: Optimizing Token Usage --- */}
              {(() => {
                const CUSTOM_ID = "custom_token_usage";
                const customNote = {
                  id: CUSTOM_ID,
                  title: "Optimizing Token Usage",
                  icon: "⚡",
                  color: "#f59e0b",
                  subtitle: "Personal notes — not tied to a module"
                };
                const hasNote = notes[CUSTOM_ID]?.trim().length > 0 || (noteImages[CUSTOM_ID]?.length > 0);
                const isExpanded = expandedNotes[CUSTOM_ID] !== false;
                const wordCount = notes[CUSTOM_ID] ? notes[CUSTOM_ID].replace(/<[^>]+>/g, "").trim().split(/\s+/).filter(Boolean).length : 0;
                const toggleExpand = () => setExpandedNotes(prev => ({ ...prev, [CUSTOM_ID]: !isExpanded }));
                return (
                  <div style={{
                    background: "rgba(255,255,255,0.02)",
                    border: `1px solid ${hasNote ? customNote.color + "33" : "rgba(255,255,255,0.06)"}`,
                    borderRadius: 14, overflow: "hidden", transition: "border-color 0.3s"
                  }}>
                    {/* Header */}
                    <div
                      onClick={toggleExpand}
                      style={{
                        display: "flex", alignItems: "center", gap: 14,
                        padding: "16px 20px",
                        borderBottom: isExpanded ? "1px solid rgba(255,255,255,0.05)" : "none",
                        background: hasNote ? `linear-gradient(135deg, ${customNote.color}08, transparent)` : "transparent",
                        cursor: "pointer", userSelect: "none"
                      }}
                    >
                      <span style={{ fontSize: 24, lineHeight: 1 }}>{customNote.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 14, fontWeight: 600, color: "#d8d0e8" }}>{customNote.title}</span>
                          <span style={{
                            fontSize: 10, padding: "2px 8px", borderRadius: 20,
                            background: customNote.color + "22", color: customNote.color,
                            border: `1px solid ${customNote.color}44`, letterSpacing: "0.1em"
                          }}>Custom</span>
                        </div>
                        <div style={{ fontSize: 11, color: "#5a6a7a", marginTop: 3 }}>{customNote.subtitle}</div>
                      </div>
                      {/* Word count + chevron */}
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                        {hasNote && (
                          <div style={{
                            fontSize: 10, color: customNote.color, letterSpacing: "0.1em",
                            background: customNote.color + "15", padding: "3px 10px",
                            borderRadius: 20, border: `1px solid ${customNote.color}33`, whiteSpace: "nowrap"
                          }}>
                            {wordCount} {wordCount === 1 ? "word" : "words"}
                          </div>
                        )}
                        <div style={{
                          width: 24, height: 24, borderRadius: 6,
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          transition: "transform 0.25s ease",
                          color: "#6a7a8a", fontSize: 11,
                          transform: isExpanded ? "rotate(0deg)" : "rotate(-90deg)"
                        }}>▾</div>
                      </div>
                    </div>
                    {/* Editor body */}
                    <div style={{ display: isExpanded ? "block" : "none", padding: "16px 20px" }}>
                      <NoteEditor
                        course={customNote}
                        notes={notes}
                        setNotes={setNotes}
                        images={noteImages}
                        setImages={setNoteImages}
                      />
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* PROMPT & PATTERN LIBRARY TAB */}
        {activeTab === "library" && (
          <PromptLibrary promptCards={promptCards} setPromptCards={setPromptCards} />
        )}

      </div>
    </div>
  );
}

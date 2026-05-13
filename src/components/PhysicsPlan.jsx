import { useState, useEffect } from 'react';
import { Youtube, ExternalLink, Download, ChevronDown, ChevronUp, CheckCircle2, Circle } from 'lucide-react';
import './PhysicsPlan.css';

// ─── DATA ───────────────────────────────────────────────────────────────────

const BLOCKS = [
    {
        id: 1,
        label: 'Block 1',
        duration: '3 Days',
        accentColor: '#007aff',
        chapters: [
            { name: 'Kinematics', url: 'https://youtube.com/playlist?list=PLjvx7xqdpePLItW_yyRSUfrzSqA5ezpqL' },
            { name: 'Gravitation', url: 'https://youtube.com/playlist?list=PLjvx7xqdpePJBciKC3lFr_d00mDQceq8s' },
            { name: 'Electrostatics', url: 'https://youtube.com/playlist?list=PLjvx7xqdpePL-IQ8QCmk5BpycShF0RaKO' },
            { name: 'Capacitor', url: 'https://youtube.com/playlist?list=PLjvx7xqdpePJyUSPmJSQK_M7W-Z-qN9iW' },
            { name: 'EM Waves', url: 'https://youtube.com/playlist?list=PLjvx7xqdpePJ3lHx7uc5dSi-JqmJweDSZ' },
        ],
    },
    {
        id: 2,
        label: 'Block 2',
        duration: '3 Days',
        accentColor: '#8b5cf6',
        chapters: [
            { name: 'Units Dimensions Errors & Vectors', url: 'https://youtube.com/playlist?list=PLjvx7xqdpePJ2frgR0Q6FwVllpWUxUo_Y' },
            { name: 'KTG & Thermodynamics', url: 'https://youtube.com/playlist?list=PLjvx7xqdpePL4PBaaFvkMbALzJP3DPFQM' },
            { name: 'Current Electricity', url: 'https://youtube.com/playlist?list=PLjvx7xqdpePJJNDrvHyZEdwu2uGohWaCU' },
            { name: 'Moving Charges & MEC', url: 'https://youtube.com/playlist?list=PLjvx7xqdpePL2mwAZqflTLYlAbvdLA8J4' },
            { name: 'Modern Physics', url: 'https://youtube.com/playlist?list=PLjvx7xqdpePL4vTqUUyIbtg5FubHYGNFr' },
        ],
    },
    {
        id: 3,
        label: 'Block 3',
        duration: '4 Days',
        accentColor: '#f97316',
        chapters: [
            { name: 'Laws of Motion', url: 'https://youtube.com/playlist?list=PLjvx7xqdpePIZbs8Yf8Pi34ek7MMmj9rb' },
            { name: 'WEP & Circular Motion', url: 'https://youtube.com/playlist?list=PLjvx7xqdpePIfZAomhvUbS0q8QF69SzQu' },
            { name: 'Solids', url: 'https://youtube.com/playlist?list=PLjvx7xqdpePL5iNvM26ZGPhVQJyHKBokr' },
            { name: 'Electromagnetic Induction', url: 'https://youtube.com/playlist?list=PLjvx7xqdpePKLweoAM4zkoZs02Ss6YKMR' },
            { name: 'Alternating Current', url: 'https://youtube.com/playlist?list=PLjvx7xqdpePLqHPbozt5lLpkHvhrzecop' },
            { name: 'Ray Optics', url: 'https://youtube.com/playlist?list=PLjvx7xqdpePKE_6kKSGES5qJtCz-kd_5d' },
            { name: 'Semiconductors', url: 'https://youtube.com/playlist?list=PLjvx7xqdpePLhZB09b59Df7ivOAwMiRuf' },
        ],
    },
    {
        id: 4,
        label: 'Block 4',
        duration: '4 Days',
        accentColor: '#22c55e',
        chapters: [
            { name: 'COM & Collision', url: 'https://youtube.com/playlist?list=PLjvx7xqdpePJVQvIDMa9inrxGWyi-Vnr2' },
            { name: 'Rotational Motion', url: 'https://youtube.com/playlist?list=PLjvx7xqdpePLNEB-VLtUhBnF5LZmoYapS' },
            { name: 'Thermal Properties & Heat Transfer', url: 'https://youtube.com/playlist?list=PLjvx7xqdpePJZ1hTpE-y-BKiwtdJFXLKF' },
            { name: 'SHM', url: 'https://youtube.com/playlist?list=PLjvx7xqdpePKJBO8-qr0Im7QmJ86vZ_Rm' },
            { name: 'Wave Motion', url: 'https://youtube.com/playlist?list=PLjvx7xqdpePIBAIo5trSIhWP7viOOI5oD' },
            { name: 'Wave Optics', url: 'https://youtube.com/playlist?list=PLjvx7xqdpePJ3lHx7uc5dSi-JqmJweDSZ' },
            { name: 'Fluid Mechanics', url: 'https://youtube.com/playlist?list=PLjvx7xqdpePL2VCkyQT1KsQ1lPt7qs8fj' },
        ],
    },
];

const RESOURCES = [
    { id: 1, name: '75 Repeated NTA Questions – P1', url: 'https://youtu.be/5gXt-_ZmPkY' },
    { id: 2, name: '75 Repeated NTA Questions – P2', url: 'https://youtu.be/FeSupFc8M8g' },
    { id: 3, name: 'Top 111Q', url: 'https://youtu.be/2srG5s9UZDM' },
    { id: 4, name: '30 Experiment Questions', url: 'https://youtu.be/WPOo4TH3L6E' },
    { id: 5, name: 'Formulae Marathon – Class 11th', url: 'https://youtube.com/live/oyL9yCpHxEU' },
    { id: 6, name: 'Formulae Marathon – Class 12th', url: 'https://youtube.com/live/tzI8crdu6RI' },
    { id: 7, name: 'NEET 2025 Full Solution', url: 'https://youtu.be/7AuVg3EhiHI' },
    { id: 8, name: 'Revision Series', url: 'https://youtube.com/playlist?list=PLjvx7xqdpePKxIdQQLk8gky4_H9hfYLdv' },
];

const EXPERIMENTS = [
    { id: 1, name: 'Vernier Calliper', url: 'https://youtu.be/pVoN045dV8I' },
    { id: 2, name: 'Screw Gauge', url: 'https://youtu.be/gYd2PtmZ0mw' },
    { id: 3, name: 'Sonometer', url: 'https://youtu.be/rmRTp12BhSU' },
    { id: 4, name: 'Resonance Tube', url: 'https://youtu.be/fB7pfJ77za8' },
    { id: 5, name: 'Galvanometer to Ammeter & Voltmeter', url: 'https://youtube.com/live/YfksXXBHd_A' },
    { id: 6, name: 'Half Deflection', url: 'https://youtu.be/e4-lCUyisNs' },
    { id: 7, name: 'Figure of Merit', url: 'https://youtu.be/SZuojYNFJ0Q' },
    { id: 8, name: 'Travelling Microscope', url: 'https://youtu.be/ca4Pv-R6lx8' },
    { id: 9, name: 'Potentiometer', url: 'https://youtu.be/bTHPOTLdagM' },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const lsGet = (key) => {
    try { return JSON.parse(localStorage.getItem(key)) ?? false; } catch { return false; }
};
const lsSet = (key, val) => {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
};

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

const BlockCard = ({ block }) => {
    const [expanded, setExpanded] = useState(true);
    const [checked, setChecked] = useState(() => {
        const init = {};
        block.chapters.forEach(ch => {
            init[ch.name] = lsGet(`physPlan_block${block.id}_${ch.name}`);
        });
        return init;
    });

    const toggle = (chName) => {
        const next = !checked[chName];
        setChecked(prev => ({ ...prev, [chName]: next }));
        lsSet(`physPlan_block${block.id}_${chName}`, next);
    };

    const doneCount = Object.values(checked).filter(Boolean).length;
    const total = block.chapters.length;
    const progressPct = Math.round((doneCount / total) * 100);

    return (
        <div className="pp-block-card" style={{ '--block-accent': block.accentColor }}>
            <button className="pp-block-header" onClick={() => setExpanded(e => !e)}>
                <div className="pp-block-header-left">
                    <span className="pp-block-label" style={{ color: block.accentColor }}>{block.label}</span>
                    <span className="pp-duration-badge" style={{ background: `${block.accentColor}18`, color: block.accentColor }}>
                        {block.duration}
                    </span>
                    <span className="pp-block-progress-text">{doneCount}/{total} done</span>
                </div>
                <div className="pp-block-header-right">
                    {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
            </button>

            {expanded && (
                <div className="pp-chapter-list">
                    {block.chapters.map((ch) => (
                        <div key={ch.name} className={`pp-chapter-row ${checked[ch.name] ? 'done' : ''}`}>
                            <button
                                className="pp-checkbox"
                                onClick={() => toggle(ch.name)}
                                aria-label={`Toggle ${ch.name}`}
                            >
                                {checked[ch.name]
                                    ? <CheckCircle2 size={20} color={block.accentColor} />
                                    : <Circle size={20} color="#c7c7cc" />}
                            </button>
                            <a
                                href={ch.url}
                                target="_blank"
                                rel="noreferrer"
                                className="pp-chapter-name"
                            >
                                {ch.name}
                            </a>
                            <a
                                href={ch.url}
                                target="_blank"
                                rel="noreferrer"
                                className="pp-yt-btn"
                                title="Open on YouTube"
                            >
                                <Youtube size={16} />
                            </a>
                        </div>
                    ))}
                </div>
            )}

            <div className="pp-block-progress-bar-wrap">
                <div
                    className="pp-block-progress-bar-fill"
                    style={{ width: `${progressPct}%`, background: block.accentColor }}
                />
            </div>
        </div>
    );
};

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

const PhysicsPlan = () => {
    const [resourceChecked, setResourceChecked] = useState(() => {
        const init = {};
        RESOURCES.forEach(r => { init[r.id] = lsGet(`physPlan_resource_${r.id}`); });
        return init;
    });

    const [expChecked, setExpChecked] = useState(() => {
        const init = {};
        EXPERIMENTS.forEach(e => { init[e.id] = lsGet(`physPlan_exp_${e.id}`); });
        return init;
    });

    const toggleResource = (id) => {
        const next = !resourceChecked[id];
        setResourceChecked(prev => ({ ...prev, [id]: next }));
        lsSet(`physPlan_resource_${id}`, next);
    };

    const toggleExp = (id) => {
        const next = !expChecked[id];
        setExpChecked(prev => ({ ...prev, [id]: next }));
        lsSet(`physPlan_exp_${id}`, next);
    };

    const resourceDone = Object.values(resourceChecked).filter(Boolean).length;
    const expDone = Object.values(expChecked).filter(Boolean).length;

    return (
        <div className="pp-page fade-in">
            {/* Page Title */}
            <div className="pp-page-header">
                <h1 className="pp-page-title">⚡ Physics 30-Day Revision Plan</h1>
                <p className="pp-page-subtitle">Eduniti · Block-wise revision with checkpoints</p>
            </div>

            {/* ── SECTION 1: BLOCKS ── */}
            <section className="pp-section">
                <h2 className="pp-section-title">Blocks</h2>
                <div className="pp-blocks-grid">
                    {BLOCKS.map(block => <BlockCard key={block.id} block={block} />)}
                </div>
            </section>

            {/* ── SECTION 2: RESOURCES ── */}
            <section className="pp-section">
                <div className="pp-section-header-row">
                    <h2 className="pp-section-title">Key Resources</h2>
                    <span className="pp-count-badge">{resourceDone} / {RESOURCES.length} done</span>
                </div>
                <div className="pp-resources-grid">
                    {RESOURCES.map(r => (
                        <div key={r.id} className={`pp-resource-card ${resourceChecked[r.id] ? 'done' : ''}`}>
                            <button
                                className="pp-checkbox"
                                onClick={() => toggleResource(r.id)}
                                aria-label={`Toggle ${r.name}`}
                            >
                                {resourceChecked[r.id]
                                    ? <CheckCircle2 size={20} color="#007aff" />
                                    : <Circle size={20} color="#c7c7cc" />}
                            </button>
                            <span className="pp-resource-num">{r.id}</span>
                            <span className="pp-resource-name">{r.name}</span>
                            <a href={r.url} target="_blank" rel="noreferrer" className="pp-open-btn">
                                <ExternalLink size={14} />
                                Open
                            </a>
                        </div>
                    ))}
                </div>
                <a
                    href="https://drive.google.com/drive/folders/1I2TsfXwPIqA5t7JHV7JKeoJ50nGIA4IK"
                    target="_blank"
                    rel="noreferrer"
                    className="pp-download-btn"
                >
                    <Download size={18} />
                    Download All PDFs (PYQs + Non-PYQs)
                </a>
            </section>

            {/* ── SECTION 3: EXPERIMENTS ── */}
            <section className="pp-section">
                <div className="pp-section-header-row">
                    <h2 className="pp-section-title">Experiments &amp; Instruments</h2>
                    <span className="pp-count-badge">{expDone} / {EXPERIMENTS.length} done</span>
                </div>
                <div className="pp-exp-list">
                    {EXPERIMENTS.map(exp => (
                        <div key={exp.id} className={`pp-exp-row ${expChecked[exp.id] ? 'done' : ''}`}>
                            <button
                                className="pp-checkbox"
                                onClick={() => toggleExp(exp.id)}
                                aria-label={`Toggle ${exp.name}`}
                            >
                                {expChecked[exp.id]
                                    ? <CheckCircle2 size={20} color="#007aff" />
                                    : <Circle size={20} color="#c7c7cc" />}
                            </button>
                            <span className="pp-exp-num">{exp.id}</span>
                            <span className="pp-exp-name">{exp.name}</span>
                            <a href={exp.url} target="_blank" rel="noreferrer" className="pp-open-btn">
                                <ExternalLink size={14} />
                                Open
                            </a>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default PhysicsPlan;

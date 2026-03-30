/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock, ShieldCheck, LogOut, ArrowRight, CheckCircle2, XCircle, Menu,
  Users, Vote, Archive, FileText, Bell, Info, BookOpen, History,
  Megaphone, Plus, Trash2, ChevronRight,
} from 'lucide-react';

type AdminTab =
  | 'candidates'
  | 'elections'
  | 'past_results'
  | 'documents'
  | 'notices'
  | 'about'
  | 'councilor_roles'
  | 'records'
  | 'announcements';

const TABS: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
  { id: 'candidates', label: 'Candidates', icon: <Users className="w-4 h-4" /> },
  { id: 'elections', label: 'Elections', icon: <Vote className="w-4 h-4" /> },
  { id: 'past_results', label: 'Past Results', icon: <Archive className="w-4 h-4" /> },
  { id: 'documents', label: 'Documents', icon: <FileText className="w-4 h-4" /> },
  { id: 'notices', label: 'Notices', icon: <Bell className="w-4 h-4" /> },
  { id: 'about', label: 'About GEO', icon: <Info className="w-4 h-4" /> },
  { id: 'councilor_roles', label: 'Councilor Roles', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'records', label: 'Records', icon: <History className="w-4 h-4" /> },
  { id: 'announcements', label: 'Announcements', icon: <Megaphone className="w-4 h-4" /> },
];

// ─── Reusable form helpers ──────────────────────────────────
function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">
        {label} {required && <span className="text-guild-red">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputClass = "w-full p-3 bg-gray-900/50 border-2 border-gray-700 text-white rounded-xl focus:ring-4 focus:ring-guild-yellow/20 focus:border-guild-yellow transition-all font-medium text-sm";
const textareaClass = `${inputClass} resize-none`;
const selectClass = inputClass;

// ─── Submit helper ──────────────────────────────────────────
async function submitForm(type: string, payload: Record<string, unknown>): Promise<boolean> {
  try {
    const response = await fetch('/api/admin/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, ...payload }),
    });
    return response.ok;
  } catch {
    return false;
  }
}

// ─── Success/Error Banners ──────────────────────────────────
function StatusBanner({ status, successMsg }: { status: 'idle' | 'success' | 'error'; successMsg?: string }) {
  return (
    <AnimatePresence>
      {status === 'success' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="p-4 bg-green-900/30 border border-green-800/50 text-green-400 rounded-xl flex items-center"
        >
          <CheckCircle2 className="w-5 h-5 mr-2 shrink-0" />
          <span className="font-bold text-sm">{successMsg || 'Submitted successfully!'}</span>
        </motion.div>
      )}
      {status === 'error' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="p-4 bg-red-900/30 border border-red-800/50 text-red-400 rounded-xl flex items-center"
        >
          <XCircle className="w-5 h-5 mr-2 shrink-0" />
          <span className="font-bold text-sm">Submission failed. Please try again.</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ═══════════════════════════════════════════════════════════
// SECTION: Candidates Form
// ═══════════════════════════════════════════════════════════
function CandidatesSection() {
  const [formData, setFormData] = useState({ name: '', position: '', keyPoints: '', instagram: '', twitter: '', facebook: '' });
  const [urls, setUrls] = useState({ headshotUrl: '', manifestoUrl: '', videoUrl: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('idle');
    const ok = await submitForm('candidate', { ...formData, ...urls });
    setStatus(ok ? 'success' : 'error');
    if (ok) {
      setFormData({ name: '', position: '', keyPoints: '', instagram: '', twitter: '', facebook: '' });
      setUrls({ headshotUrl: '', manifestoUrl: '', videoUrl: '' });
      setTimeout(() => setStatus('idle'), 5000);
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1 font-serif">Add Candidate</h2>
        <p className="text-gray-400 text-sm">Submit a new candidate profile to the election portal.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Full Name" required>
          <input required type="text" name="name" value={formData.name} onChange={handleChange} className={inputClass} placeholder="e.g., Jane Doe" />
        </FormField>
        <FormField label="Position" required>
          <input required type="text" name="position" value={formData.position} onChange={handleChange} className={inputClass} placeholder="e.g., President" />
        </FormField>
      </div>

      <FormField label="Key Points (separate with |)" required>
        <textarea required name="keyPoints" value={formData.keyPoints} onChange={handleChange} rows={3} className={textareaClass} placeholder="Focus on student welfare | Improve campus facilities | Transparent governance" />
      </FormField>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormField label="Instagram URL">
          <input type="url" name="instagram" value={formData.instagram} onChange={handleChange} className={inputClass} placeholder="https://instagram.com/..." />
        </FormField>
        <FormField label="Twitter URL">
          <input type="url" name="twitter" value={formData.twitter} onChange={handleChange} className={inputClass} placeholder="https://twitter.com/..." />
        </FormField>
        <FormField label="Facebook URL">
          <input type="url" name="facebook" value={formData.facebook} onChange={handleChange} className={inputClass} placeholder="https://facebook.com/..." />
        </FormField>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <FileUpload label="Official Headshot" accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }} onUploadSuccess={(url) => setUrls(p => ({ ...p, headshotUrl: url }))} />
        <FileUpload label="Manifesto (PDF)" accept={{ 'application/pdf': ['.pdf'] }} onUploadSuccess={(url) => setUrls(p => ({ ...p, manifestoUrl: url }))} />
        <FileUpload label="Campaign Video" accept={{ 'video/*': ['.mp4', '.mov', '.webm'] }} onUploadSuccess={(url) => setUrls(p => ({ ...p, videoUrl: url }))} />
      </div>

      {/* Asset preview */}
      {(urls.headshotUrl || urls.manifestoUrl || urls.videoUrl) && (
        <div className="overflow-x-auto rounded-xl border border-gray-700">
          <table className="w-full text-left text-sm">
            <thead><tr className="border-b border-gray-700 text-gray-400 uppercase tracking-wider text-xs">
              <th className="p-3">Preview</th><th className="p-3">Type</th><th className="p-3">URL</th><th className="p-3 text-right">Action</th>
            </tr></thead>
            <tbody>
              {urls.headshotUrl && (
                <tr className="border-b border-gray-800">
                  <td className="p-3"><div className="w-10 h-10 rounded-lg bg-gray-800 overflow-hidden"><img src={urls.headshotUrl} alt="Headshot" className="object-cover w-full h-full" /></div></td>
                  <td className="p-3 text-gray-300">Headshot</td>
                  <td className="p-3 text-gray-500 truncate max-w-[150px]">{urls.headshotUrl}</td>
                  <td className="p-3 text-right"><button type="button" onClick={() => setUrls(p => ({ ...p, headshotUrl: '' }))} className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button></td>
                </tr>
              )}
              {urls.manifestoUrl && (
                <tr className="border-b border-gray-800">
                  <td className="p-3"><div className="w-10 h-10 rounded-lg bg-red-900/30 flex items-center justify-center text-guild-red font-bold text-xs border border-red-800/50">PDF</div></td>
                  <td className="p-3 text-gray-300">Manifesto</td>
                  <td className="p-3 text-gray-500 truncate max-w-[150px]">{urls.manifestoUrl}</td>
                  <td className="p-3 text-right"><button type="button" onClick={() => setUrls(p => ({ ...p, manifestoUrl: '' }))} className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button></td>
                </tr>
              )}
              {urls.videoUrl && (
                <tr className="border-b border-gray-800">
                  <td className="p-3"><div className="w-10 h-10 rounded-lg bg-blue-900/30 flex items-center justify-center text-blue-400 font-bold text-xs border border-blue-800/50">VID</div></td>
                  <td className="p-3 text-gray-300">Video</td>
                  <td className="p-3 text-gray-500 truncate max-w-[150px]">{urls.videoUrl}</td>
                  <td className="p-3 text-right"><button type="button" onClick={() => setUrls(p => ({ ...p, videoUrl: '' }))} className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <StatusBanner status={status} successMsg="Candidate profile deployed successfully!" />

      <button type="submit" disabled={isSubmitting || !urls.headshotUrl} className={`w-full p-4 rounded-xl font-bold text-white transition-all flex justify-center items-center ${isSubmitting || !urls.headshotUrl ? 'bg-gray-700 cursor-not-allowed text-gray-400' : 'bg-gradient-to-r from-guild-red to-red-800 hover:shadow-lg hover:shadow-red-500/30'}`}>
        {isSubmitting ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" /> Deploying...</> : 'Deploy Candidate Profile'}
      </button>
      {!urls.headshotUrl && <p className="text-xs text-center text-red-400 font-medium">* Headshot is required before deployment</p>}
    </form>
  );
}

// ═══════════════════════════════════════════════════════════
// SECTION: Elections Form
// ═══════════════════════════════════════════════════════════
function ElectionsSection() {
  const [form, setForm] = useState({ title: '', year: '', electionType: '', status: 'upcoming', description: '', votingDate: '', nominationStart: '', nominationEnd: '', campaignStart: '', campaignEnd: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const ok = await submitForm('election', form);
    setStatus(ok ? 'success' : 'error');
    if (ok) { setForm({ title: '', year: '', electionType: '', status: 'upcoming', description: '', votingDate: '', nominationStart: '', nominationEnd: '', campaignStart: '', campaignEnd: '' }); setTimeout(() => setStatus('idle'), 5000); }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1 font-serif">Manage Election</h2>
        <p className="text-gray-400 text-sm">Create or configure an election cycle.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormField label="Election Title" required>
          <input required name="title" value={form.title} onChange={handleChange} className={inputClass} placeholder="e.g., Presidential Elections 2026" />
        </FormField>
        <FormField label="Year" required>
          <input required name="year" value={form.year} onChange={handleChange} className={inputClass} placeholder="2026" />
        </FormField>
        <FormField label="Type" required>
          <input required name="electionType" value={form.electionType} onChange={handleChange} className={inputClass} placeholder="e.g., General Election" />
        </FormField>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Status" required>
          <select required name="status" value={form.status} onChange={handleChange} className={selectClass}>
            <option value="upcoming">Upcoming</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </FormField>
        <FormField label="Voting Date" required>
          <input required name="votingDate" value={form.votingDate} onChange={handleChange} className={inputClass} placeholder="e.g., 9th April 2026" />
        </FormField>
      </div>

      <FormField label="Description">
        <textarea name="description" value={form.description} onChange={handleChange} rows={3} className={textareaClass} placeholder="Brief description of this election..." />
      </FormField>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Nomination Start">
          <input name="nominationStart" value={form.nominationStart} onChange={handleChange} className={inputClass} placeholder="e.g., 16th March 2026" />
        </FormField>
        <FormField label="Nomination End">
          <input name="nominationEnd" value={form.nominationEnd} onChange={handleChange} className={inputClass} placeholder="e.g., 18th March 2026" />
        </FormField>
        <FormField label="Campaign Start">
          <input name="campaignStart" value={form.campaignStart} onChange={handleChange} className={inputClass} placeholder="e.g., 30th March 2026" />
        </FormField>
        <FormField label="Campaign End">
          <input name="campaignEnd" value={form.campaignEnd} onChange={handleChange} className={inputClass} placeholder="e.g., 8th April 2026" />
        </FormField>
      </div>

      <StatusBanner status={status} successMsg="Election configuration saved!" />
      <button type="submit" disabled={isSubmitting} className={`w-full p-4 rounded-xl font-bold text-white transition-all ${isSubmitting ? 'bg-gray-700 cursor-not-allowed text-gray-400' : 'bg-gradient-to-r from-guild-red to-red-800 hover:shadow-lg hover:shadow-red-500/30'}`}>
        {isSubmitting ? 'Saving...' : 'Save Election'}
      </button>
    </form>
  );
}

// ═══════════════════════════════════════════════════════════
// SECTION: Past Results Form
// ═══════════════════════════════════════════════════════════
function PastResultsSection() {
  const [entries, setEntries] = useState([{ year: '', position: '', candidateName: '', votes: '', isWinner: 'no', voterTurnout: '', totalEligible: '' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const addEntry = () => setEntries(prev => [...prev, { year: '', position: '', candidateName: '', votes: '', isWinner: 'no', voterTurnout: '', totalEligible: '' }]);
  const removeEntry = (i: number) => setEntries(prev => prev.filter((_, idx) => idx !== i));
  const updateEntry = (i: number, field: string, value: string) => setEntries(prev => prev.map((e, idx) => idx === i ? { ...e, [field]: value } : e));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    let allOk = true;
    for (const entry of entries) {
      const ok = await submitForm('past_result', entry);
      if (!ok) allOk = false;
    }
    setStatus(allOk ? 'success' : 'error');
    if (allOk) { setEntries([{ year: '', position: '', candidateName: '', votes: '', isWinner: 'no', voterTurnout: '', totalEligible: '' }]); setTimeout(() => setStatus('idle'), 5000); }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1 font-serif">Past Election Results</h2>
        <p className="text-gray-400 text-sm">Add historical election data. Add multiple candidates per submission.</p>
      </div>

      {entries.map((entry, i) => (
        <div key={i} className="p-6 border border-gray-700 rounded-xl space-y-4 relative">
          {entries.length > 1 && (
            <button type="button" onClick={() => removeEntry(i)} className="absolute top-3 right-3 text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button>
          )}
          <p className="text-sm font-bold text-guild-yellow">Entry {i + 1}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <FormField label="Year" required><input required value={entry.year} onChange={e => updateEntry(i, 'year', e.target.value)} className={inputClass} placeholder="2025" /></FormField>
            <FormField label="Position" required><input required value={entry.position} onChange={e => updateEntry(i, 'position', e.target.value)} className={inputClass} placeholder="President" /></FormField>
            <FormField label="Candidate" required><input required value={entry.candidateName} onChange={e => updateEntry(i, 'candidateName', e.target.value)} className={inputClass} placeholder="John Smith" /></FormField>
            <FormField label="Votes"><input value={entry.votes} onChange={e => updateEntry(i, 'votes', e.target.value)} className={inputClass} placeholder="350" /></FormField>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <FormField label="Winner?">
              <select value={entry.isWinner} onChange={e => updateEntry(i, 'isWinner', e.target.value)} className={selectClass}>
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </FormField>
            <FormField label="Voter Turnout %"><input value={entry.voterTurnout} onChange={e => updateEntry(i, 'voterTurnout', e.target.value)} className={inputClass} placeholder="65%" /></FormField>
            <FormField label="Total Eligible"><input value={entry.totalEligible} onChange={e => updateEntry(i, 'totalEligible', e.target.value)} className={inputClass} placeholder="1200" /></FormField>
          </div>
        </div>
      ))}

      <button type="button" onClick={addEntry} className="flex items-center text-sm text-guild-yellow hover:text-yellow-300 font-bold transition-colors">
        <Plus className="w-4 h-4 mr-1" /> Add Another Entry
      </button>

      <StatusBanner status={status} successMsg="Past election results saved!" />
      <button type="submit" disabled={isSubmitting} className={`w-full p-4 rounded-xl font-bold text-white transition-all ${isSubmitting ? 'bg-gray-700 cursor-not-allowed text-gray-400' : 'bg-gradient-to-r from-guild-red to-red-800 hover:shadow-lg hover:shadow-red-500/30'}`}>
        {isSubmitting ? 'Saving...' : 'Save Results'}
      </button>
    </form>
  );
}

// ═══════════════════════════════════════════════════════════
// SECTION: Documents Form
// ═══════════════════════════════════════════════════════════
function DocumentsSection() {
  const [form, setForm] = useState({ title: '', category: '', description: '', dateAdded: '' });
  const [fileUrl, setFileUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const ok = await submitForm('document', { ...form, fileUrl });
    setStatus(ok ? 'success' : 'error');
    if (ok) { setForm({ title: '', category: '', description: '', dateAdded: '' }); setFileUrl(''); setTimeout(() => setStatus('idle'), 5000); }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1 font-serif">Upload Document</h2>
        <p className="text-gray-400 text-sm">Add official documents such as the Electoral Code, nomination forms, guidelines, and rulings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Document Title" required>
          <input required name="title" value={form.title} onChange={handleChange} className={inputClass} placeholder="e.g., Electoral Code 2026" />
        </FormField>
        <FormField label="Category" required>
          <select required name="category" value={form.category} onChange={handleChange} className={selectClass}>
            <option value="">Select category...</option>
            <option value="Electoral Code">Electoral Code</option>
            <option value="Nomination Forms">Nomination Forms</option>
            <option value="Guidelines">Guidelines</option>
            <option value="Rulings">Rulings</option>
            <option value="Public Advisories">Public Advisories</option>
            <option value="Other">Other</option>
          </select>
        </FormField>
      </div>

      <FormField label="Description">
        <textarea name="description" value={form.description} onChange={handleChange} rows={2} className={textareaClass} placeholder="Brief description of this document..." />
      </FormField>

      <FormField label="Date Added">
        <input name="dateAdded" value={form.dateAdded} onChange={handleChange} className={inputClass} placeholder="e.g., March 2026" />
      </FormField>

      <FileUpload
        label="Document File"
        accept={{ 'application/pdf': ['.pdf'], 'image/*': ['.png', '.jpg', '.jpeg'], 'application/msword': ['.doc', '.docx'] }}
        onUploadSuccess={(url) => setFileUrl(url)}
      />
      {fileUrl && <p className="text-xs text-green-400 truncate">Uploaded: {fileUrl}</p>}

      <StatusBanner status={status} successMsg="Document uploaded successfully!" />
      <button type="submit" disabled={isSubmitting || !fileUrl} className={`w-full p-4 rounded-xl font-bold text-white transition-all ${isSubmitting || !fileUrl ? 'bg-gray-700 cursor-not-allowed text-gray-400' : 'bg-gradient-to-r from-guild-red to-red-800 hover:shadow-lg hover:shadow-red-500/30'}`}>
        {isSubmitting ? 'Uploading...' : 'Publish Document'}
      </button>
    </form>
  );
}

// ═══════════════════════════════════════════════════════════
// SECTION: Notices Form
// ═══════════════════════════════════════════════════════════
function NoticesSection() {
  const [form, setForm] = useState({ title: '', content: '', date: '', noticeType: 'announcement', isActive: 'yes' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const ok = await submitForm('notice', form);
    setStatus(ok ? 'success' : 'error');
    if (ok) { setForm({ title: '', content: '', date: '', noticeType: 'announcement', isActive: 'yes' }); setTimeout(() => setStatus('idle'), 5000); }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1 font-serif">Post Notice</h2>
        <p className="text-gray-400 text-sm">Publish official notices, advisories, and announcements.</p>
      </div>

      <FormField label="Notice Title" required>
        <input required name="title" value={form.title} onChange={handleChange} className={inputClass} placeholder="e.g., Nomination Period Extended" />
      </FormField>

      <FormField label="Content" required>
        <textarea required name="content" value={form.content} onChange={handleChange} rows={5} className={textareaClass} placeholder="Full notice content..." />
      </FormField>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormField label="Date">
          <input name="date" value={form.date} onChange={handleChange} className={inputClass} placeholder="e.g., March 30, 2026" />
        </FormField>
        <FormField label="Type">
          <select name="noticeType" value={form.noticeType} onChange={handleChange} className={selectClass}>
            <option value="announcement">Announcement</option>
            <option value="advisory">Advisory</option>
            <option value="ruling">Ruling</option>
            <option value="urgent">Urgent</option>
          </select>
        </FormField>
        <FormField label="Active?">
          <select name="isActive" value={form.isActive} onChange={handleChange} className={selectClass}>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </FormField>
      </div>

      <StatusBanner status={status} successMsg="Notice published!" />
      <button type="submit" disabled={isSubmitting} className={`w-full p-4 rounded-xl font-bold text-white transition-all ${isSubmitting ? 'bg-gray-700 cursor-not-allowed text-gray-400' : 'bg-gradient-to-r from-guild-red to-red-800 hover:shadow-lg hover:shadow-red-500/30'}`}>
        {isSubmitting ? 'Publishing...' : 'Publish Notice'}
      </button>
    </form>
  );
}

// ═══════════════════════════════════════════════════════════
// SECTION: About GEO Form
// ═══════════════════════════════════════════════════════════
function AboutSection() {
  const [form, setForm] = useState({ sectionTitle: '', content: '', order: '0', iconName: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const ok = await submitForm('about_section', form);
    setStatus(ok ? 'success' : 'error');
    if (ok) { setForm({ sectionTitle: '', content: '', order: '0', iconName: '' }); setTimeout(() => setStatus('idle'), 5000); }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1 font-serif">About GEO Content</h2>
        <p className="text-gray-400 text-sm">Add or update sections on the About page (mandate, role, structure, responsibilities).</p>
      </div>

      <FormField label="Section Title" required>
        <input required name="sectionTitle" value={form.sectionTitle} onChange={handleChange} className={inputClass} placeholder="e.g., Our Mandate" />
      </FormField>

      <FormField label="Content" required>
        <textarea required name="content" value={form.content} onChange={handleChange} rows={6} className={textareaClass} placeholder="Section content... Use | to separate bullet points if needed." />
      </FormField>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Display Order">
          <input name="order" type="number" value={form.order} onChange={handleChange} className={inputClass} placeholder="0" />
        </FormField>
        <FormField label="Icon Name (optional)">
          <input name="iconName" value={form.iconName} onChange={handleChange} className={inputClass} placeholder="e.g., Shield, BookOpen, Scale" />
        </FormField>
      </div>

      <StatusBanner status={status} successMsg="About section saved!" />
      <button type="submit" disabled={isSubmitting} className={`w-full p-4 rounded-xl font-bold text-white transition-all ${isSubmitting ? 'bg-gray-700 cursor-not-allowed text-gray-400' : 'bg-gradient-to-r from-guild-red to-red-800 hover:shadow-lg hover:shadow-red-500/30'}`}>
        {isSubmitting ? 'Saving...' : 'Save Section'}
      </button>
    </form>
  );
}

// ═══════════════════════════════════════════════════════════
// SECTION: Councilor Roles Form
// ═══════════════════════════════════════════════════════════
function CouncilorRolesSection() {
  const [form, setForm] = useState({ position: '', constitutionalDuties: '', additionalExpectations: '', candidateGuidance: '', order: '0' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const ok = await submitForm('councilor_role', form);
    setStatus(ok ? 'success' : 'error');
    if (ok) { setForm({ position: '', constitutionalDuties: '', additionalExpectations: '', candidateGuidance: '', order: '0' }); setTimeout(() => setStatus('idle'), 5000); }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1 font-serif">Councilor Role</h2>
        <p className="text-gray-400 text-sm">Define a councilor position, its duties, expectations, and guidance for prospective candidates.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Position Title" required>
          <input required name="position" value={form.position} onChange={handleChange} className={inputClass} placeholder="e.g., Guild President" />
        </FormField>
        <FormField label="Display Order">
          <input name="order" type="number" value={form.order} onChange={handleChange} className={inputClass} placeholder="0" />
        </FormField>
      </div>

      <FormField label="Constitutional Duties (separate with |)" required>
        <textarea required name="constitutionalDuties" value={form.constitutionalDuties} onChange={handleChange} rows={4} className={textareaClass} placeholder="Chair Guild meetings | Represent students at University Council | Oversee Guild budget" />
      </FormField>

      <FormField label="Additional Expectations (separate with |)">
        <textarea name="additionalExpectations" value={form.additionalExpectations} onChange={handleChange} rows={4} className={textareaClass} placeholder="Be available for student consultations | Attend all major campus events | Maintain social media presence" />
      </FormField>

      <FormField label="Guidance for Candidates">
        <textarea name="candidateGuidance" value={form.candidateGuidance} onChange={handleChange} rows={4} className={textareaClass} placeholder="Candidates should have strong leadership experience and a clear understanding of the Guild's constitution..." />
      </FormField>

      <StatusBanner status={status} successMsg="Councilor role saved!" />
      <button type="submit" disabled={isSubmitting} className={`w-full p-4 rounded-xl font-bold text-white transition-all ${isSubmitting ? 'bg-gray-700 cursor-not-allowed text-gray-400' : 'bg-gradient-to-r from-guild-red to-red-800 hover:shadow-lg hover:shadow-red-500/30'}`}>
        {isSubmitting ? 'Saving...' : 'Save Role'}
      </button>
    </form>
  );
}

// ═══════════════════════════════════════════════════════════
// SECTION: Records / Officials Form
// ═══════════════════════════════════════════════════════════
function RecordsSection() {
  const [form, setForm] = useState({ name: '', role: '', yearStart: '', yearEnd: '', officialType: 'geo_official' });
  const [photoUrl, setPhotoUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const ok = await submitForm('official', { ...form, photoUrl });
    setStatus(ok ? 'success' : 'error');
    if (ok) { setForm({ name: '', role: '', yearStart: '', yearEnd: '', officialType: 'geo_official' }); setPhotoUrl(''); setTimeout(() => setStatus('idle'), 5000); }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1 font-serif">Add Official / Record</h2>
        <p className="text-gray-400 text-sm">Record past Returning Officers, GEO officials, and former elected or appointed Councilors.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Full Name" required>
          <input required name="name" value={form.name} onChange={handleChange} className={inputClass} placeholder="e.g., Dr. Catherine Smith" />
        </FormField>
        <FormField label="Role / Position" required>
          <input required name="role" value={form.role} onChange={handleChange} className={inputClass} placeholder="e.g., Returning Officer" />
        </FormField>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormField label="Year Start" required>
          <input required name="yearStart" value={form.yearStart} onChange={handleChange} className={inputClass} placeholder="2023" />
        </FormField>
        <FormField label="Year End">
          <input name="yearEnd" value={form.yearEnd} onChange={handleChange} className={inputClass} placeholder="2024 (or leave blank if current)" />
        </FormField>
        <FormField label="Type" required>
          <select required name="officialType" value={form.officialType} onChange={handleChange} className={selectClass}>
            <option value="returning_officer">Returning Officer</option>
            <option value="geo_official">GEO Official</option>
            <option value="councilor">Councilor (Elected/Appointed)</option>
          </select>
        </FormField>
      </div>

      <FileUpload
        label="Photo (optional)"
        accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }}
        onUploadSuccess={(url) => setPhotoUrl(url)}
      />

      <StatusBanner status={status} successMsg="Record saved successfully!" />
      <button type="submit" disabled={isSubmitting} className={`w-full p-4 rounded-xl font-bold text-white transition-all ${isSubmitting ? 'bg-gray-700 cursor-not-allowed text-gray-400' : 'bg-gradient-to-r from-guild-red to-red-800 hover:shadow-lg hover:shadow-red-500/30'}`}>
        {isSubmitting ? 'Saving...' : 'Save Record'}
      </button>
    </form>
  );
}

// ═══════════════════════════════════════════════════════════
// SECTION: Announcements Form
// ═══════════════════════════════════════════════════════════
function AnnouncementsSection() {
  const [form, setForm] = useState({ title: '', content: '', date: '', priority: 'medium', isActive: 'yes' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const ok = await submitForm('announcement', form);
    setStatus(ok ? 'success' : 'error');
    if (ok) { setForm({ title: '', content: '', date: '', priority: 'medium', isActive: 'yes' }); setTimeout(() => setStatus('idle'), 5000); }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1 font-serif">Real-Time Announcement</h2>
        <p className="text-gray-400 text-sm">Post live updates that appear on the Elections page and homepage during the election period.</p>
      </div>

      <FormField label="Title" required>
        <input required name="title" value={form.title} onChange={handleChange} className={inputClass} placeholder="e.g., Polling Stations Now Open" />
      </FormField>

      <FormField label="Content" required>
        <textarea required name="content" value={form.content} onChange={handleChange} rows={4} className={textareaClass} placeholder="Announcement details..." />
      </FormField>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormField label="Date">
          <input name="date" value={form.date} onChange={handleChange} className={inputClass} placeholder="e.g., March 30, 2026" />
        </FormField>
        <FormField label="Priority">
          <select name="priority" value={form.priority} onChange={handleChange} className={selectClass}>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </FormField>
        <FormField label="Active?">
          <select name="isActive" value={form.isActive} onChange={handleChange} className={selectClass}>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </FormField>
      </div>

      <StatusBanner status={status} successMsg="Announcement published!" />
      <button type="submit" disabled={isSubmitting} className={`w-full p-4 rounded-xl font-bold text-white transition-all ${isSubmitting ? 'bg-gray-700 cursor-not-allowed text-gray-400' : 'bg-gradient-to-r from-guild-red to-red-800 hover:shadow-lg hover:shadow-red-500/30'}`}>
        {isSubmitting ? 'Publishing...' : 'Publish Announcement'}
      </button>
    </form>
  );
}

// ═══════════════════════════════════════════════════════════
// TAB CONTENT RENDERER
// ═══════════════════════════════════════════════════════════
function TabContent({ tab }: { tab: AdminTab }) {
  switch (tab) {
    case 'candidates': return <CandidatesSection />;
    case 'elections': return <ElectionsSection />;
    case 'past_results': return <PastResultsSection />;
    case 'documents': return <DocumentsSection />;
    case 'notices': return <NoticesSection />;
    case 'about': return <AboutSection />;
    case 'councilor_roles': return <CouncilorRolesSection />;
    case 'records': return <RecordsSection />;
    case 'announcements': return <AnnouncementsSection />;
  }
}

// ═══════════════════════════════════════════════════════════
// MAIN ADMIN PORTAL
// ═══════════════════════════════════════════════════════════
export default function AdminPortal() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>('candidates');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError(false);
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      if (data.authenticated) {
        setIsAuthenticated(true);
      } else {
        setLoginError(true);
        setTimeout(() => setLoginError(false), 3000);
      }
    } catch {
      setLoginError(true);
      setTimeout(() => setLoginError(false), 3000);
    } finally {
      setIsLoggingIn(false);
    }
  };

  // ─── Login Screen ────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="glass-dark rounded-3xl p-10 shadow-2xl w-full max-w-md relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-guild-red to-guild-yellow"></div>

          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mb-4 shadow-inner border border-red-800/50">
              <Lock className="w-8 h-8 text-guild-red" />
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight font-serif">Admin Gateway</h1>
            <p className="text-gray-400 text-sm mt-2">Secure access required</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter passphrase"
                className={`w-full p-4 pl-5 bg-gray-900/50 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-guild-red/20 transition-all font-medium backdrop-blur-sm text-white ${loginError ? 'border-red-500 text-red-400' : 'border-gray-700 focus:border-guild-red'}`}
              />
              <AnimatePresence>
                {loginError && (
                  <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-red-500 text-sm mt-2 font-medium">
                    Incorrect passphrase. Access denied.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              whileHover={!isLoggingIn ? { scale: 1.02 } : {}}
              whileTap={!isLoggingIn ? { scale: 0.98 } : {}}
              type="submit"
              disabled={isLoggingIn}
              className={`w-full p-4 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center group ${isLoggingIn ? 'bg-gray-700 cursor-not-allowed text-gray-400' : 'bg-gradient-to-r from-guild-red to-red-700 text-white hover:shadow-red-500/30'}`}
            >
              {isLoggingIn ? (
                <span className="flex items-center"><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />Authenticating...</span>
              ) : (
                <>Authenticate <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" /></>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    );
  }

  // ─── Authenticated Admin Dashboard ───────────────────
  return (
    <div className="min-h-screen relative z-10">
      {/* Top Header */}
      <div className="glass-dark border-b border-gray-700/50 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden mr-3 p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-300">
              <Menu className="w-5 h-5" />
            </button>
            <ShieldCheck className="w-8 h-8 text-guild-red mr-3 hidden sm:block" />
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight font-serif">Command Center</h1>
              <p className="text-gray-400 text-xs font-medium hidden sm:block">Guild Elections Office Administration</p>
            </div>
          </div>
          <button onClick={() => setIsAuthenticated(false)} className="flex items-center px-3 py-2 bg-gray-800/50 hover:bg-red-900/30 text-gray-300 hover:text-guild-red rounded-lg transition-colors font-semibold text-sm border border-gray-700">
            <LogOut className="w-4 h-4 mr-1.5" /> Lock
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 shrink-0 border-r border-gray-700/30 min-h-[calc(100vh-5rem)]">
          <nav className="p-4 space-y-1 sticky top-20">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all group ${activeTab === tab.id ? 'bg-guild-red/20 text-guild-red border border-guild-red/30' : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'}`}
              >
                <span className={`mr-3 ${activeTab === tab.id ? 'text-guild-red' : 'text-gray-500 group-hover:text-gray-300'}`}>{tab.icon}</span>
                {tab.label}
                {activeTab === tab.id && <ChevronRight className="w-4 h-4 ml-auto" />}
              </button>
            ))}
          </nav>
        </aside>

        {/* Sidebar - Mobile Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/60 z-40 lg:hidden" />
              <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: "spring", damping: 25 }} className="fixed left-0 top-0 bottom-0 w-72 glass-dark z-50 lg:hidden overflow-y-auto">
                <div className="p-4 border-b border-gray-700/50 flex justify-between items-center">
                  <span className="text-white font-bold font-serif">Navigation</span>
                  <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-white p-1"><XCircle className="w-5 h-5" /></button>
                </div>
                <nav className="p-4 space-y-1">
                  {TABS.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
                      className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-guild-red/20 text-guild-red' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                    >
                      <span className="mr-3">{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-10 min-w-0">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="glass-dark rounded-2xl p-6 sm:p-8 border-t-4 border-guild-red shadow-xl"
          >
            <TabContent tab={activeTab} />
          </motion.div>
        </main>
      </div>
    </div>
  );
}

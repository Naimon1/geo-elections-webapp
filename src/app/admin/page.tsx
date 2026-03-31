/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useCallback } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock, ShieldCheck, LogOut, ArrowRight, CheckCircle2, XCircle, Menu,
  Users, Vote, Archive, FileText, Bell, Info, BookOpen, History,
  Megaphone, Plus, Trash2, ChevronRight, Pencil, RefreshCw, X,
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
async function submitForm(type: string, payload: Record<string, unknown>, action: 'create' | 'update' = 'create'): Promise<boolean> {
  try {
    const response = await fetch('/api/admin/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, action, ...payload }),
    });
    return response.ok;
  } catch {
    return false;
  }
}

// ─── Fetch existing data helper ─────────────────────────────
async function fetchExistingData(dataType: string) {
  try {
    const response = await fetch(`/api/admin/data?type=${dataType}`);
    if (!response.ok) return [];
    const result = await response.json();
    return result.data || [];
  } catch {
    return [];
  }
}

// ─── Generic Edit Panel ─────────────────────────────────────
function EditPanel<T extends Record<string, unknown>>({
  dataType,
  renderItem,
  onEdit,
}: {
  dataType: string;
  renderItem: (item: T, index: number) => React.ReactNode;
  onEdit: (item: T) => void;
}) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await fetchExistingData(dataType);
    setItems(data);
    setLoading(false);
  }, [dataType]);

  return (
    <div>
      <button type="button" onClick={() => { setVisible(!visible); if (!visible) load(); }} className="flex items-center px-3 py-2 text-sm bg-guild-yellow/10 hover:bg-guild-yellow/20 text-guild-yellow border border-guild-yellow/30 rounded-lg transition-colors font-medium">
        <Pencil className="w-4 h-4 mr-1" /> {visible ? 'Hide Existing' : 'View / Edit Existing'}
      </button>
      <AnimatePresence>
        {visible && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mt-4">
            <div className="border border-gray-700 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold text-gray-300">Existing Entries</p>
                <button type="button" onClick={load} className="text-xs text-gray-400 hover:text-white flex items-center"><RefreshCw className={`w-3 h-3 mr-1 ${loading ? 'animate-spin' : ''}`} /> Refresh</button>
              </div>
              {loading ? (
                <p className="text-sm text-gray-500 py-4 text-center">Loading...</p>
              ) : items.length === 0 ? (
                <p className="text-sm text-gray-500 py-4 text-center">No entries found.</p>
              ) : (
                items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                    <div className="min-w-0 flex-1">{renderItem(item, i)}</div>
                    <button type="button" onClick={() => { onEdit(item); setVisible(false); }} className="flex items-center px-3 py-1.5 text-xs bg-guild-red/10 hover:bg-guild-red/20 text-guild-red border border-guild-red/30 rounded-lg font-bold transition-colors shrink-0 ml-3">
                      <Pencil className="w-3 h-3 mr-1" /> Edit
                    </button>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Section Header with Edit Toggle ────────────────────────
function SectionHeader({
  title,
  description,
  editMode,
  editLabel,
  onCancelEdit,
  children,
}: {
  title: string;
  description: string;
  editMode: boolean;
  editLabel?: string;
  onCancelEdit: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1 font-serif">{editMode ? `Edit ${title}` : title}</h2>
        <p className="text-gray-400 text-sm">{editMode ? `Editing: ${editLabel}` : description}</p>
      </div>
      <div className="flex gap-2 items-start flex-wrap">
        {editMode && (
          <button type="button" onClick={onCancelEdit} className="flex items-center px-3 py-2 text-sm bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors font-medium">
            <X className="w-4 h-4 mr-1" /> Cancel Edit
          </button>
        )}
        {children}
      </div>
    </div>
  );
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
// SECTION: Candidates Form (with Edit)
// ═══════════════════════════════════════════════════════════
function CandidatesSection() {
  const [formData, setFormData] = useState({ name: '', position: '', keyPoints: '', instagram: '', twitter: '', facebook: '' });
  const [urls, setUrls] = useState({ headshotUrl: '', manifestoUrl: '', videoUrl: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [editMode, setEditMode] = useState(false);
  const [editOriginalName, setEditOriginalName] = useState('');
  const [existingCandidates, setExistingCandidates] = useState<{ name: string; position: string; headshotUrl: string; manifestoUrl: string; videoUrl: string; keyPoints: string[]; socialLinks: { instagram?: string; twitter?: string; facebook?: string } }[]>([]);
  const [showExisting, setShowExisting] = useState(false);
  const [loadingExisting, setLoadingExisting] = useState(false);

  const loadExisting = useCallback(async () => {
    setLoadingExisting(true);
    const data = await fetchExistingData('candidates');
    setExistingCandidates(data);
    setLoadingExisting(false);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const startEdit = (c: typeof existingCandidates[0]) => {
    setFormData({
      name: c.name,
      position: c.position,
      keyPoints: c.keyPoints.join(' | '),
      instagram: c.socialLinks.instagram || '',
      twitter: c.socialLinks.twitter || '',
      facebook: c.socialLinks.facebook || '',
    });
    setUrls({
      headshotUrl: c.headshotUrl || '',
      manifestoUrl: c.manifestoUrl || '',
      videoUrl: c.videoUrl || '',
    });
    setEditMode(true);
    setEditOriginalName(c.name);
    setShowExisting(false);
  };

  const cancelEdit = () => {
    setEditMode(false);
    setEditOriginalName('');
    setFormData({ name: '', position: '', keyPoints: '', instagram: '', twitter: '', facebook: '' });
    setUrls({ headshotUrl: '', manifestoUrl: '', videoUrl: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('idle');
    const payload = { ...formData, ...urls, ...(editMode ? { originalName: editOriginalName } : {}) };
    const ok = await submitForm('candidate', payload, editMode ? 'update' : 'create');
    setStatus(ok ? 'success' : 'error');
    if (ok) {
      cancelEdit();
      setTimeout(() => setStatus('idle'), 5000);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-8">
      {/* Toggle existing entries */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1 font-serif">{editMode ? 'Edit Candidate' : 'Add Candidate'}</h2>
          <p className="text-gray-400 text-sm">{editMode ? `Editing: ${editOriginalName}` : 'Submit a new candidate profile or edit an existing one.'}</p>
        </div>
        <div className="flex gap-2">
          {editMode && (
            <button type="button" onClick={cancelEdit} className="flex items-center px-3 py-2 text-sm bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors font-medium">
              <X className="w-4 h-4 mr-1" /> Cancel Edit
            </button>
          )}
          <button type="button" onClick={() => { setShowExisting(!showExisting); if (!showExisting) loadExisting(); }} className="flex items-center px-3 py-2 text-sm bg-guild-yellow/10 hover:bg-guild-yellow/20 text-guild-yellow border border-guild-yellow/30 rounded-lg transition-colors font-medium">
            <Pencil className="w-4 h-4 mr-1" /> {showExisting ? 'Hide Existing' : 'View / Edit Existing'}
          </button>
        </div>
      </div>

      {/* Existing candidates list */}
      <AnimatePresence>
        {showExisting && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="border border-gray-700 rounded-xl p-4 space-y-3 mb-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold text-gray-300">Existing Candidates</p>
                <button type="button" onClick={loadExisting} className="text-xs text-gray-400 hover:text-white flex items-center"><RefreshCw className={`w-3 h-3 mr-1 ${loadingExisting ? 'animate-spin' : ''}`} /> Refresh</button>
              </div>
              {loadingExisting ? (
                <p className="text-sm text-gray-500 py-4 text-center">Loading...</p>
              ) : existingCandidates.length === 0 ? (
                <p className="text-sm text-gray-500 py-4 text-center">No candidates found in the database.</p>
              ) : (
                existingCandidates.map((c, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                    <div className="flex items-center gap-3 min-w-0">
                      {c.headshotUrl && <img src={c.headshotUrl} alt="" className="w-8 h-8 rounded-lg object-cover shrink-0" />}
                      <div className="min-w-0">
                        <p className="text-white font-semibold text-sm truncate">{c.name}</p>
                        <p className="text-gray-400 text-xs">{c.position}</p>
                      </div>
                    </div>
                    <button type="button" onClick={() => startEdit(c)} className="flex items-center px-3 py-1.5 text-xs bg-guild-red/10 hover:bg-guild-red/20 text-guild-red border border-guild-red/30 rounded-lg font-bold transition-colors shrink-0">
                      <Pencil className="w-3 h-3 mr-1" /> Edit
                    </button>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-8">
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

        {/* Asset preview for urls already set (including from edit) */}
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

        <StatusBanner status={status} successMsg={editMode ? "Candidate updated successfully!" : "Candidate profile deployed successfully!"} />

        <button type="submit" disabled={isSubmitting || !urls.headshotUrl} className={`w-full p-4 rounded-xl font-bold text-white transition-all flex justify-center items-center ${isSubmitting || !urls.headshotUrl ? 'bg-gray-700 cursor-not-allowed text-gray-400' : 'bg-gradient-to-r from-guild-red to-red-800 hover:shadow-lg hover:shadow-red-500/30'}`}>
          {isSubmitting ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" /> {editMode ? 'Updating...' : 'Deploying...'}</> : editMode ? 'Update Candidate Profile' : 'Deploy Candidate Profile'}
        </button>
        {!urls.headshotUrl && <p className="text-xs text-center text-red-400 font-medium">* Headshot is required</p>}
      </form>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SECTION: Elections Form (with Edit)
// ═══════════════════════════════════════════════════════════
function ElectionsSection() {
  const emptyForm = { title: '', year: '', electionType: '', status: 'upcoming', description: '', votingDate: '', nominationStart: '', nominationEnd: '', campaignStart: '', campaignEnd: '' };
  const [form, setForm] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [editMode, setEditMode] = useState(false);
  const [editKey, setEditKey] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const cancelEdit = () => { setEditMode(false); setEditKey(''); setForm(emptyForm); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const ok = await submitForm('election', { ...form, ...(editMode ? { originalTitle: editKey } : {}) }, editMode ? 'update' : 'create');
    setStatus(ok ? 'success' : 'error');
    if (ok) { cancelEdit(); setTimeout(() => setStatus('idle'), 5000); }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-8">
      <SectionHeader title="Manage Election" description="Create or configure an election cycle." editMode={editMode} editLabel={editKey} onCancelEdit={cancelEdit}>
        <EditPanel<Record<string, string>>
          dataType="elections"
          renderItem={(item) => (
            <div><p className="text-white font-semibold text-sm">{item.title}</p><p className="text-gray-400 text-xs">{item.year} &middot; {item.status}</p></div>
          )}
          onEdit={(item) => {
            setForm({ title: item.title || '', year: item.year || '', electionType: item.type || '', status: item.status || 'upcoming', description: item.description || '', votingDate: item.votingDate || '', nominationStart: item.nominationStart || '', nominationEnd: item.nominationEnd || '', campaignStart: item.campaignStart || '', campaignEnd: item.campaignEnd || '' });
            setEditMode(true); setEditKey(item.title || '');
          }}
        />
      </SectionHeader>

      <form onSubmit={handleSubmit} className="space-y-8">
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
          <FormField label="Nomination Start"><input name="nominationStart" value={form.nominationStart} onChange={handleChange} className={inputClass} placeholder="e.g., 16th March 2026" /></FormField>
          <FormField label="Nomination End"><input name="nominationEnd" value={form.nominationEnd} onChange={handleChange} className={inputClass} placeholder="e.g., 18th March 2026" /></FormField>
          <FormField label="Campaign Start"><input name="campaignStart" value={form.campaignStart} onChange={handleChange} className={inputClass} placeholder="e.g., 30th March 2026" /></FormField>
          <FormField label="Campaign End"><input name="campaignEnd" value={form.campaignEnd} onChange={handleChange} className={inputClass} placeholder="e.g., 8th April 2026" /></FormField>
        </div>

        <StatusBanner status={status} successMsg={editMode ? "Election updated!" : "Election configuration saved!"} />
        <button type="submit" disabled={isSubmitting} className={`w-full p-4 rounded-xl font-bold text-white transition-all ${isSubmitting ? 'bg-gray-700 cursor-not-allowed text-gray-400' : 'bg-gradient-to-r from-guild-red to-red-800 hover:shadow-lg hover:shadow-red-500/30'}`}>
          {isSubmitting ? 'Saving...' : editMode ? 'Update Election' : 'Save Election'}
        </button>
      </form>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SECTION: Past Results Form (Election-Period-Centric)
// ═══════════════════════════════════════════════════════════
interface PositionEntry {
  position: string;
  rejectedBallots: string;
  totalVotesCast: string;
  candidates: { candidateName: string; votes: string; ron: string; outcome: string }[];
}

function PastResultsSection() {
  const [electionInfo, setElectionInfo] = useState({ returningOfficer: '', day: '', month: '', year: '' });
  const [positions, setPositions] = useState<PositionEntry[]>([{
    position: '', rejectedBallots: '', totalVotesCast: '',
    candidates: [{ candidateName: '', votes: '', ron: '', outcome: 'No Winner' }],
  }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const updateElection = (field: string, value: string) => {
    setElectionInfo(prev => ({ ...prev, [field]: value }));
  };

  const addPosition = () => {
    setPositions(prev => [...prev, {
      position: '', rejectedBallots: '', totalVotesCast: '',
      candidates: [{ candidateName: '', votes: '', ron: '', outcome: 'No Winner' }],
    }]);
  };

  const removePosition = (pi: number) => {
    setPositions(prev => prev.filter((_, i) => i !== pi));
  };

  const updatePosition = (pi: number, field: string, value: string) => {
    setPositions(prev => prev.map((p, i) => i === pi ? { ...p, [field]: value } : p));
  };

  const addCandidate = (pi: number) => {
    setPositions(prev => prev.map((p, i) => i === pi ? { ...p, candidates: [...p.candidates, { candidateName: '', votes: '', ron: '', outcome: 'No Winner' }] } : p));
  };

  const removeCandidate = (pi: number, ci: number) => {
    setPositions(prev => prev.map((p, i) => i === pi ? { ...p, candidates: p.candidates.filter((_, j) => j !== ci) } : p));
  };

  const updateCandidate = (pi: number, ci: number, field: string, value: string) => {
    setPositions(prev => prev.map((p, i) => i === pi ? {
      ...p,
      candidates: p.candidates.map((c, j) => j === ci ? { ...c, [field]: value } : c),
    } : p));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    let allOk = true;

    for (const pos of positions) {
      for (const cand of pos.candidates) {
        const row = {
          ...electionInfo,
          position: pos.position,
          rejectedBallots: pos.rejectedBallots,
          totalVotesCast: pos.totalVotesCast,
          ...cand,
        };
        const ok = await submitForm('past_result', row);
        if (!ok) allOk = false;
      }
    }

    setStatus(allOk ? 'success' : 'error');
    if (allOk) {
      setElectionInfo({ returningOfficer: '', day: '', month: '', year: '' });
      setPositions([{ position: '', rejectedBallots: '', totalVotesCast: '', candidates: [{ candidateName: '', votes: '', ron: '', outcome: 'No Winner' }] }]);
      setTimeout(() => setStatus('idle'), 5000);
    }
    setIsSubmitting(false);
  };

  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1 font-serif">Past Election Results</h2>
        <p className="text-gray-400 text-sm">Record a full election period with all positions and candidates.</p>
      </div>

      {/* Election Period Info */}
      <div className="p-6 border-2 border-guild-yellow/30 bg-guild-yellow/5 rounded-xl space-y-4">
        <p className="text-sm font-bold text-guild-yellow uppercase tracking-wider">Election Period Details</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Returning Officer" required>
            <input required value={electionInfo.returningOfficer} onChange={e => updateElection('returningOfficer', e.target.value)} className={inputClass} placeholder="e.g., Dr. Jane Smith" />
          </FormField>
          <FormField label="Year" required>
            <input required value={electionInfo.year} onChange={e => updateElection('year', e.target.value)} className={inputClass} placeholder="e.g., 2025" />
          </FormField>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Day">
            <input value={electionInfo.day} onChange={e => updateElection('day', e.target.value)} className={inputClass} placeholder="e.g., 9" />
          </FormField>
          <FormField label="Month">
            <select value={electionInfo.month} onChange={e => updateElection('month', e.target.value)} className={selectClass}>
              <option value="">Select month...</option>
              {months.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </FormField>
        </div>
      </div>

      {/* Positions */}
      {positions.map((pos, pi) => (
        <div key={pi} className="p-6 border border-gray-700 rounded-xl space-y-5 relative">
          {positions.length > 1 && (
            <button type="button" onClick={() => removePosition(pi)} className="absolute top-3 right-3 text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button>
          )}

          <div className="flex items-center gap-3">
            <span className="bg-guild-red/20 text-guild-red text-xs font-bold px-2.5 py-1 rounded-full border border-guild-red/30">Position {pi + 1}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField label="Position" required>
              <input required value={pos.position} onChange={e => updatePosition(pi, 'position', e.target.value)} className={inputClass} placeholder="e.g., President" />
            </FormField>
            <FormField label="Rejected Ballots">
              <input value={pos.rejectedBallots} onChange={e => updatePosition(pi, 'rejectedBallots', e.target.value)} className={inputClass} placeholder="e.g., 5" />
            </FormField>
            <FormField label="Total Votes Cast">
              <input value={pos.totalVotesCast} onChange={e => updatePosition(pi, 'totalVotesCast', e.target.value)} className={inputClass} placeholder="e.g., 450" />
            </FormField>
          </div>

          {/* Candidates under this position */}
          <div className="pl-4 border-l-2 border-guild-yellow/30 space-y-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Candidates for {pos.position || 'this position'}</p>

            {pos.candidates.map((cand, ci) => (
              <div key={ci} className="p-4 bg-gray-800/40 rounded-xl space-y-3 relative">
                {pos.candidates.length > 1 && (
                  <button type="button" onClick={() => removeCandidate(pi, ci)} className="absolute top-2 right-2 text-red-400 hover:text-red-300"><Trash2 className="w-3.5 h-3.5" /></button>
                )}
                <p className="text-xs font-bold text-guild-yellow">Candidate {ci + 1}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <FormField label="Name" required>
                    <input required value={cand.candidateName} onChange={e => updateCandidate(pi, ci, 'candidateName', e.target.value)} className={inputClass} placeholder="John Smith" />
                  </FormField>
                  <FormField label="Votes">
                    <input value={cand.votes} onChange={e => updateCandidate(pi, ci, 'votes', e.target.value)} className={inputClass} placeholder="350" />
                  </FormField>
                  <FormField label="RON">
                    <input value={cand.ron} onChange={e => updateCandidate(pi, ci, 'ron', e.target.value)} className={inputClass} placeholder="25" />
                  </FormField>
                  <FormField label="Outcome" required>
                    <select required value={cand.outcome} onChange={e => updateCandidate(pi, ci, 'outcome', e.target.value)} className={selectClass}>
                      <option value="No Winner">No Winner</option>
                      <option value="Winner">Winner</option>
                    </select>
                  </FormField>
                </div>
              </div>
            ))}

            <button type="button" onClick={() => addCandidate(pi)} className="flex items-center text-xs text-guild-yellow hover:text-yellow-300 font-bold transition-colors">
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Candidate
            </button>
          </div>
        </div>
      ))}

      <button type="button" onClick={addPosition} className="flex items-center text-sm text-guild-yellow hover:text-yellow-300 font-bold transition-colors">
        <Plus className="w-4 h-4 mr-1" /> Add Another Position
      </button>

      <StatusBanner status={status} successMsg="Past election results saved!" />
      <button type="submit" disabled={isSubmitting} className={`w-full p-4 rounded-xl font-bold text-white transition-all ${isSubmitting ? 'bg-gray-700 cursor-not-allowed text-gray-400' : 'bg-gradient-to-r from-guild-red to-red-800 hover:shadow-lg hover:shadow-red-500/30'}`}>
        {isSubmitting ? 'Saving...' : 'Save Election Results'}
      </button>
    </form>
  );
}

// ═══════════════════════════════════════════════════════════
// SECTION: Documents Form (with Edit)
// ═══════════════════════════════════════════════════════════
function DocumentsSection() {
  const emptyForm = { title: '', category: '', description: '', dateAdded: '' };
  const [form, setForm] = useState(emptyForm);
  const [fileUrl, setFileUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [editMode, setEditMode] = useState(false);
  const [editKey, setEditKey] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const cancelEdit = () => { setEditMode(false); setEditKey(''); setForm(emptyForm); setFileUrl(''); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const ok = await submitForm('document', { ...form, fileUrl, ...(editMode ? { originalTitle: editKey } : {}) }, editMode ? 'update' : 'create');
    setStatus(ok ? 'success' : 'error');
    if (ok) { cancelEdit(); setTimeout(() => setStatus('idle'), 5000); }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-8">
      <SectionHeader title="Upload Document" description="Add official documents such as the Electoral Code, nomination forms, guidelines, and rulings." editMode={editMode} editLabel={editKey} onCancelEdit={cancelEdit}>
        <EditPanel<Record<string, string>>
          dataType="documents"
          renderItem={(item) => (
            <div><p className="text-white font-semibold text-sm">{item.title}</p><p className="text-gray-400 text-xs">{item.category}</p></div>
          )}
          onEdit={(item) => {
            setForm({ title: item.title || '', category: item.category || '', description: item.description || '', dateAdded: item.dateAdded || '' });
            setFileUrl(item.fileUrl || '');
            setEditMode(true); setEditKey(item.title || '');
          }}
        />
      </SectionHeader>

      <form onSubmit={handleSubmit} className="space-y-8">
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
        <FileUpload label="Document File" accept={{ 'application/pdf': ['.pdf'], 'image/*': ['.png', '.jpg', '.jpeg'], 'application/msword': ['.doc', '.docx'] }} onUploadSuccess={(url) => setFileUrl(url)} />
        {fileUrl && <p className="text-xs text-green-400 truncate">Uploaded: {fileUrl}</p>}

        <StatusBanner status={status} successMsg={editMode ? "Document updated!" : "Document uploaded successfully!"} />
        <button type="submit" disabled={isSubmitting || !fileUrl} className={`w-full p-4 rounded-xl font-bold text-white transition-all ${isSubmitting || !fileUrl ? 'bg-gray-700 cursor-not-allowed text-gray-400' : 'bg-gradient-to-r from-guild-red to-red-800 hover:shadow-lg hover:shadow-red-500/30'}`}>
          {isSubmitting ? 'Uploading...' : editMode ? 'Update Document' : 'Publish Document'}
        </button>
      </form>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SECTION: Notices Form (with Edit)
// ═══════════════════════════════════════════════════════════
function NoticesSection() {
  const emptyForm = { title: '', content: '', date: '', noticeType: 'announcement', isActive: 'yes' };
  const [form, setForm] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [editMode, setEditMode] = useState(false);
  const [editKey, setEditKey] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const cancelEdit = () => { setEditMode(false); setEditKey(''); setForm(emptyForm); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const ok = await submitForm('notice', { ...form, ...(editMode ? { originalTitle: editKey } : {}) }, editMode ? 'update' : 'create');
    setStatus(ok ? 'success' : 'error');
    if (ok) { cancelEdit(); setTimeout(() => setStatus('idle'), 5000); }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-8">
      <SectionHeader title="Post Notice" description="Publish official notices, advisories, and announcements." editMode={editMode} editLabel={editKey} onCancelEdit={cancelEdit}>
        <EditPanel<Record<string, string>>
          dataType="notices"
          renderItem={(item) => (
            <div><p className="text-white font-semibold text-sm">{item.title}</p><p className="text-gray-400 text-xs">{item.type} &middot; {item.date}</p></div>
          )}
          onEdit={(item) => {
            setForm({ title: item.title || '', content: item.content || '', date: item.date || '', noticeType: item.type || 'announcement', isActive: item.isActive ? 'yes' : 'no' });
            setEditMode(true); setEditKey(item.title || '');
          }}
        />
      </SectionHeader>

      <form onSubmit={handleSubmit} className="space-y-8">
        <FormField label="Notice Title" required>
          <input required name="title" value={form.title} onChange={handleChange} className={inputClass} placeholder="e.g., Nomination Period Extended" />
        </FormField>
        <FormField label="Content" required>
          <textarea required name="content" value={form.content} onChange={handleChange} rows={5} className={textareaClass} placeholder="Full notice content..." />
        </FormField>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField label="Date"><input name="date" value={form.date} onChange={handleChange} className={inputClass} placeholder="e.g., March 30, 2026" /></FormField>
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

        <StatusBanner status={status} successMsg={editMode ? "Notice updated!" : "Notice published!"} />
        <button type="submit" disabled={isSubmitting} className={`w-full p-4 rounded-xl font-bold text-white transition-all ${isSubmitting ? 'bg-gray-700 cursor-not-allowed text-gray-400' : 'bg-gradient-to-r from-guild-red to-red-800 hover:shadow-lg hover:shadow-red-500/30'}`}>
          {isSubmitting ? 'Publishing...' : editMode ? 'Update Notice' : 'Publish Notice'}
        </button>
      </form>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SECTION: About GEO Form (with Edit)
// ═══════════════════════════════════════════════════════════
function AboutSection() {
  const emptyForm = { sectionTitle: '', content: '', order: '0', iconName: '' };
  const [form, setForm] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [editMode, setEditMode] = useState(false);
  const [editKey, setEditKey] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const cancelEdit = () => { setEditMode(false); setEditKey(''); setForm(emptyForm); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const ok = await submitForm('about_section', { ...form, ...(editMode ? { originalTitle: editKey } : {}) }, editMode ? 'update' : 'create');
    setStatus(ok ? 'success' : 'error');
    if (ok) { cancelEdit(); setTimeout(() => setStatus('idle'), 5000); }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-8">
      <SectionHeader title="About GEO Content" description="Add or update sections on the About page (mandate, role, structure, responsibilities)." editMode={editMode} editLabel={editKey} onCancelEdit={cancelEdit}>
        <EditPanel<Record<string, string>>
          dataType="about"
          renderItem={(item) => (
            <div><p className="text-white font-semibold text-sm">{item.sectionTitle}</p><p className="text-gray-400 text-xs">Order: {item.order}</p></div>
          )}
          onEdit={(item) => {
            setForm({ sectionTitle: item.sectionTitle || '', content: item.content || '', order: item.order || '0', iconName: item.iconName || '' });
            setEditMode(true); setEditKey(item.sectionTitle || '');
          }}
        />
      </SectionHeader>

      <form onSubmit={handleSubmit} className="space-y-8">
        <FormField label="Section Title" required>
          <input required name="sectionTitle" value={form.sectionTitle} onChange={handleChange} className={inputClass} placeholder="e.g., Our Mandate" />
        </FormField>
        <FormField label="Content" required>
          <textarea required name="content" value={form.content} onChange={handleChange} rows={6} className={textareaClass} placeholder="Section content... Use | to separate bullet points if needed." />
        </FormField>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField label="Display Order"><input name="order" type="number" value={form.order} onChange={handleChange} className={inputClass} placeholder="0" /></FormField>
          <FormField label="Icon Name (optional)"><input name="iconName" value={form.iconName} onChange={handleChange} className={inputClass} placeholder="e.g., Shield, BookOpen, Scale" /></FormField>
        </div>

        <StatusBanner status={status} successMsg={editMode ? "Section updated!" : "About section saved!"} />
        <button type="submit" disabled={isSubmitting} className={`w-full p-4 rounded-xl font-bold text-white transition-all ${isSubmitting ? 'bg-gray-700 cursor-not-allowed text-gray-400' : 'bg-gradient-to-r from-guild-red to-red-800 hover:shadow-lg hover:shadow-red-500/30'}`}>
          {isSubmitting ? 'Saving...' : editMode ? 'Update Section' : 'Save Section'}
        </button>
      </form>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SECTION: Councilor Roles Form (with Edit)
// ═══════════════════════════════════════════════════════════
function CouncilorRolesSection() {
  const emptyForm = { position: '', constitutionalDuties: '', additionalExpectations: '', candidateGuidance: '', order: '0' };
  const [form, setForm] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [editMode, setEditMode] = useState(false);
  const [editKey, setEditKey] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const cancelEdit = () => { setEditMode(false); setEditKey(''); setForm(emptyForm); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const ok = await submitForm('councilor_role', { ...form, ...(editMode ? { originalPosition: editKey } : {}) }, editMode ? 'update' : 'create');
    setStatus(ok ? 'success' : 'error');
    if (ok) { cancelEdit(); setTimeout(() => setStatus('idle'), 5000); }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-8">
      <SectionHeader title="Councilor Role" description="Define a councilor position, its duties, expectations, and guidance for prospective candidates." editMode={editMode} editLabel={editKey} onCancelEdit={cancelEdit}>
        <EditPanel<Record<string, string>>
          dataType="councilor_roles"
          renderItem={(item) => (
            <div><p className="text-white font-semibold text-sm">{item.position}</p><p className="text-gray-400 text-xs">Order: {item.order}</p></div>
          )}
          onEdit={(item) => {
            setForm({
              position: item.position || '',
              constitutionalDuties: Array.isArray(item.constitutionalDuties) ? item.constitutionalDuties.join(' | ') : (item.constitutionalDuties || ''),
              additionalExpectations: Array.isArray(item.additionalExpectations) ? item.additionalExpectations.join(' | ') : (item.additionalExpectations || ''),
              candidateGuidance: item.candidateGuidance || '',
              order: item.order || '0',
            });
            setEditMode(true); setEditKey(item.position || '');
          }}
        />
      </SectionHeader>

      <form onSubmit={handleSubmit} className="space-y-8">
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

        <StatusBanner status={status} successMsg={editMode ? "Role updated!" : "Councilor role saved!"} />
        <button type="submit" disabled={isSubmitting} className={`w-full p-4 rounded-xl font-bold text-white transition-all ${isSubmitting ? 'bg-gray-700 cursor-not-allowed text-gray-400' : 'bg-gradient-to-r from-guild-red to-red-800 hover:shadow-lg hover:shadow-red-500/30'}`}>
          {isSubmitting ? 'Saving...' : editMode ? 'Update Role' : 'Save Role'}
        </button>
      </form>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SECTION: Records / Officials Form (with Edit)
// ═══════════════════════════════════════════════════════════
function RecordsSection() {
  const emptyForm = { name: '', role: '', yearStart: '', yearEnd: '', officialType: 'geo_official' };
  const [form, setForm] = useState(emptyForm);
  const [photoUrl, setPhotoUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [editMode, setEditMode] = useState(false);
  const [editKey, setEditKey] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const cancelEdit = () => { setEditMode(false); setEditKey(''); setForm(emptyForm); setPhotoUrl(''); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const ok = await submitForm('official', { ...form, photoUrl, ...(editMode ? { originalName: editKey } : {}) }, editMode ? 'update' : 'create');
    setStatus(ok ? 'success' : 'error');
    if (ok) { cancelEdit(); setTimeout(() => setStatus('idle'), 5000); }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-8">
      <SectionHeader title="Add Official / Record" description="Record past Returning Officers, GEO officials, and former elected or appointed Councilors." editMode={editMode} editLabel={editKey} onCancelEdit={cancelEdit}>
        <EditPanel<Record<string, string>>
          dataType="officials"
          renderItem={(item) => (
            <div><p className="text-white font-semibold text-sm">{item.name}</p><p className="text-gray-400 text-xs">{item.role} &middot; {item.yearStart}{item.yearEnd ? `–${item.yearEnd}` : ''}</p></div>
          )}
          onEdit={(item) => {
            setForm({ name: item.name || '', role: item.role || '', yearStart: item.yearStart || '', yearEnd: item.yearEnd || '', officialType: item.type || 'geo_official' });
            setPhotoUrl(item.photoUrl || '');
            setEditMode(true); setEditKey(item.name || '');
          }}
        />
      </SectionHeader>

      <form onSubmit={handleSubmit} className="space-y-8">
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
        <FileUpload label="Photo (optional)" accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }} onUploadSuccess={(url) => setPhotoUrl(url)} />
        {photoUrl && <p className="text-xs text-green-400 truncate">Photo: {photoUrl}</p>}

        <StatusBanner status={status} successMsg={editMode ? "Record updated!" : "Record saved successfully!"} />
        <button type="submit" disabled={isSubmitting} className={`w-full p-4 rounded-xl font-bold text-white transition-all ${isSubmitting ? 'bg-gray-700 cursor-not-allowed text-gray-400' : 'bg-gradient-to-r from-guild-red to-red-800 hover:shadow-lg hover:shadow-red-500/30'}`}>
          {isSubmitting ? 'Saving...' : editMode ? 'Update Record' : 'Save Record'}
        </button>
      </form>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SECTION: Announcements Form (with Edit)
// ═══════════════════════════════════════════════════════════
function AnnouncementsSection() {
  const emptyForm = { title: '', content: '', date: '', priority: 'medium', isActive: 'yes' };
  const [form, setForm] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [editMode, setEditMode] = useState(false);
  const [editKey, setEditKey] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const cancelEdit = () => { setEditMode(false); setEditKey(''); setForm(emptyForm); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const ok = await submitForm('announcement', { ...form, ...(editMode ? { originalTitle: editKey } : {}) }, editMode ? 'update' : 'create');
    setStatus(ok ? 'success' : 'error');
    if (ok) { cancelEdit(); setTimeout(() => setStatus('idle'), 5000); }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-8">
      <SectionHeader title="Real-Time Announcement" description="Post live updates that appear on the Elections page and homepage during the election period." editMode={editMode} editLabel={editKey} onCancelEdit={cancelEdit}>
        <EditPanel<Record<string, string>>
          dataType="announcements"
          renderItem={(item) => (
            <div><p className="text-white font-semibold text-sm">{item.title}</p><p className="text-gray-400 text-xs">{item.priority} &middot; {item.date}</p></div>
          )}
          onEdit={(item) => {
            setForm({ title: item.title || '', content: item.content || '', date: item.date || '', priority: item.priority || 'medium', isActive: item.isActive ? 'yes' : 'no' });
            setEditMode(true); setEditKey(item.title || '');
          }}
        />
      </SectionHeader>

      <form onSubmit={handleSubmit} className="space-y-8">
        <FormField label="Title" required>
          <input required name="title" value={form.title} onChange={handleChange} className={inputClass} placeholder="e.g., Polling Stations Now Open" />
        </FormField>
        <FormField label="Content" required>
          <textarea required name="content" value={form.content} onChange={handleChange} rows={4} className={textareaClass} placeholder="Announcement details..." />
        </FormField>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField label="Date"><input name="date" value={form.date} onChange={handleChange} className={inputClass} placeholder="e.g., March 30, 2026" /></FormField>
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

        <StatusBanner status={status} successMsg={editMode ? "Announcement updated!" : "Announcement published!"} />
        <button type="submit" disabled={isSubmitting} className={`w-full p-4 rounded-xl font-bold text-white transition-all ${isSubmitting ? 'bg-gray-700 cursor-not-allowed text-gray-400' : 'bg-gradient-to-r from-guild-red to-red-800 hover:shadow-lg hover:shadow-red-500/30'}`}>
          {isSubmitting ? 'Publishing...' : editMode ? 'Update Announcement' : 'Publish Announcement'}
        </button>
      </form>
    </div>
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

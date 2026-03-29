/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ShieldCheck, LogOut, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function AdminPortal() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    keyPoints: '',
    instagram: '',
    twitter: '',
    facebook: '',
  });

  const [urls, setUrls] = useState({
    headshotUrl: '',
    manifestoUrl: '',
    videoUrl: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === (process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123')) {
      setIsAuthenticated(true);
      setLoginError(false);
    } else {
      setLoginError(true);
      setTimeout(() => setLoginError(false), 3000);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/admin/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, ...urls }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          position: '',
          keyPoints: '',
          instagram: '',
          twitter: '',
          facebook: '',
        });
        setUrls({ headshotUrl: '', manifestoUrl: '', videoUrl: '' });
        setTimeout(() => setSubmitStatus('idle'), 5000);
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

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
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter passphrase"
                  className={`w-full p-4 pl-5 bg-gray-900/50 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-guild-red/20 transition-all font-medium backdrop-blur-sm text-white
                    ${loginError ? 'border-red-500 text-red-400' : 'border-gray-700 focus:border-guild-red'}`}
                />
              </div>
              <AnimatePresence>
                {loginError && (
                  <motion.p 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-red-500 text-sm mt-2 font-medium"
                  >
                    Incorrect passphrase. Access denied.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-gradient-to-r from-guild-red to-red-700 text-white p-4 rounded-xl font-bold shadow-lg hover:shadow-red-500/30 transition-all flex items-center justify-center group"
            >
              Authenticate
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto"
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-white flex items-center tracking-tight font-serif">
              <ShieldCheck className="w-10 h-10 text-guild-red mr-3" />
              Command Center
            </h1>
            <p className="text-gray-400 mt-2 font-medium">Manage candidate profiles and assets</p>
          </div>
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="flex items-center px-4 py-2 bg-gray-800/50 hover:bg-red-900/30 text-gray-300 hover:text-guild-red rounded-lg transition-colors font-semibold shadow-sm border border-gray-700"
          >
            <LogOut className="w-4 h-4 mr-2" /> Lock Session
          </button>
        </div>
        
        <div className="glass-dark rounded-3xl shadow-2xl p-8 md:p-12 border-t-4 border-guild-red">
          <form onSubmit={handleSubmit} className="space-y-10">
            
            {/* Profile Information */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-2 font-serif">Profile Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">Full Name</label>
                  <input
                    required
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-4 bg-gray-900/50 border-2 border-gray-700 text-white rounded-xl focus:ring-4 focus:ring-guild-yellow/20 focus:border-guild-yellow transition-all font-medium"
                    placeholder="e.g., Jane Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">Position</label>
                  <input
                    required
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    placeholder="e.g., President"
                    className="w-full p-4 bg-gray-900/50 border-2 border-gray-700 text-white rounded-xl focus:ring-4 focus:ring-guild-yellow/20 focus:border-guild-yellow transition-all font-medium"
                  />
                </div>
              </div>

              <div className="mt-8">
                <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">Key Points <span className="text-gray-500 font-normal normal-case">(Separate with |)</span></label>
                <textarea
                  required
                  name="keyPoints"
                  value={formData.keyPoints}
                  onChange={handleInputChange}
                  placeholder="Focus on student welfare | Improve campus facilities | Transparent governance"
                  rows={3}
                  className="w-full p-4 bg-gray-900/50 border-2 border-gray-700 text-white rounded-xl focus:ring-4 focus:ring-guild-yellow/20 focus:border-guild-yellow transition-all font-medium resize-none"
                />
              </div>
            </section>

            {/* Social Links */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-2 font-serif">Social Connectivity</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">Instagram</label>
                  <input
                    type="url"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleInputChange}
                    placeholder="https://instagram.com/..."
                    className="w-full p-4 bg-gray-900/50 border-2 border-gray-700 text-white rounded-xl focus:ring-4 focus:ring-pink-500/20 focus:border-pink-500 transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">Twitter</label>
                  <input
                    type="url"
                    name="twitter"
                    value={formData.twitter}
                    onChange={handleInputChange}
                    placeholder="https://twitter.com/..."
                    className="w-full p-4 bg-gray-900/50 border-2 border-gray-700 text-white rounded-xl focus:ring-4 focus:ring-blue-400/20 focus:border-blue-400 transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">Facebook</label>
                  <input
                    type="url"
                    name="facebook"
                    value={formData.facebook}
                    onChange={handleInputChange}
                    placeholder="https://facebook.com/..."
                    className="w-full p-4 bg-gray-900/50 border-2 border-gray-700 text-white rounded-xl focus:ring-4 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium"
                  />
                </div>
              </div>
            </section>

            {/* Media Uploads */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-2 font-serif">Asset Management Suite</h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <FileUpload
                  label="Official Headshot"
                  accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }}
                  onUploadSuccess={(url) => setUrls(prev => ({ ...prev, headshotUrl: url }))}
                />
                
                <FileUpload
                  label="Campaign Manifesto (PDF)"
                  accept={{ 'application/pdf': ['.pdf'] }}
                  onUploadSuccess={(url) => setUrls(prev => ({ ...prev, manifestoUrl: url }))}
                />

                <FileUpload
                  label="Campaign Video"
                  accept={{ 'video/*': ['.mp4', '.mov', '.webm'] }}
                  onUploadSuccess={(url) => setUrls(prev => ({ ...prev, videoUrl: url }))}
                />
              </div>
            </section>

            <AnimatePresence>
              {submitStatus === 'success' && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-6 bg-green-900/30 backdrop-blur-sm border-2 border-green-800/50 text-green-400 rounded-2xl flex items-center shadow-inner"
                >
                  <CheckCircle2 className="w-6 h-6 mr-3 text-green-500" />
                  <span className="font-bold text-lg">Candidate profile successfully deployed to database!</span>
                </motion.div>
              )}

              {submitStatus === 'error' && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-6 bg-red-900/30 backdrop-blur-sm border-2 border-red-800/50 text-red-400 rounded-2xl flex items-center shadow-inner"
                >
                  <XCircle className="w-6 h-6 mr-3 text-red-500" />
                  <span className="font-bold text-lg">Deployment failed. Please verify webhook configuration and try again.</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pt-6">
              <motion.button
                whileHover={(!isSubmitting && urls.headshotUrl) ? { scale: 1.01 } : {}}
                whileTap={(!isSubmitting && urls.headshotUrl) ? { scale: 0.99 } : {}}
                type="submit"
                disabled={isSubmitting || !urls.headshotUrl}
                className={`w-full p-5 rounded-2xl font-extrabold text-white text-lg transition-all shadow-xl flex justify-center items-center
                  ${isSubmitting || !urls.headshotUrl 
                    ? 'bg-gray-700 cursor-not-allowed shadow-none text-gray-400' 
                    : 'bg-gradient-to-r from-guild-red to-red-800 hover:shadow-red-500/40'}`}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    Deploying Profile...
                  </span>
                ) : 'Deploy Candidate Profile'}
              </motion.button>
              
              {!urls.headshotUrl && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-center text-red-400 font-medium mt-3"
                >
                  * Official Headshot asset is required before deployment
                </motion.p>
              )}
            </div>
          </form>
        </div>

        {/* Gallery View / File Table Placeholder */}
        <div className="mt-12 glass-dark rounded-3xl shadow-2xl p-8 md:p-12 border-t-4 border-guild-yellow">
          <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-2 flex items-center font-serif">
            Asset Gallery
            <span className="ml-3 text-xs bg-yellow-900/50 text-guild-yellow border border-yellow-700/50 px-2 py-1 rounded-full font-bold">Session</span>
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-700 text-sm uppercase tracking-wider text-gray-400">
                  <th className="pb-3 font-bold">Preview</th>
                  <th className="pb-3 font-bold">Asset Type</th>
                  <th className="pb-3 font-bold">URL</th>
                  <th className="pb-3 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {urls.headshotUrl && (
                  <tr className="border-b border-gray-800 hover:bg-white/5 transition-colors">
                    <td className="py-4">
                      <div className="w-12 h-12 rounded-lg bg-gray-800 overflow-hidden relative">
                        <img src={urls.headshotUrl} alt="Headshot" className="object-cover w-full h-full" />
                      </div>
                    </td>
                    <td className="py-4 font-medium text-gray-300">Headshot Image</td>
                    <td className="py-4 text-sm text-gray-500 truncate max-w-[200px]">{urls.headshotUrl}</td>
                    <td className="py-4 text-right">
                      <button onClick={() => setUrls(p => ({...p, headshotUrl: ''}))} className="text-red-400 hover:text-red-300 font-medium text-sm">Remove</button>
                    </td>
                  </tr>
                )}
                {urls.manifestoUrl && (
                  <tr className="border-b border-gray-800 hover:bg-white/5 transition-colors">
                    <td className="py-4">
                      <div className="w-12 h-12 rounded-lg bg-red-900/30 flex items-center justify-center text-guild-red font-bold border border-red-800/50">PDF</div>
                    </td>
                    <td className="py-4 font-medium text-gray-300">Manifesto Document</td>
                    <td className="py-4 text-sm text-gray-500 truncate max-w-[200px]">{urls.manifestoUrl}</td>
                    <td className="py-4 text-right">
                      <button onClick={() => setUrls(p => ({...p, manifestoUrl: ''}))} className="text-red-400 hover:text-red-300 font-medium text-sm">Remove</button>
                    </td>
                  </tr>
                )}
                {urls.videoUrl && (
                  <tr className="border-b border-gray-800 hover:bg-white/5 transition-colors">
                    <td className="py-4">
                      <div className="w-12 h-12 rounded-lg bg-blue-900/30 flex items-center justify-center text-blue-400 font-bold border border-blue-800/50">VID</div>
                    </td>
                    <td className="py-4 font-medium text-gray-300">Campaign Video</td>
                    <td className="py-4 text-sm text-gray-500 truncate max-w-[200px]">{urls.videoUrl}</td>
                    <td className="py-4 text-right">
                      <button onClick={() => setUrls(p => ({...p, videoUrl: ''}))} className="text-red-400 hover:text-red-300 font-medium text-sm">Remove</button>
                    </td>
                  </tr>
                )}
                {!urls.headshotUrl && !urls.manifestoUrl && !urls.videoUrl && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-500 italic">No assets uploaded in this session yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

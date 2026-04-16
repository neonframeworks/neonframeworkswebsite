'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, CheckCircle, X, Image as ImageIcon, Film, AlertCircle } from 'lucide-react';

const CATEGORIES = ['Concert', 'Club Events', 'Wedding', 'Event', 'Music', 'Brand', 'Short Film', 'Reels'];
const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB

export default function AdminUpload() {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [artistName, setArtistName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0); 
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'uploaded' | 'saved' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const onDrop = useCallback((accepted: File[], rejected: unknown[]) => {
    if ((rejected as { file: File }[]).length > 0) {
      setErrorMsg('Some files were rejected due to type or 500MB size limit.');
      setStatus('error');
    }
    
    if (accepted.length === 0) return;

    setFiles(prev => [...prev, ...accepted]);
    const newPreviews = accepted.map(f => f.type.startsWith('image/') ? URL.createObjectURL(f) : '');
    setPreviews(prev => [...prev, ...newPreviews]);
    
    setStatus('idle');
    setErrorMsg('');
    setMediaUrls([]);
    setUploadProgress(0);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'], 'video/*': ['.mp4', '.mov'] },
    maxSize: MAX_FILE_SIZE,
    multiple: true,
  });

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => {
      const target = prev[index];
      if (target) URL.revokeObjectURL(target);
      return prev.filter((_, i) => i !== index);
    });
    setStatus('idle');
    setUploadProgress(0);
    setMediaUrls([]);
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setUploading(true);
    setErrorMsg('');
    setUploadProgress(0);
    setMediaUrls([]);

    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || !uploadPreset) {
        throw new Error('Cloudinary environment variables are missing');
      }

      const urls: string[] = [];
      let totalCompleted = 0;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);

        const url = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;

        const responseUrl = await new Promise<string>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open('POST', url, true);
          
          xhr.onload = () => {
            if (xhr.status === 200) {
              const res = JSON.parse(xhr.responseText);
              resolve(res.secure_url);
            } else {
              reject(new Error(`Failed to upload ${file.name}`));
            }
          };

          xhr.onerror = () => reject(new Error('Network error during upload'));
          xhr.send(formData);
        });

        urls.push(responseUrl);
        totalCompleted++;
        setUploadProgress(Math.round((totalCompleted / files.length) * 100));
      }

      setMediaUrls(urls);
      setStatus('uploaded');
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Upload failed');
      setStatus('error');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (mediaUrls.length === 0 || (category !== 'Logo' && !title.trim())) {
      setErrorMsg('Please upload media and fill out required fields.');
      setStatus('error');
      return;
    }

    setSaving(true);
    setErrorMsg('');

    try {
      const sanitizedTitle = title ? title.replace(/[<>'\"&]/g, '').trim().slice(0, 200) : 'Brand Partner';
      const sanitizedArtist = artistName ? artistName.replace(/[<>'\"&]/g, '').trim().slice(0, 200) : '';
      const sanitizedDesc = description ? description.replace(/[<>'\"&]/g, '').trim().slice(0, 1000) : '';
      const collectionName = category === 'Logo' ? 'logos' : (category === 'Highlight' ? 'highlights' : 'portfolio');

      const savePromises = mediaUrls.map((url, i) => {
        const fileType = files[i]?.type.startsWith('video/') ? 'video' : 'image';
        return fetch(`/api/${collectionName}/add`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: sanitizedTitle,
            artistName: sanitizedArtist,
            category,
            description: sanitizedDesc,
            mediaUrl: url,
            type: fileType,
          }),
        }).then(res => {
          if (!res.ok) throw new Error('Failed to save an item to DB');
        });
      });

      await Promise.all(savePromises);

      setStatus('saved');
      setTimeout(() => {
        previews.forEach(p => p && URL.revokeObjectURL(p));
        setFiles([]);
        setPreviews([]);
        setTitle('');
        setArtistName('');
        setDescription('');
        setMediaUrls([]);
        setUploadProgress(0);
        setCategory(CATEGORIES[0]);
        setStatus('idle');
      }, 2000);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Save failed');
      setStatus('error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">Upload Media</h2>
        <p className="text-white/40 text-sm">Drag & drop multiple files for bulk uploads.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 ${
              isDragActive
                ? 'border-[#952EBE] bg-[#952EBE]/10'
                : 'border-white/10 hover:border-[#952EBE]/40 hover:bg-white/2'
            }`}
          >
            <input {...getInputProps()} />
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#952EBE]/20 to-[#3A46DA]/20 flex items-center justify-center">
              <Upload size={28} className="text-[#952EBE]" />
            </div>
            <p className="text-white font-semibold mb-1">
              {isDragActive ? 'Drop files here!' : 'Drag & drop (Multiple Allowed)'}
            </p>
            <p className="text-white/40 text-sm">JPG, PNG, WEBP, MP4, MOV — max 500MB total</p>
          </div>

          {files.length > 0 && (
            <div className="glass rounded-2xl p-4 relative space-y-3">
              <div className="flex justify-between text-sm text-white/50 mb-2">
                <span>{files.length} file{files.length > 1 ? 's' : ''} queued</span>
              </div>
              <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                {files.map((file, idx) => (
                  <div key={`${file.name}-${idx}`} className="flex flex-row items-center gap-3 bg-white/5 rounded-xl p-2 relative">
                    <button
                      onClick={() => removeFile(idx)}
                      disabled={uploading || status === 'uploaded'}
                      className="absolute top-2 right-2 p-1 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500/40 disabled:opacity-50"
                      aria-label="Remove"
                    >
                      <X size={14} />
                    </button>
                    {previews[idx] ? (
                      <img src={previews[idx]} alt="Preview" className="w-16 h-12 object-cover rounded-lg" />
                    ) : (
                      <div className="w-16 h-12 bg-white/5 rounded-lg flex items-center justify-center">
                        <Film size={20} className="text-white/20" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0 pr-8">
                      <p className="text-white text-xs truncate max-w-full">{file.name}</p>
                      <p className="text-white/30 text-[10px]">{(file.size / (1024 * 1024)).toFixed(1)}MB</p>
                    </div>
                  </div>
                ))}
              </div>

              {(uploading || status === 'uploaded') && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-white/50 mb-1">
                    <span>{status === 'uploaded' ? 'Upload complete' : 'Uploading...'}</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="progress-bar h-full bg-gradient-to-r from-[#952EBE] to-[#3A46DA] transition-all" style={{ width: `${uploadProgress}%` }} />
                  </div>
                </div>
              )}

              {status !== 'uploaded' && !uploading && (
                <motion.button
                  onClick={handleUpload}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-3 w-full py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#952EBE] to-[#3A46DA] text-white flex items-center justify-center gap-2"
                >
                  <Upload size={15} />
                  Upload All to Cloudinary
                </motion.button>
              )}

              {status === 'uploaded' && (
                <div className="mt-2 text-center text-green-400 text-xs font-semibold">
                  <CheckCircle size={14} className="inline mr-1 mb-0.5" />
                  All Files Uploaded! Add metadata and Save.
                </div>
              )}
            </div>
          )}
        </div>

        <div className="glass rounded-2xl p-6 space-y-4">
          <div>
            <label className="text-white/50 text-xs font-semibold uppercase tracking-wider block mb-2">
              Upload Type
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  category !== 'Logo' && category !== 'Highlight' ? 'bg-[#952EBE] text-white' : 'glass text-white/50'
                }`}
                onClick={() => setCategory(CATEGORIES[0])}
              >
                Portfolio
              </button>
              <button
                type="button"
                className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  category === 'Highlight' ? 'bg-[#952EBE] text-white' : 'glass text-white/50'
                }`}
                onClick={() => {
                  setCategory('Highlight');
                  setTitle('');
                }}
              >
                Highlights
              </button>
              <button
                type="button"
                className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  category === 'Logo' ? 'bg-[#952EBE] text-white' : 'glass text-white/50'
                }`}
                onClick={() => {
                  setCategory('Logo');
                  setTitle('');
                }}
              >
                Brand Partners
              </button>
            </div>
          </div>

          {category !== 'Logo' && (
            <>
              <div>
                <label className="text-white/50 text-xs font-semibold uppercase tracking-wider block mb-2">
                  Title (applied to all files) *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Armaan Malik Live Concert"
                  maxLength={200}
                  className="input-field w-full rounded-xl px-4 py-3 text-white placeholder-white/25 text-sm"
                />
              </div>

              <div>
                <label className="text-white/50 text-xs font-semibold uppercase tracking-wider block mb-2">
                  Artist / Event Name
                </label>
                <input
                  type="text"
                  value={artistName}
                  onChange={(e) => setArtistName(e.target.value)}
                  placeholder="e.g. Armaan Malik"
                  maxLength={200}
                  className="input-field w-full rounded-xl px-4 py-3 text-white placeholder-white/25 text-sm"
                />
                <p className="text-white/25 text-[11px] mt-1">Used for grouping on the Work page</p>
              </div>

              <div>
                <label className="text-white/50 text-xs font-semibold uppercase tracking-wider block mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="input-field w-full rounded-xl px-4 py-3 text-white text-sm bg-[#0B101A]"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-white/50 text-xs font-semibold uppercase tracking-wider block mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description..."
                  maxLength={1000}
                  rows={3}
                  className="input-field w-full rounded-xl px-4 py-3 text-white placeholder-white/25 text-sm resize-none"
                />
              </div>
            </>
          )}

          <div>
            <label className="text-white/50 text-xs font-semibold uppercase tracking-wider block mb-2">
              Active Uploads Selected
            </label>
            <input
              type="text"
              readOnly
              value={mediaUrls.length > 0 ? `${mediaUrls.length} file(s) ready for saving` : 'Pending metadata...'}
              className="input-field w-full rounded-xl px-4 py-3 text-white/50 text-xs font-mono"
            />
          </div>

          {status === 'error' && errorMsg && (
            <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 rounded-lg px-3 py-2 mt-4">
              <AlertCircle size={14} />
              {errorMsg}
            </div>
          )}

          {status === 'saved' && (
            <div className="flex items-center gap-2 text-green-400 text-xs bg-green-500/10 rounded-lg px-3 py-2 mt-4">
              <CheckCircle size={14} />
              Saved {mediaUrls.length} item(s) to {category === 'Logo' ? 'Brand Partners' : (category === 'Highlight' ? 'Highlights' : 'Portfolio')}!
            </div>
          )}

          <motion.button
            onClick={handleSave}
            disabled={mediaUrls.length === 0 || (category !== 'Logo' && !title.trim()) || saving}
            whileHover={{ scale: mediaUrls.length === 0 || (category !== 'Logo' && !title.trim()) ? 1 : 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 mt-4 rounded-xl text-sm font-bold bg-gradient-to-r from-[#952EBE] to-[#3A46DA] text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving {mediaUrls.length} item(s)...
              </>
            ) : (
              `Save ${mediaUrls.length > 0 ? mediaUrls.length : ''} to ${category === 'Logo' ? 'Brand Partners' : (category === 'Highlight' ? 'Highlights' : 'Portfolio')}`
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}

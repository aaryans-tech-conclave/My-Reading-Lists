import React, { useState } from 'react';
import { X, Camera, Calendar, User, Download, Trash2, Maximize2 } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { BookcaseSnapshot } from '../../types';

interface SnapshotGalleryModalProps {
  onClose: () => void;
}

export const SnapshotGalleryModal: React.FC<SnapshotGalleryModalProps> = ({ onClose }) => {
  const { snapshots, deleteSnapshot } = useData();
  const { isAdmin } = useAuth();
  const [activeFullView, setActiveFullView] = useState<BookcaseSnapshot | null>(null);

  const handleDownload = (snapshot: BookcaseSnapshot) => {
    const a = document.createElement('a');
    a.href = snapshot.image_data;
    a.download = `folioread-bookcase-${snapshot.timestamp}.jpg`;
    a.click();
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Delete this bookcase snapshot?')) {
      await deleteSnapshot(id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-stone-900 rounded-3xl w-full max-w-4xl max-h-[90vh] shadow-2xl border border-stone-200 dark:border-stone-800 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100 flex items-center space-x-2">
                <span>Bookcase Snapshot Log</span>
                <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                  {snapshots.length} of 10 Stored
                </span>
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Community arrangements archive (strictly capped to 10 latest snapshots)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {snapshots.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <Camera className="w-10 h-10 text-stone-300 dark:text-stone-700 mx-auto" />
              <p className="text-sm font-medium text-stone-600 dark:text-stone-400">
                No bookcase snapshots have been taken yet.
              </p>
              <p className="text-xs text-stone-400">
                Open the Digital Library bookcase view and click "Take Snapshot" to archive your arrangement!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {snapshots.map((snap) => {
                return (
                  <div
                    key={snap.id}
                    onClick={() => setActiveFullView(snap)}
                    className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Thumbnail */}
                      <div className="aspect-16/10 rounded-xl overflow-hidden bg-black relative border border-stone-300 dark:border-stone-800">
                        <img
                          src={snap.image_data}
                          alt={snap.title}
                          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                        />
                        <div className="absolute top-2 right-2 flex items-center space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(snap);
                            }}
                            title="Download Image"
                            className="p-1.5 rounded-lg bg-black/60 hover:bg-black/90 text-white backdrop-blur-xs transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          {isAdmin && (
                            <button
                              onClick={(e) => handleDelete(e, snap.id)}
                              title="Delete Snapshot"
                              className="p-1.5 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white backdrop-blur-xs transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="mt-3">
                        <h3 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm">
                          {snap.title}
                        </h3>
                        <div className="flex items-center space-x-3 text-[11px] text-stone-500 dark:text-stone-400 mt-1">
                          <span className="flex items-center space-x-1">
                            <User className="w-3 h-3 text-stone-400" />
                            <span>{snap.created_by_name}</span>
                          </span>
                          <span>•</span>
                          <span className="flex items-center space-x-1 font-mono">
                            <Calendar className="w-3 h-3 text-stone-400" />
                            <span>{new Date(snap.timestamp).toLocaleDateString()}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-stone-200/70 dark:border-stone-700/70 flex items-center justify-between text-[11px]">
                      <span className="text-amber-700 dark:text-amber-400 font-semibold">
                        {snap.book_count || 'All'} volumes arranged
                      </span>
                      <span className="text-stone-400 group-hover:text-stone-600 dark:group-hover:text-stone-300 font-medium">
                        Click to enlarge →
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800 flex justify-between items-center text-xs text-stone-500">
          <span>Snapshots preserve arrangement layouts for inspiration</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-medium hover:bg-stone-300 transition-colors"
          >
            Close Log
          </button>
        </div>

      </div>

      {/* Enlarged Full Resolution Modal */}
      {activeFullView && (
        <div
          onClick={() => setActiveFullView(null)}
          className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 cursor-zoom-out animate-in fade-in"
        >
          <div className="max-w-4xl max-h-[90vh] flex flex-col items-center">
            <img
              src={activeFullView.image_data}
              alt={activeFullView.title}
              className="max-w-full max-h-[80vh] rounded-2xl shadow-2xl border border-stone-800 object-contain"
            />
            <div className="mt-4 text-center text-white space-y-1">
              <h3 className="font-serif font-bold text-lg">{activeFullView.title}</h3>
              <p className="text-xs text-stone-400">
                Arranged by {activeFullView.created_by_name} on {new Date(activeFullView.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

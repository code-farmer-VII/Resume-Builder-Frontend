import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Navbar } from '../components/Navbar';
import { Resume } from '../lib/type';
import { useAuth } from '../context/AuthContext';
import {
  Calendar,
  Download,
  Eye,
  Pencil,
  Share2,
  Loader2,
  CheckCircle,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { generatePDF } from '../utils/pdfGenerator';
import { ResumeTemplate } from '../components/ResumeTemplate';
import axios from '../utils/axios';
import { useNavigate } from 'react-router-dom';

export const ResumeHistory: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState<Resume | null>(null);

  useEffect(() => {
    loadResumes();
  }, [user]);

  const getCsrfCookie = async () => {
    try {
      await axios.get('/sanctum/csrf-cookie', { withCredentials: true });
    } catch (error) {
      alert('There is an issue getting the sanctum CSRF cookie');
      console.error('Failed to get CSRF cookie', error);
    }
  };

  const loadResumes = async () => {
    if (!user) return;
    await getCsrfCookie();
    try {
      const response = await axios.get(`/api/resumes/${user.id}`);
      setResumes(response.data || []);
    } catch (error) {
      alert('Error loading resumes.');
      console.error('Error loading resumes:', error);
      setResumes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (resume: Resume) => setSelectedResume(resume);

  const handleEdit = (resume: Resume) => {
    navigate('/builder', { state: { resume } });
  };

  const handleDeleteClick = (resume: Resume) => {
    setResumeToDelete(resume);
  };

  const handleConfirmDelete = async () => {
    if (!resumeToDelete) return;
    try {
      await axios.delete(`/api/resumes/${resumeToDelete.id}`);
      setResumes(resumes.filter((r) => r.id !== resumeToDelete.id));
      setResumeToDelete(null);
      alert('Resume deleted successfully.');
    } catch (error) {
      console.error('Error deleting resume:', error);
      alert('Failed to delete resume. Please try again.');
      setResumeToDelete(null);
    }
  };

const handleDownload = async (resume: Resume) => {
  try {
    await generatePDF(resume, `${resume.title || 'resume'}.pdf`);
    
    // Show banner only in preview mode; harmless if set in list mode (banner hidden by conditional)
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Failed to generate PDF. Please try again.');
  }
};

  // const handleDownload = async (resume: Resume) => {
  //   try {
  //     setSelectedResume(resume);
  //     setTimeout(async () => {
  //       await generatePDF('resume-content', `${resume.title || 'resume'}.pdf`);
  //       setDownloadSuccess(true);
  //       setTimeout(() => setDownloadSuccess(false), 3000);
  //     }, 500);
  //   } catch (error) {
  //     console.error('Error generating PDF:', error);
  //     alert('Failed to generate PDF. Please try again.');
  //   }
  // };

  const handleShare = (resume: Resume) => {
    setSelectedResume(resume);
    setShowShareDialog(true);
  };

  const shareOnLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${window.location.origin}`,
      '_blank'
    );
  };

  const shareOnTwitter = () => {
    const text = encodeURIComponent(
      `Just created my professional resume! Check it out.`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.origin);
    alert('Link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] flex items-center justify-center">
        <Loader2 className="animate-spin text-pink-400" size={48} />
      </div>
    );
  }

  if (selectedResume) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] py-12 px-4 text-white">
          <div className="max-w-6xl mx-auto bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-10">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent mb-3">
                Resume Preview
              </h1>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setSelectedResume(null)}
                  className="border-white/30 hover:bg-white/20 text-white"
                >
                  Back to History
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleDownload(selectedResume)}
                >
                  <Download size={18} className="mr-2" />
                  Download PDF
                </Button>
                <Button onClick={() => handleShare(selectedResume)}>
                  <Share2 size={18} className="mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {downloadSuccess && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-green-600" size={24} />
                  <div>
                    <p className="font-semibold text-green-900">
                      Resume Downloaded Successfully!
                    </p>
                    <p className="text-sm text-green-700">
                      Your resume has been saved to your downloads folder.
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={shareOnLinkedIn}>
                    Share on LinkedIn
                  </Button>
                  <Button size="sm" variant="outline" onClick={shareOnTwitter}>
                    Share on Twitter
                  </Button>
                  <Button size="sm" variant="ghost" onClick={copyLink}>
                    Copy Link
                  </Button>
                </div>
              </div>
            )}

            <ResumeTemplate data={selectedResume} />
          </div>

          {showShareDialog && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <Card className="max-w-md w-full">
                <CardBody>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Share Your Resume
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Choose how you want to share your resume:
                  </p>
                  <div className="space-y-3">
                    <Button
                      variant="primary"
                      className="w-full"
                      onClick={shareOnLinkedIn}
                    >
                      Share on LinkedIn
                    </Button>
                    <Button
                      variant="secondary"
                      className="w-full"
                      onClick={shareOnTwitter}
                    >
                      Share on Twitter
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={copyLink}
                    >
                      Copy Shareable Link
                    </Button>
                  </div>
                </CardBody>
                <CardFooter>
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => setShowShareDialog(false)}
                  >
                    Close
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </div>
      </>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] py-12 px-4 text-white">
        <div className="max-w-7xl mx-auto p-10">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent mb-3">
              Resume History
            </h1>
            <p className="text-gray-300">
              View, download, and manage your previously created resumes
            </p>
          </div>

          {resumes.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-600 mb-6">
                No resumes found. Create your first resume!
              </p>
              <Button onClick={() => (window.location.href = '/builder')}>
                Create Resume
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resumes.map((resume) => (
                <Card
                  key={resume.id}
                  className="relative bg-white/5 border-white/10 hover:bg-white/10 transition-colors"
                >
                  <CardBody>
                    <div className="mb-4">
                      <button
                        onClick={() => handleDeleteClick(resume)}
                        className="absolute top-3 right-3 text-red-400/70 hover:text-red-400 transition-colors z-10"
                        aria-label="Delete resume"
                      >
                        <Trash2 size={18} />
                      </button>
                      <h3 className="text-xl font-bold text-white mb-2">
                        {resume.title}
                      </h3>
                      <p className="text-sm text-gray-300 mb-1">
                        {resume.full_name}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Calendar size={14} />
                        <span>
                          {new Date(resume.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {resume.ai_enhanced && (
                        <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">
                          <span>AI Enhanced</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleView(resume)}
                        className="w-full bg-white/10 hover:bg-white/20 border border-white/20"
                      >
                        <Eye size={16} className="mr-2" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(resume)}
                        className="w-full bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 text-yellow-300"
                      >
                        <Pencil size={16} className="mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleDownload(resume)}
                        className="w-full bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/30"
                      >
                        <Download size={16} className="mr-2" />
                        Download
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleShare(resume)}
                        className="w-full bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30"
                      >
                        <Share2 size={16} className="mr-2" />
                        Share
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </div>

        {resumeToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <Card className="max-w-md w-full bg-slate-900 border-slate-700 text-white">
              <CardBody>
                <div className="text-center">
                  <AlertTriangle className="mx-auto h-12 w-12 text-red-400" />
                  <h2 className="mt-4 text-2xl font-bold mb-2">
                    Confirm Deletion
                  </h2>
                  <p className="text-slate-400 mb-6">
                    Are you sure you want to delete the resume titled "
                    {resumeToDelete.title}"? This action cannot be undone.
                  </p>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setResumeToDelete(null)}
                    className="border-slate-600 hover:bg-slate-800"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="danger"
                    onClick={handleConfirmDelete}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

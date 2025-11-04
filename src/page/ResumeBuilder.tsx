import React, { useEffect, useState } from 'react';
import { ResumeForm } from '../components/ResumeForm';
import { ResumeTemplate } from '../components/ResumeTemplate';
import { Button } from '../components/ui/Button';
import { Navbar } from '../components/Navbar';
import { Resume } from '../lib/type';
import { useAuth } from '../context/AuthContext';
import { Loader2, Sparkles, Download, CheckCircle } from 'lucide-react';
import axios from '../utils/axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { generatePDF } from '../utils/pdfGenerator';

export const ResumeBuilder: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [step, setStep] = useState<'form' | 'preview'>('form');
  const [resumeData, setResumeData] = useState<Partial<Resume> | null>(null);
  const [loading, setLoading] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const navigate = useNavigate();
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    console.log("Current resumeData:", resumeData);
    console.log("Current user ID:", user?.id);
    
    if (location.state?.resume) {
      const resumeToEdit = location.state.resume as Resume;
      setResumeData(resumeToEdit);
      setStep('form');
      setIsUpdate(true);
    }
  }, [location.state]);

  const getCsrfCookie = async () => {
    try {
      await axios.get('/sanctum/csrf-cookie', { withCredentials: true });
    } catch (error) {
      alert("there is an issue on send the sanctum")
      console.log('Failed to get CSRF cookie', error)
      console.error('Failed to get CSRF cookie', error);
    }
  };

  const handleSaveOrUpdate = async () => {
    if (!resumeData || !user) return;
    setLoading(true);
    try {
      await getCsrfCookie();
      if (isUpdate && resumeData.id) {
        // Update existing resume
        alert(`${resumeData.id} resume update ${isUpdate}`)
        const response = await axios.put(`/api/resumes/${resumeData.id}`, resumeData);
        setResumeData(response.data);
      alert(`Resume updated successfully! ${resumeData.id}`);
      } else {
        // Save new resume
        const response = await axios.post('/api/resumes', resumeData);
        setResumeData(response.data); // Update state with the saved resume, including the new ID
        setIsUpdate(true); // Switch to update mode
        alert('Resume saved successfully!');
      }
    } catch (error) {
      console.error('Error saving resume:', error);
      alert('Failed to save resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

const handleDownload = async () => {
  if (!resumeData) return;

  try {
    await generatePDF(resumeData as Resume, `${resumeData.title || 'resume'}.pdf`);
    
    // Show success banner
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Failed to generate PDF. Please try again.');
  }
};

  // const handleDownload = async () => {
  //   if (!resumeData) return;
  //   try {
  //     await generatePDF('resume-content', `${resumeData.title || 'resume'}.pdf`);
  //   } catch (error) {
  //     console.error('Error generating PDF:', error);
  //   }
  // };

  const handleFormSubmit = async (data: any) => {

    setLoading(true);
    try {
      const resumeWithUser = {
        ...resumeData, // Preserve existing data like id
        ...data,
        user_id: user?.id,
        ai_enhanced: resumeData?.ai_enhanced || false,
      };
      setResumeData(resumeWithUser);
      setStep('preview');
    } catch (error) {
      console.error('Error processing form:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnhance = async () => {
    getCsrfCookie();
    if (!resumeData) return;
    setEnhancing(true);
    try {
      const experienceDescriptions: string[] = [];
      resumeData.experience?.forEach((exp) => {
        if (exp.description) {
          experienceDescriptions.push(...exp.description);
        }
      });

      const projectDescriptions: string[] = [];
      resumeData.projects?.forEach((proj) => {
        if (proj.description) {
          projectDescriptions.push(proj.description);
        }
      });

      const response = await axios.post('/api/enhance-resume', {
        summary: resumeData.summary || '',
        experienceDescriptions: experienceDescriptions,
        projectDescriptions: projectDescriptions,
      });

      const { enhancedSummary, enhancedExperienceDescriptions, enhancedProjectDescriptions } = response.data;

      const updatedExperience = resumeData.experience ? [...resumeData.experience] : [];
      let expDescIndex = 0;

      updatedExperience.forEach((exp) => {
        const descCount = exp.description?.length || 0;
        if (descCount > 0 && enhancedExperienceDescriptions) {
          exp.description = enhancedExperienceDescriptions.slice(expDescIndex, expDescIndex + descCount);
          expDescIndex += descCount;
        }
      });

      const updatedProjects = resumeData.projects ? [...resumeData.projects] : [];
      if (enhancedProjectDescriptions) {
        updatedProjects.forEach((proj, index) => {
          if (proj.description && enhancedProjectDescriptions[index]) {
            proj.description = enhancedProjectDescriptions[index];
          }
        });
      }

      setResumeData({
        ...resumeData,
        summary: enhancedSummary || resumeData.summary,
        experience: updatedExperience,
        projects: updatedProjects,
        ai_enhanced: true,
      });
      alert("Enhancement complete! Review the updated resume.");
    } catch (error) {
      alert("there is an error on enhancing the resume")
      console.error('Error enhancing resume:', error);
      alert('Failed to enhance resume. Please try again.');
    } finally {
      setEnhancing(false);
    }
  };



  const handleEdit = (field: string, value: any) => {
    getCsrfCookie();
    if (resumeData) {
      setResumeData({ ...resumeData, [field]: value });
    }
  };

  // ==== FORM PAGE ====
  if (step === 'form') {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-4xl shadow-md shadow-blue-400/30 p-10 text-white">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent mb-3">
                Create Your Resume
              </h1>
              <p className="text-gray-300">
                Fill out the form below to generate your professional resume
              </p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-pink-400" size={48} />
              </div>
            ) : (
              <ResumeForm onSubmit={handleFormSubmit} initialData={location.state?.resume} />
            )}
          </div>
        </div>
      </>
    );
  }

  // // ==== PREVIEW PAGE ====
  // return (
  //   <>
  //     <Navbar />
  //     <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] py-12 px-4">
  //       <div className="max-w-6xl mx-auto bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-10 text-white">
  //         <div className="text-center mb-8">
  //           <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent mb-3">
  //             Resume Preview
  //           </h1>
  //           <p className="text-gray-300">Review and edit your resume before saving</p>
  //         </div>

  //         <div className="flex justify-center gap-4 mb-8">
  //           <Button
  //             variant="outline"
  //             onClick={() => setStep('form')}
  //             className="border border-white/30 hover:bg-white/20 text-white"
  //           >
  //             Back to Form
  //           </Button>

  //           {!resumeData?.ai_enhanced && (
  //             <Button
  //               variant="secondary"
  //               onClick={handleEnhance}
  //               disabled={enhancing}
  //               className="bg-gradient-to-r from-pink-500 to-blue-500 hover:opacity-90 text-white shadow-lg"
  //             >
  //               {enhancing ? (
  //                 <>
  //                   <Loader2 className="animate-spin mr-2" size={18} />
  //                   Enhancing...
  //                 </>
  //               ) : (
  //                 <>
  //                   <Sparkles className="mr-2" size={18} />
  //                   Enhance with AI
  //                 </>
  //               )}
  //             </Button>
  //           )}

  //           <Button
  //             onClick={handleSaveOrUpdate}
  //             disabled={loading}
  //             className="bg-gradient-to-r from-blue-500 to-pink-500 hover:opacity-90 text-white shadow-lg"
  //           >
  //             {loading ? (
  //               <>
  //                 <Loader2 className="animate-spin mr-2" size={18} />
  //                 {isUpdate ? 'Updating...' : 'Saving...'}
  //               </>
  //             ) : (
  //               isUpdate ? 'Update Resume' : 'Save Resume'
  //             )}
  //           </Button>

  //           {isUpdate && (
  //             <Button
  //               variant="secondary"
  //               onClick={handleDownload}
  //               className="bg-green-500 hover:bg-green-600 text-white"
  //             >
  //               <Download size={18} className="mr-2" />
  //               Download PDF
  //             </Button>
  //           )}
  //         </div>

  //         <div className="text-center text-sm text-gray-400 mb-6">
  //           <p>Click on text in the preview to edit it directly</p>
  //         </div>

  //         <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-10">
  //           {resumeData && (
  //             <ResumeTemplate
  //               data={resumeData as Resume}
  //               editable={false}
  //             />
  //           )}
  //         </div>
  //       </div>
  //     </div>
  //   </>
  // );

  // ==== PREVIEW PAGE ====
return (
  <>
    <Navbar />
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] py-12 px-4">
      <div className="max-w-6xl mx-auto bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] rounded-2xl shadow-2xl p-10 text-white">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent mb-3">
            Resume Preview
          </h1>
          <p className="text-gray-300">Review and edit your resume before saving</p>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <Button
            variant="outline"
            onClick={() => setStep('form')}
            className="border border-white/30 hover:bg-white/20 text-white"
          >
            Back to Form
          </Button>

        
            <Button
              variant="secondary"
              onClick={handleEnhance}
              disabled={enhancing}
              className="bg-gradient-to-r from-pink-500 to-blue-500 hover:opacity-90 text-white shadow-lg"
            >
              {enhancing ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={18} />
                  Enhancing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2" size={18} />
                  Enhance with AI
                </>
              )}
            </Button>
       

          <Button
            onClick={handleSaveOrUpdate}
            disabled={loading}
            className="bg-gradient-to-r from-blue-500 to-pink-500 hover:opacity-90 text-white shadow-lg"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={18} />
                {isUpdate ? 'Updating...' : 'Saving...'}
              </>
            ) : (
              isUpdate ? 'Update Resume' : 'Save Resume'
            )}
          </Button>

          {isUpdate && (
            <Button
              variant="secondary"
              onClick={handleDownload}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              <Download size={18} className="mr-2" />
              Download PDF
            </Button>
          )}
        </div>

        {/* SUCCESS BANNER */}
        {downloadSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between animate-fade-in">
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
          </div>
        )}

        <div className="text-center text-sm text-gray-400 mb-6">
          <p>Click on text in the preview to edit it directly</p>
        </div>

        <div className="bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] rounded-2xl shadow-2xl p-10">
          {resumeData && (
            <ResumeTemplate
              data={resumeData as Resume}
              editable={false}
            />
          )}
        </div>
      </div>
    </div>
  </>
);
};

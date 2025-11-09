import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { dummyResumeData } from "../assets/assets";
import {
  ArrowLeftIcon,
  Briefcase,
  FileText,
  GraduationCap,
  User,
  FolderIcon,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Share2Icon,
  EyeIcon,
  EyeOffIcon,
  DownloadIcon,
} from "lucide-react";
import PersonalInfoForm from "../components/PersonalInfoForm";
import ResumePreview from "../components/ResumePreview";
import TemplateSelector from "../components/TemplateSelector";
import ColorPicker from "../components/ColorPicker";
import ProfessionalSummary from "../components/ProfessionalSummary";
import ExperienceForm from "../components/ExperienceForm";
import EducationForm from "../components/EducationForm";
import ProjectForm from "../components/ProjectForm";
import SkillsForm from "../components/SkillsForm";

// imports for PDF generation
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const ResumeBuilder = () => {
  const { resumeId } = useParams();

  const [resumeData, setResumeData] = useState({
    _id: "",
    title: "",
    personal_info: {},
    professional_summary: "",
    education: [],
    experience: [],
    projects: [], // keep plural consistent
    skills: [],
    template: "classic",
    accent_color: "#3B82F6",
    public: false,
  });
  const [activeSectionIdx, setActiveSectionIdx] = useState(0);
  const [removeBackground, setRemoveBackground] = useState(false);

  const loadExistingResume = async () => {
    const resume = dummyResumeData.find((r) => r._id === resumeId);
    if (resume) {
      setResumeData(resume);
      document.title = `Editing Resume - ${resume.title}`;
    }
  };

  // include resumeId so effect runs when id changes
  useEffect(() => {
    loadExistingResume();
  }, [resumeId]);

  const changeResumeVisiblity = async () => {
    setResumeData((prev) => ({ ...prev, public: !prev.public }));
  };

  // improved share with fallback to clipboard
  const handleShare = async () => {
    if (!resumeData._id) {
      alert("Resume not saved yet. Please save before sharing.");
      return;
    }

    // Construct a robust frontend url
    const base = window.location.origin; // e.g. https://example.com
    const resumeUrl = `${base}/view/${resumeData._id}`;

    // Try Web Share API first
    if (navigator.share) {
      try {
        await navigator.share({
          title: resumeData.title || "My Resume",
          text: "Check out my resume",
          url: resumeUrl,
        });
        return;
      } catch (err) {
        // user cancelled or error; proceed to fallback
        console.warn("navigator.share failed:", err);
      }
    }

    // Fallback: copy to clipboard
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(resumeUrl);
        alert("Resume URL copied to clipboard!");
        return;
      } catch (err) {
        console.warn("Clipboard write failed:", err);
      }
    }

    // Final fallback: prompt with the URL so user can copy manually
    window.prompt("Copy this resume URL:", resumeUrl);
  };

  // Use html2canvas + jsPDF to generate PDF and download automatically
  const handleDownload = async () => {
    window.print();
  };

  const sections = [
    { id: "personal", name: "Personal Info", icon: User },
    { id: "summary", name: "Summary", icon: FileText },
    { id: "experience", name: "Experience", icon: Briefcase },
    { id: "education", name: "Education", icon: GraduationCap },
    { id: "project", name: "Projects", icon: FolderIcon },
    { id: "skills", name: "Skills", icon: Sparkles },
  ];

  const activeSection = sections[activeSectionIdx];

  return (
    <div className="mt-10">
      <div>
        <Link
          to={"/app"}
          className="inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 transition-all"
        >
          <ArrowLeftIcon className="w-4 h-4" /> Back to Dashboard
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* left panel - form */}
          <div className="relative lg:col-span-5 rounded-lg overflow-hidden">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-1">
              <hr className="absolute top-0 left-0 right-0 border-2 border-gray-200" />
              <hr
                className="absolute top-0 left-0 h-1 bg-gradient-to-r from-green-500 to-green-600 border-none transition-all duration-300"
                style={{
                  width: `${(activeSectionIdx * 100) / (sections.length - 1)}%`,
                }}
              />

              <div className="flex justify-between items-center mb-6 border-b border-gray-300 py-1">
                <div className="flex justify-between items-center gap-2">
                  <TemplateSelector
                    selectedTemplate={resumeData.template}
                    onChange={(template) =>
                      setResumeData((prev) => ({ ...prev, template }))
                    }
                  />
                  <ColorPicker
                    selectedColor={resumeData.accent_color}
                    onChange={(color) =>
                      setResumeData((prev) => ({
                        ...prev,
                        accent_color: color,
                      }))
                    }
                  />
                </div>
                <div className="flex items-center">
                  {activeSectionIdx !== 0 && (
                    <button
                      onClick={() =>
                        setActiveSectionIdx((prevIdx) =>
                          Math.max(prevIdx - 1, 0)
                        )
                      }
                      className="flex items-center gap-1 p-3 rounded-l-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
                      disabled={activeSectionIdx === 0}
                    >
                      <ChevronLeft className="w-4 h-4" /> Previous
                    </button>
                  )}
                  <button
                    onClick={() =>
                      setActiveSectionIdx((prevIdx) =>
                        Math.min(prevIdx + 1, sections.length - 1)
                      )
                    }
                    className="flex items-center gap-1 p-3 rounded-l-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
                    disabled={activeSectionIdx === sections.length - 1}
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {activeSection.id === "personal" && (
                  <PersonalInfoForm
                    data={resumeData.personal_info}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        personal_info: data,
                      }))
                    }
                    removeBackground={removeBackground}
                    setRemoveBackground={setRemoveBackground}
                  />
                )}
                {activeSection.id === "summary" && (
                  <ProfessionalSummary
                    data={resumeData.professional_summary}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        professional_summary: data,
                      }))
                    }
                    setResumeData={setResumeData}
                  />
                )}
                {activeSection.id === "experience" && (
                  <ExperienceForm
                    data={resumeData.experience}
                    onChange={(data) =>
                      setResumeData((prev) => ({ ...prev, experience: data }))
                    }
                  />
                )}
                {activeSection.id === "education" && (
                  <EducationForm
                    data={resumeData.education}
                    onChange={(data) =>
                      setResumeData((prev) => ({ ...prev, education: data }))
                    }
                  />
                )}
                {activeSection.id === "project" && (
                  // pass the plural projects array so form edits update correctly
                  <ProjectForm
                    data={resumeData.projects}
                    onChange={(data) =>
                      setResumeData((prev) => ({ ...prev, projects: data }))
                    }
                  />
                )}
                {activeSection.id === "skills" && (
                  <SkillsForm
                    data={resumeData.skills}
                    onChange={(data) =>
                      setResumeData((prev) => ({ ...prev, skills: data }))
                    }
                  />
                )}
              </div>
            </div>
          </div>

          {/* right panel - preview */}
          <div className="lg:col-span-7 max-lg:mt-6">
            <div className="relative w-full">
              <div className="absolute bottom-3 left-0 right-0 flex items-center justify-end gap-2">
                {resumeData.public && (
                  <button
                    onClick={handleShare}
                    className="flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 rounded-lg ring-blue-300 hover:ring transition-colors"
                  >
                    <Share2Icon className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={changeResumeVisiblity}
                  className="flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 rounded-lg ring-blue-300 hover:ring transition-colors"
                >
                  {resumeData.public ? (
                    <EyeIcon className="w-4 h-4" />
                  ) : (
                    <EyeOffIcon className="w-4 h-4" />
                  )}
                  {resumeData.public ? " Public" : " Private"}
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-green-100 to-green-200 text-green-600 rounded-lg ring-green-300 hover:ring transition-colors"
                >
                  <DownloadIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* pass id so html2canvas can capture this container */}
            <ResumePreview
              id="resume-preview"
              data={resumeData}
              template={resumeData.template}
              accentColor={resumeData.accent_color}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;

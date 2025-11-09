import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FilePenLineIcon, TrashIcon, PencilIcon } from "lucide-react";
import { dummyResumeData } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import OpenModal from "./OpenModal";

const DashboardGetResume = () => {
  const navigate = useNavigate();
  const colors = ["#3B82F6", "#EF4444", "#10B981", "#8B5CF6", "#F59E0B"];
  const [getResumes, setAllGetResumes] = useState([]);
  const [editResumeId, setEditResumeId] = useState(false);

  const loadAllResumes = async () => {
    setAllGetResumes(dummyResumeData);
  };

  useEffect(() => {
    loadAllResumes();
  }, []);

  return (
    <div className="text-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-3">My Resumes</h1>
          <p className="text-gray-400 text-lg">
            Manage and edit your professional resumes
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:flex flex-wrap gap-4">
          {getResumes.map((resume, idx) => {
            const baseColor = colors[idx % colors.length];
            return (
              <button
                key={idx}
                onClick={() => navigate(`/app/builder/${resume._id}`)}
                className="relative w-full sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 border group hover:shadow-lg transition-all duration-30 cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, ${baseColor}10, ${baseColor}40)`,
                  borderColor: baseColor + "40",
                }}
              >
                <FilePenLineIcon
                  className="size-7 group-hover:scale-105 transition-all"
                  style={{ color: baseColor }}
                />
                <p
                  className="text-sm group-hover:scale-105 transition-all px-2 text-center"
                  style={{ color: baseColor }}
                >
                  {resume.title}
                </p>
                <p
                  className="absolute bottom-1 text-[11px] text-slate-400 group-hover:text-slate-500 transition-all duration-300 px-2 text-center"
                  style={{ color: baseColor + "90" }}
                >
                  Updated on {new Date(resume.updatedAt).toLocaleDateString()}{" "}
                </p>

                <div className="absolute top-1 right-1 hidden group-hover:flex items-center gap-1">
                  <TrashIcon className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors" />
                  <PencilIcon
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditResumeId(resume._id);
                    }}
                    className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors cursor-pointer"
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {editResumeId && (
        <OpenModal
          mode="edit"
          defaultName={
            getResumes.find((r) => r._id === editResumeId)?.title || ""
          }
          onClose={() => setEditResumeId(false)}
          onSubmit={({ name }) => {
            setAllGetResumes((prev) =>
              prev.map((r) =>
                r._id === editResumeId ? { ...r, title: name } : r
              )
            );
          }}
        />
      )}
    </div>
  );
};

export default DashboardGetResume;

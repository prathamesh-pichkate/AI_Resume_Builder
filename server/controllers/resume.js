import imageKit from "../config/imageKit";
import Resume from "../models/Resume";

//Creating a new resume: POST: /api/resume/create
export const createResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { title } = req.body;

    //create new resume
    const newResume = await Resume.create({ userId, title });

    return res
      .status(201)
      .json({ message: "Resume created successfully.", resume: newResume });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

//Delete a resume: DELETE: /api/resume/delete
export const deleteResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;

    await Resume.findOneAndDelete({ userId, _id: resumeId });
    return res.status(200).json({ message: "Resume Deleted Successfully." });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

//Get user resume by ID: GET: /api/resume/get
export const getResumeById = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;

    const resume = await Resume.findOne({ userId, _id: resumeId });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found." });
    }

    return res.status(200).json({ resume });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

//Get resume by id public: GET: /api/resume/public
export const getResumePublicById = async (req, res) => {
  try {
    const { resumeId } = req.params;

    const resume = await Resume.findOne({ public: true, _id: resumeId });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found." });
    }

    return res.status(200).json({ resume });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

//Update resume by ID: PUT: /api/resume/update
export const updateResumeById = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId, resumeData, removeBackground } = req.body;

    const image = req.file;

    let resumeDataCopy = JSON.parse(resumeData);

    if (image) {
      const response = await imageKit.files.upload({
        file: fs.createReadStream(image.path),
        fileName: "resume.jpg",
        folder: "user-resumes",
        transformation: {
          pre:
            "w-300,h-300,fo-face,z-0.75" +
            (removeBackground ? ",e-bgremove" : ""),
        },
      });

      resumeDataCopy.personal_info.image = response.url;
    }

    const resume = await Resume.findByIdAndUpdate(
      { userId, _id: resumeId },
      resumeDataCopy,
      { new: true }
    );

    return res
      .status(200)
      .json({ message: "Resume updated successfully.", resume });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

import { createContext, useState } from "react";

export const InstructorContext = createContext();

const initialCourseSettingsData = {
  openForEnrollment: true,
  enrollmentStartDate: new Date(),
  enrollmentEndDate: new Date(),
  maxStudents: 0,
  allowDiscussions: true,
  allowReviews: true,
  courseAccess: "lifetime",
  accessDuration: 0,
};

export function InstructorContextProvider({ children }) {
  const [instructorCoursesList, setInstructorCoursesList] = useState([]);
  const [currentEditedCourseId, setCurrentEditedCourseId] = useState(null);
  
  // Course Landing Form Data
  const [courseLandingFormData, setCourseLandingFormData] = useState({
    title: "",
    category: "",
    description: "",
    thumbnail: null,
    pricing: 0,
  });

  // Course Curriculum Form Data
  const [courseCurriculumFormData, setCourseCurriculumFormData] = useState({
    sections: [],
  });

  // Course Settings Form Data
  const [courseSettingsFormData, setCourseSettingsFormData] = useState(initialCourseSettingsData);

  const value = {
    instructorCoursesList,
    setInstructorCoursesList,
    currentEditedCourseId,
    setCurrentEditedCourseId,
    courseLandingFormData,
    setCourseLandingFormData,
    courseCurriculumFormData,
    setCourseCurriculumFormData,
    courseSettingsFormData,
    setCourseSettingsFormData,
  };

  return (
    <InstructorContext.Provider value={value}>
      {children}
    </InstructorContext.Provider>
  );
}

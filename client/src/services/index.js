import axiosInstance from "@/api/axiosInstance";

// Centralized error handling wrapper
async function apiWrapper(apiCall) {
  try {
    const { data } = await apiCall();
    return data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error.response?.data || error.message || "Unknown error occurred";
  }
}

export async function registerService(formData) {
  return await apiWrapper(() =>
    axiosInstance.post("/auth/register", {
      ...formData,
      role: "user",
    })
  );
}

export async function loginService(formData) {
  return await apiWrapper(() =>
    axiosInstance.post("/auth/login", formData)
  );
}

export async function checkAuthService() {
  return await apiWrapper(() =>
    axiosInstance.get("/auth/check-auth")
  );
}

export async function mediaUploadService(formData, onProgressCallback) {
  return await apiWrapper(() =>
    axiosInstance.post("/media/upload", formData, {
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        const progressData = {
          percentCompleted,
          loaded: progressEvent.loaded,
          total: progressEvent.total,
        };
        onProgressCallback(progressData); // Updated to send detailed progress info
      },
    })
  );
}

export async function mediaDeleteService(id) {
  return await apiWrapper(() =>
    axiosInstance.delete(`/media/delete/${id}`)
  );
}

export async function fetchInstructorCourseListService() {
  return await apiWrapper(() =>
    axiosInstance.get(`/instructor/course/get`)
  );
}

export async function addNewCourseService(formData) {
  return await apiWrapper(() =>
    axiosInstance.post(`/instructor/course/add`, formData)
  );
}

export async function fetchInstructorCourseDetailsService(id) {
  return await apiWrapper(() =>
    axiosInstance.get(`/instructor/course/get/details/${id}`)
  );
}

export async function updateCourseByIdService(id, formData) {
  return await apiWrapper(() =>
    axiosInstance.put(`/instructor/course/update/${id}`, formData)
  );
}

export async function mediaBulkUploadService(formData, onProgressCallback) {
  return await apiWrapper(() =>
    axiosInstance.post("/media/bulk-upload", formData, {
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        const progressData = {
          percentCompleted,
          loaded: progressEvent.loaded,
          total: progressEvent.total,
        };
        onProgressCallback(progressData); // Updated to send detailed progress info
      },
    })
  );
}

export async function fetchStudentViewCourseListService(query) {
  return await apiWrapper(() =>
    axiosInstance.get(`/student/course/get?${query}`)
  );
}

export async function fetchStudentViewCourseDetailsService(courseId) {
  return await apiWrapper(() =>
    axiosInstance.get(`/student/course/get/details/${courseId}`)
  );
}

export async function checkCoursePurchaseInfoService(courseId, studentId) {
  return await apiWrapper(() =>
    axiosInstance.get(
      `/student/course/purchase-info/${courseId}/${studentId}`
    )
  );
}

export async function createPaymentService(formData) {
  return await apiWrapper(() =>
    axiosInstance.post(`/student/order/create`, formData)
  );
}

export async function captureAndFinalizePaymentService(
  paymentId,
  payerId,
  orderId
) {
  return await apiWrapper(() =>
    axiosInstance.post(`/student/order/capture`, {
      paymentId,
      payerId,
      orderId,
    })
  );
}

export async function fetchStudentBoughtCoursesService(studentId) {
  return await apiWrapper(() =>
    axiosInstance.get(`/student/courses-bought/get/${studentId}`)
  );
}

export async function getCurrentCourseProgressService(userId, courseId) {
  return await apiWrapper(() =>
    axiosInstance.get(`/student/course-progress/get/${userId}/${courseId}`)
  );
}

export async function markLectureAsViewedService(userId, courseId, lectureId) {
  return await apiWrapper(() =>
    axiosInstance.post(`/student/course-progress/mark-lecture-viewed`, {
      userId,
      courseId,
      lectureId,
    })
  );
}

export async function resetCourseProgressService(userId, courseId) {
  return await apiWrapper(() =>
    axiosInstance.post(`/student/course-progress/reset-progress`, {
      userId,
      courseId,
    })
  );
}

// Discussion Services
export async function createDiscussionService(formData) {
  return await apiWrapper(() =>
    axiosInstance.post("/discussions", formData)
  );
}

export async function getLectureDiscussionsService(courseId, lectureId) {
  return await apiWrapper(() =>
    axiosInstance.get(`/discussions/${courseId}/${lectureId}`)
  );
}

export async function addReplyService(discussionId, content) {
  return await apiWrapper(() =>
    axiosInstance.post(`/discussions/${discussionId}/reply`, { content })
  );
}

export async function toggleLikeService(discussionId) {
  return await apiWrapper(() =>
    axiosInstance.post(`/discussions/${discussionId}/like`)
  );
}

export async function togglePinService(discussionId) {
  return await apiWrapper(() =>
    axiosInstance.post(`/discussions/${discussionId}/pin`)
  );
}

export async function toggleResolvedService(discussionId) {
  return await apiWrapper(() =>
    axiosInstance.post(`/discussions/${discussionId}/resolve`)
  );
}

// Instructor Discussion Services
export async function getCourseDiscussionsService(courseId) {
  return await apiWrapper(() =>
    axiosInstance.get(`/discussions/course/${courseId}`)
  );
}

export async function deleteDiscussionService(discussionId) {
  return await apiWrapper(() =>
    axiosInstance.delete(`/discussions/${discussionId}`)
  );
}

export async function getDiscussionStatsService(courseId) {
  return await apiWrapper(() =>
    axiosInstance.get(`/discussions/stats/${courseId}`)
  );
}

export async function togglePinDiscussionService(discussionId) {
  return await apiWrapper(() =>
    axiosInstance.patch(`/discussions/${discussionId}/pin`)
  );
}

export async function toggleResolveDiscussionService(discussionId) {
  return await apiWrapper(() =>
    axiosInstance.patch(`/discussions/${discussionId}/resolve`)
  );
}

export async function flagDiscussionService(discussionId) {
  return await apiWrapper(() =>
    axiosInstance.patch(`/discussions/${discussionId}/flag`)
  );
}

import axiosClient from './axiosClient';

/**
 * Lecture API Service
 * Handles all CRUD operations for lectures
 * Base endpoint: /lecture
 */

export const lectureAPI = {
  /**
   * Create a new lecture
   * POST /lecture/
   */
  create: (data) => axiosClient.post('/lecture/', data),

  /**
   * Get lecture by ID
   * POST /lecture/id/
   */
  getById: (id) => axiosClient.post('/lecture/id/', { id }),

  /**
   * Update lecture by ID
   * PUT /lecture/id/
   */
  update: (id, data) => axiosClient.put('/lecture/id/', { id, ...data }),

  /**
   * Delete lecture by ID
   * DELETE /lecture/id/
   */
  delete: (id) => axiosClient.delete('/lecture/id/', { data: { id } }),

  /**
   * Find lectures with optional filters
   * POST /lecture/find/
   */
  find: (filters = {}) => axiosClient.post('/lecture/find/', filters)
};

export default lectureAPI;

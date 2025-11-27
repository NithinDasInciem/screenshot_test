import ApiResponse from '../utils/ApiResponse.js';

const notFoundHandler = (req, res, next) => {
  ApiResponse.notFound('Route not found').send(res);
};

export default notFoundHandler;

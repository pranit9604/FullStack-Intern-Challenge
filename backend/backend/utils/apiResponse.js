export const sendResponse = (res, status, message, data = null, error = null) => {
    res.status(status).json({
        success: status >= 200 && status < 300, // Success if status code is 2xx
        message,
        data,
        error,
    });
};
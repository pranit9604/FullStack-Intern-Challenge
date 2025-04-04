// Validate email format
export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  
  // Validate name (20-60 characters)
  export const validateName = (name) => name.length >= 20 && name.length <= 60;
  
  // Validate address (max 400 characters)
  export const validateAddress = (address) => address.length <= 400;
  
  // Validate password (8-16 characters, at least one uppercase letter and one special character)
  export const validatePassword = (password) => /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,16})/.test(password);
  
  // Validate role (admin, user, store_owner)
  export const validateRole = (role) => {
    const validRoles = ["admin", "user", "store_owner"];
    return validRoles.includes(role);
  };
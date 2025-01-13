// src/utils/imagePaths.js
const getImagePath = (imageName) => {
    // Check if we're in development
    const isDevelopment = import.meta.env.MODE === 'development'
    
    if (isDevelopment) {
      // For development, use relative path
      return `/images/${imageName}`
    } else {
      // For production, use WordPress theme path
      return `/wp-content/themes/astra/react-app/dist/images/${imageName}`
    }
  }
  
  export default getImagePath
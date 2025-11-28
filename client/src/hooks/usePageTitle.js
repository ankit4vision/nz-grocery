import { useEffect } from 'react';

/**
 * Custom hook to manage page title dynamically
 * 
 * @param {string} title - The page title (will be appended to base title)
 * @param {string} description - Optional meta description
 * @param {object} options - Additional options
 * @param {string} options.baseTitle - Base title (default: "Farm2Fridge")
 * @param {string} options.separator - Separator between base and page title (default: " - ")
 */
export const usePageTitle = (title, description = null, options = {}) => {
  const { baseTitle = 'Farm2Fridge', separator = ' - ' } = options;

  useEffect(() => {
    // Set document title
    const fullTitle = title ? `${baseTitle}${separator}${title}` : baseTitle;
    document.title = fullTitle;

    // Update meta description if provided
    if (description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', description);
    }

    // Update Open Graph title if provided
    if (title) {
      let ogTitle = document.querySelector('meta[property="og:title"]');
      if (!ogTitle) {
        ogTitle = document.createElement('meta');
        ogTitle.setAttribute('property', 'og:title');
        document.head.appendChild(ogTitle);
      }
      ogTitle.setAttribute('content', fullTitle);
    }

    // Update Open Graph description if provided
    if (description) {
      let ogDescription = document.querySelector('meta[property="og:description"]');
      if (!ogDescription) {
        ogDescription = document.createElement('meta');
        ogDescription.setAttribute('property', 'og:description');
        document.head.appendChild(ogDescription);
      }
      ogDescription.setAttribute('content', description);
    }

    // Cleanup function to reset title when component unmounts
    return () => {
      document.title = baseTitle;
    };
  }, [title, description, baseTitle, separator]);
};

export default usePageTitle;


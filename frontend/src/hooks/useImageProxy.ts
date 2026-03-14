import { useState, useEffect } from "react";

export const useImageProxy = (imageUrl: string) => {
  const [displayUrl, setDisplayUrl] = useState(imageUrl);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if the URL is a MongoDB ObjectId (24 hex characters)
    const isMongoId = /^[0-9a-fA-F]{24}$/.test(imageUrl);
    
    if (isMongoId) {
      const fetchImage = async () => {
        setLoading(true);
        try {
          const response = await fetch(`http://localhost:5000/images/${imageUrl}`);
          if (response.ok) {
            const data = await response.json();
            setDisplayUrl(data.data);
          }
        } catch (error) {
          console.error("Error fetching image:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchImage();
    } else {
      setDisplayUrl(imageUrl);
      setLoading(false);
    }
  }, [imageUrl]);

  return { displayUrl, loading };
};

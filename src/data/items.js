// Central data file for items
import axios from 'axios';

// Placeholder arrays that will be populated by API data
export let foundItems = [];
export let lostItems = [];
export let allItems = [];

// Function to fetch all blogs from the API
export const fetchAllItems = async () => {
  try {
    const response = await axios.get('http://localhost:5000/blog/all');
    const blogsData = response.data.blogs;
    
    // Map data to format compatible with the app
    const formattedData = blogsData.map(item => ({
      id: item._id,
      type: item.type || 'found', // Default to 'found' if not specified
      title: item.title,
      description: item.description, // Updated from content to description
      image: item.photoPath,
      location: item.location || 'Not specified',
      date: item.date ? new Date(item.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      reporter: item.reporter || 'Unknown',
      phone: item.phone || 'Not provided' // Added phone field
    }));
    
    // Update the arrays
    allItems = formattedData;
    foundItems = formattedData.filter(item => item.type === 'found');
    lostItems = formattedData.filter(item => item.type === 'lost');
    
    return formattedData;
  } catch (error) {
    console.error('Error fetching blog data:', error);
    return [];
  }
};

// Initial fetch when the module is imported - 
// This is just to pre-load data but components should use fetchAllItems() directly 
// DataContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    year: 'all',
    topic: 'all',
    region: 'all',
    pestle: 'all',
    source: 'all',
    swot: 'all',
    country: 'all',
    city: 'all',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5173/api/data', { params: filters });;
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [filters]);

  return (
    <DataContext.Provider value={{ data, filters, setFilters }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
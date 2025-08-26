import { useState, useEffect } from 'react';
import axios from 'axios';

// Custom hook for API calls with loading and error states
export const useApi = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(url, options);
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!url) {
      setLoading(false);
      return;
    }
    fetchData();
  }, [url]);

  const refetch = () => {
    fetchData();
  };

  return { data, loading, error, refetch };
};

// Custom hook for POST requests
export const useApiPost = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const postData = async (url, postData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(url, postData);
      setData(response.data);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, postData };
};

// Custom hook for PUT requests
export const useApiPut = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const putData = async (url, putData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.put(url, putData);
      setData(response.data);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, putData };
};

// Custom hook for DELETE requests
export const useApiDelete = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteData = async (url) => {
    try {
      setLoading(true);
      setError(null);
      await axios.delete(url);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, deleteData };
};
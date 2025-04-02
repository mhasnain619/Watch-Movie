import axios from 'axios';

const API_KEY = '45d14068b7bc2e1455cea5e2fff3102c';
const BASE_URL = 'https://api.themoviedb.org/3';

export const fetchTrendingMovies = async () => {
    const response = await axios.get(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`);
    return response.data.results;
};

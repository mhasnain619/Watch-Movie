import React, { useEffect, useState } from 'react';
import { fetchTrendingMovies } from '../Api';
import { Grid, Card, CardMedia, CardContent, Typography, Container, TextField, MenuItem, Select, InputLabel, FormControl, Box } from '@mui/material';
import axios from 'axios';
import { Helmet } from 'react-helmet'; // For SEO meta tags

const Home = () => {
    const [movies, setMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('');
    const [filteredMovies, setFilteredMovies] = useState([]);

    const genres = [
        { id: 28, name: 'Action' },
        { id: 12, name: 'Adventure' },
        { id: 35, name: 'Comedy' },
        { id: 18, name: 'Drama' },
        { id: 10751, name: 'Family' },
        { id: 14, name: 'Fantasy' },
        { id: 27, name: 'Horror' },
        { id: 10749, name: 'Romance' },
        { id: 878, name: 'Science Fiction' },
        { id: 53, name: 'Thriller' },
    ];

    useEffect(() => {
        fetchTrendingMovies().then((data) => {
            setMovies(data);
            setFilteredMovies(data);  // Initialize filteredMovies with all movies
        });
    }, []);

    useEffect(() => {
        // Filter movies based on search term and selected genre
        let filtered = movies.filter((movie) =>
            movie.title.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (selectedGenre) {
            filtered = filtered.filter((movie) => movie.genre_ids.includes(selectedGenre));
        }

        setFilteredMovies(filtered);
    }, [searchTerm, selectedGenre, movies]);

    const fetchMovieTrailer = async (movieId) => {
        const API_KEY = '45d14068b7bc2e1455cea5e2fff3102c';
        const BASE_URL = 'https://api.themoviedb.org/3';
        try {
            const response = await axios.get(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`);
            const trailers = response.data.results.filter(video => video.type === 'Trailer');
            if (trailers.length > 0) {
                window.open(`https://www.youtube.com/watch?v=${trailers[0].key}`, '_blank');
            } else {
                alert('Trailer not available');
            }
        } catch (error) {
            console.error('Error fetching trailer:', error);
        }
    };

    return (
        <>
            <Helmet>
                <meta name="description" content="Explore trending movies, movie trailers, and the latest releases in Hollywood, Bollywood, and more!" />
                <meta name="keywords" content="Trending movies, Latest movies, Movie trailers, Top movies, Movie recommendations" />
                <meta property="og:title" content="Trending Movies - Latest Movie Releases" />
                <meta property="og:description" content="Find the latest and trending movies, watch trailers, and explore movie details." />
                <meta property="og:image" content="https://image.tmdb.org/t/p/w500/example.jpg" />
                <title>Trending Movies | Latest Movie Releases</title>
                {/* JSON-LD Structured Data for SEO */}
                <script type="application/ld+json">
                    {`
                    {
                        "@context": "https://schema.org",
                        "@type": "Movie",
                        "name": "Trending Movies",
                        "image": "https://image.tmdb.org/t/p/w500/example.jpg",
                        "description": "Explore the latest trending movies and trailers.",
                        "datePublished": "2025-04-01",
                        "genre": "Action, Drama, Comedy",
                        "director": "Famous Director Name"
                    }
                    `}
                </script>
            </Helmet>

            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                    Trending Movies
                </Typography>

                {/* Search Bar and Genre Filter */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <TextField
                        label="Search by Movie Title"
                        variant="outlined"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ width: '48%' }}
                    />
                    <FormControl sx={{ width: '48%' }}>
                        <InputLabel>Genre</InputLabel>
                        <Select
                            value={selectedGenre}
                            label="Genre"
                            onChange={(e) => setSelectedGenre(e.target.value)}
                        >
                            <MenuItem value="">All Genres</MenuItem>
                            {genres.map((genre) => (
                                <MenuItem key={genre.id} value={genre.id}>
                                    {genre.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                <Grid container spacing={4} justifyContent="center">
                    {filteredMovies.map((movie) => (
                        <Grid item xs={12} sm={6} md={3} lg={3} key={movie.id}>
                            <Card
                                sx={{ width: 200, height: 400, boxShadow: 3, borderRadius: 2, display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
                                onClick={() => fetchMovieTrailer(movie.id)}
                            >
                                <CardMedia
                                    component="img"
                                    sx={{ height: 250, objectFit: 'cover' }}
                                    image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                    alt={movie.title}
                                />
                                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                                        {movie.title}
                                    </Typography>
                                    <Typography variant="body2" sx={{ height: '60px', backgroundColor: '#dddddd', padding: "5px", borderRadius: '5px', textAlign: 'center', marginTop: 1, color: 'gray', overflowY: 'scroll' }}>
                                        {movie.overview ? (movie.overview.length > 100 ? `${movie.overview.substring(0, 100)}...` : movie.overview) : 'No description available.'}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </>
    );
};

export default Home;

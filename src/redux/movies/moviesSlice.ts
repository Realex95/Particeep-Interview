import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { movies$ } from '../../data/movie';

export interface Movie {
    id: string;
    title: string;
    category: string;
    likes: number;
    dislikes: number;
    liked: boolean;
    disliked: boolean;
    images: string;
}

interface MoviesState {
    movies: Movie[];
    categories: string[];
    loading: boolean;
    error: string | null;
}

const initialState: MoviesState = {
    movies: [],
    categories: [],
    loading: false,
    error: null,
};

export const fetchMovies = createAsyncThunk('movies/fetchMovies', async () => {
    const response: any = await movies$;
    return response.map((movie: Movie) => ({
        ...movie,
        liked: false,
        disliked: false
    }));
});

const moviesSlice = createSlice({
    name: 'movies',
    initialState,
    reducers: {
        deleteMovie: (state, action: PayloadAction<string>) => {
            state.movies = state.movies.filter(movie => movie.id !== action.payload);
        },
        addLike: (state, action: PayloadAction<string>) => {
            const movie = state.movies.find(movie => movie.id === action.payload);
            if (movie) {
                if (!movie.liked) {
                    movie.likes += 1;
                    movie.liked = true;
                    movie.disliked = false;
                }
            }
        },
        addDislike: (state, action: PayloadAction<string>) => {
            const movie = state.movies.find(movie => movie.id === action.payload);
            if (movie) {
                if (!movie.disliked) {
                    movie.dislikes += 1;
                    movie.disliked = true;
                    movie.liked = false;
                }
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMovies.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMovies.fulfilled, (state, action: PayloadAction<Movie[]>) => {
                state.movies = action.payload;
                state.loading = false;
            })
            .addCase(fetchMovies.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Une erreur est survenue';
            });
    },
});

export const { deleteMovie, addLike, addDislike } = moviesSlice.actions;
export default moviesSlice.reducer;

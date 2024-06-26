import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../app/store';
import { fetchMovies, deleteMovie, addLike, addDislike } from '../redux/movies/moviesSlice';
import CategoryFilter from './CategoryFilter';
import Pagination from './Pagination';
import './MovieList.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faCircleXmark } from '@fortawesome/free-solid-svg-icons';

interface OptionType {
    value: string;
    label: string;
}

const MovieList: React.FC = () => {
    const { movies, loading, error } = useSelector((state: RootState) => state.movies);
    const dispatch: AppDispatch = useDispatch();

    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(4);

    const [likedMovies, setLikedMovies] = useState<string[]>([]);
    const [dislikedMovies, setDislikedMovies] = useState<string[]>([]);

    useEffect(() => {
        dispatch(fetchMovies());
    }, [dispatch]);

    const handleDelete = (id: string) => {
        dispatch(deleteMovie(id));
    };

    const handleLike = (id: string) => {
        dispatch(addLike(id));
        if (!likedMovies.includes(id)) {
            setLikedMovies([...likedMovies, id]);
            setDislikedMovies(dislikedMovies.filter(movieId => movieId !== id));
        }
    };

    const handleDislike = (id: string) => {
        dispatch(addDislike(id));
        if (!dislikedMovies.includes(id)) {
            setDislikedMovies([...dislikedMovies, id]);
            setLikedMovies(likedMovies.filter(movieId => movieId !== id));
        }
    };

    const loadCategories = async (): Promise<OptionType[]> => {
        const uniqueCategories = Array.from(new Set(movies.map(movie => movie.category)));
        return uniqueCategories.map(category => ({ value: category, label: category }));
    };

    const filteredMovies = selectedCategories.length === 0
        ? movies
        : movies.filter(movie => selectedCategories.includes(movie.category));

    const totalPages = Math.ceil(filteredMovies.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedMovies = filteredMovies.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (items: number) => {
        setItemsPerPage(items);
        setCurrentPage(1);
    };

    return (
        <div className="movie-container">
            {loading && <p>Chargement...</p>}
            {error && <p className='error'>{error}</p>}
            <h2>Liste de films</h2>

            <div className='category-filter'>
                {movies.length > 0 && (
                    <CategoryFilter
                        loadCategories={loadCategories}
                        selectedCategories={selectedCategories}
                        onChange={setSelectedCategories}
                    />
                )}
            </div>
            <div className="movie-grid">
                {paginatedMovies.map(movie => (
                    <div key={movie.id} className="movie-card">
                        <img
                            src={movie.images ? `../${movie.images}` : '../../assets/default.jpg'}
                            alt={movie.title}
                            className="movie-image"
                        />
                        <h3>{movie.title}</h3>
                        <p>Catégorie: {movie.category}</p>
                        <p>Likes: {movie.likes}</p>
                        <p>Dislikes: {movie.dislikes}</p>
                        <div className='dlikes'>
                            <button
                                className={`likes ${likedMovies.includes(movie.id) ? 'liked' : ''}`}
                                onClick={() => handleLike(movie.id)}
                                disabled={dislikedMovies.includes(movie.id)}
                            >
                                <FontAwesomeIcon icon={faThumbsUp} /> Likes
                            </button>
                            <button
                                className={`dislikes ${dislikedMovies.includes(movie.id) ? 'disliked' : ''}`}
                                onClick={() => handleDislike(movie.id)}
                                disabled={likedMovies.includes(movie.id)}
                            >
                                <FontAwesomeIcon icon={faThumbsDown} />
                            </button>
                        </div>
                        <button className='delete' onClick={() => handleDelete(movie.id)}>
                            <FontAwesomeIcon icon={faCircleXmark} />
                        </button>
                    </div>
                ))}
            </div>

            {filteredMovies.length === 0 && !loading && <p className='white'>Aucun film disponible dans cette catégorie.</p>}

            {filteredMovies.length > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    itemsPerPage={itemsPerPage}
                    onItemsPerPageChange={handleItemsPerPageChange}
                />
            )}
        </div>
    );
};

export default MovieList;

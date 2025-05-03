import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import LoadingIndicator from '../components/LoadingIndicator'; // <-- Import loader

const UserEditPage = () => {
    const { userId } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false); // State loading submit
    const [isFetching, setIsFetching] = useState(true); // State loading data awal
    const [fetchError, setFetchError] = useState(''); // State error fetch awal

    const fetchUserData = useCallback(async () => {
        setFetchError('');
        setIsFetching(true); // Mulai fetching
        try {
            const response = await axiosInstance.get(`/users/${userId}`);
            setName(response.data.name);
            setEmail(response.data.email);
        } catch (err) {
            console.error("Failed to fetch user data:", err);
            setFetchError('Failed to load user data.');
             if (err.response && err.response.status === 404) {
                 setFetchError('User not found.');
                 // Opsional: redirect setelah delay jika user tidak ditemukan
                 // setTimeout(() => navigate('/users'), 2000);
             }
        } finally {
            setIsFetching(false); // Selesai fetching
        }
    }, [userId]); // Hapus navigate dari dependency jika tidak digunakan untuk redirect

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setIsLoading(true); // Mulai loading submit
        const emailToLower = email.toLowerCase();
        const payload = { name, email: emailToLower };
        if (password) {
            payload.password = password;
        }
        try {
            await axiosInstance.put(`/users/${userId}`, payload);
            navigate('/users');
        } catch (err) {
            console.error("Update user error:", err);
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else {
                 setErrors({ general: [err.response?.data?.message || 'Failed to update user. Please try again.'] });
            }
        } finally {
            setIsLoading(false); // Selesai loading submit
        }
    };

    // Tampilkan loader jika sedang fetch data awal ATAU sedang submit form
    const showLoadingOverlay = isFetching || isLoading;

    // Tampilkan error fetch jika ada
     if (fetchError && !isFetching) return <div className="error-message" style={{ padding: '20px' }}>{fetchError} <Link to="/users">Go back</Link></div>;

    return (
        <div>
            {/* Tampilkan overlay loader jika fetching atau submitting */}
            {showLoadingOverlay && <LoadingIndicator message={isFetching ? 'Loading user data...' : 'Saving changes...'} />}

            <h1 className="page-title">Edit User (ID: {userId})</h1>
            {/* Blur form saat loading overlay aktif */}
            <form onSubmit={handleSubmit} style={{ filter: showLoadingOverlay ? 'blur(1px)' : 'none' }}>
                 {errors.general && <p className="error-message">{errors.general.join(', ')}</p>}
                <div>
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required disabled={showLoadingOverlay}/>
                      {errors.name && <p className="error-message">{errors.name.join(', ')}</p>}
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete='off' disabled={showLoadingOverlay}/>
                      {errors.email && <p className="error-message">{errors.email.join(', ')}</p>}
                </div>
                <div>
                    <label htmlFor="password">New Password:</label>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} placeholder="Leave blank to keep current password" autoComplete='new-password' disabled={showLoadingOverlay}/>
                    {errors.password && <p className="error-message">{errors.password.join(', ')}</p>}
                </div>
                 <div style={{ flexDirection: 'row', gap: '1rem', marginTop: '1rem' }}>
                    <button type="submit" disabled={showLoadingOverlay}>
                        Save Changes
                    </button>
                     <Link to="/users" style={{ padding: '0.7rem 1rem', textAlign: 'center', backgroundColor: '#6c757d', color: 'white', borderRadius: '4px', pointerEvents: showLoadingOverlay ? 'none' : 'auto' }}>Cancel</Link>
                </div>
            </form>
        </div>
    );
};

export default UserEditPage;
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App'; // Adjust path as needed
import './Layout.css'; // Create basic CSS for layout

const Layout = ({ children }) => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogoutClick = async () => {
        // Tampilkan dialog konfirmasi
        if (window.confirm("Are you sure you want to logout?")) {
            // Jika pengguna menekan "OK", baru jalankan proses logout
            await logout(); // Panggil fungsi logout dari context
        }
        // Jika pengguna menekan "Cancel", tidak terjadi apa-apa
    };

    return (
        <div className="layout-container">
            <nav className="navbar">
                <div className="navbar-brand">
                    <Link to="/dashboard">
                    
                    <img
                            src="/silang-favicon.png" // Path ke favicon di folder public
                            alt="Silang.id Favicon"
                            // Style bisa diatur via CSS (lihat Langkah 2)
                            className="navbar-logo" // Tambahkan class untuk styling
                        />
                        Silang.id Admin Portal</Link>
                </div>
                <div className="navbar-links">
                    <Link to="/dashboard">Dashboard</Link>
                    <Link to="/users">Users</Link>
                </div>
                <div className="navbar-user">
                    {user && <span>Welcome, {user.name}!</span>}
                    <button onClick={handleLogoutClick} className="logout-button">Logout</button>
                </div>
            </nav>
            <main className="main-content">
                {children}
            </main>
            <footer className="footer">
                 {/* Baris Copyright yang sudah ada */}
                 © {new Date().getFullYear()} Silang.id - Admin Portal
                 {/* Baris Kredit Baru */}
                 <p className="footer-credit" style={{ marginTop: '5px', fontSize: '0.9em' }}> {/* Tambahkan class & sedikit style inline atau via CSS */}
                     by: {' '} {/* Spasi setelah by: */}
                     <a
                         href="https://www.linkedin.com/in/achmadardanip/" // <-- GANTI DENGAN URL LINKEDIN ANDA YANG SEBENARNYA
                         target="_blank" // Buka di tab baru
                         rel="noopener noreferrer" // Keamanan untuk target="_blank"
                         style={{ color: '#007bff', textDecoration: 'none' }} // Style dasar link
                     >
                         Achmad Ardani Prasha
                     </a>
                 </p>
             </footer>
        </div>
    );
};

export default Layout;
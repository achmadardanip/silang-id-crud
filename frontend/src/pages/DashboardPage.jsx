import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../App'; // Import AuthContext
import axiosInstance from '../api/axiosInstance'; // Untuk fetch data user
import LoadingIndicator from '../components/LoadingIndicator'; // Loader kustom kita

// Import komponen Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

// Registrasi elemen Chart.js yang akan digunakan
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Komponen kecil untuk Kartu Statistik (Stat Card)
const StatCard = ({ title, value, icon, linkTo, bgColor = '#fff', textColor = '#333' }) => (
  <Link to={linkTo} style={{ textDecoration: 'none', color: textColor }}>
    <div style={{
      backgroundColor: bgColor,
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      textAlign: 'center',
      transition: 'transform 0.2s ease',
    }}
      onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'}
      onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{ fontSize: '2.5em', marginBottom: '10px' }}>{icon}</div>
      <h3 style={{ margin: '0 0 5px 0', fontSize: '1em' }}>{title}</h3>
      <p style={{ margin: '0', fontSize: '1.8em', fontWeight: 'bold' }}>{value}</p>
    </div>
  </Link>
);

// Komponen kecil untuk item di daftar aktivitas
const ActivityItem = ({ text, date, linkTo }) => (
  <li style={{ borderBottom: '1px solid #eee', padding: '10px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <Link to={linkTo} style={{ textDecoration: 'none', color: '#007bff' }}>{text}</Link>
    <span style={{ fontSize: '0.85em', color: '#777' }}>{date}</span>
  </li>
);


// === Komponen Utama Dashboard ===
const DashboardPage = () => {
    const { user } = useContext(AuthContext); // Get logged-in user info
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch data pengguna untuk statistik nyata
    useEffect(() => {
        const fetchUsersData = async () => {
            setIsLoading(true);
            setError('');
            try {
                const response = await axiosInstance.get('/users');
                setUsers(response.data);
            } catch (err) {
                console.error("Failed to fetch users for dashboard:", err);
                setError('Failed to load user data.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsersData();
    }, []);

    // --- Data Dummy & Data dari User ---
    const stats = {
        totalUsers: users.length, // Data asli
        activeInterpreters: 15, // Dummy
        pendingRequests: 3, // Dummy
        upcomingEvents: 8, // Dummy
    };

    // Ambil 5 pengguna terbaru (slice dari data asli)
    const recentUsers = useMemo(() =>
        users
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // Sortir terbaru dulu
        .slice(0, 5), // Ambil 5 teratas
        [users]
    );

    // Data Dummy untuk Grafik Garis (Pendaftaran User per Bulan)
    const lineChartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'], // Contoh 6 bulan terakhir
        datasets: [
            {
                label: 'Pengguna Baru',
                data: [5, 8, 12, 10, 15, 18], // Data dummy
                fill: false,
                borderColor: '#007bff',
                tension: 0.1,
            },
        ],
    };
    const lineChartOptions = {
        responsive: true,
        plugins: { legend: { position: 'top' }, title: { display: true, text: 'Pertumbuhan Pengguna (Dummy)' } },
    };

    // Data Dummy untuk Grafik Donut (Tipe Acara)
    const doughnutChartData = {
        labels: ['Seminar/Webinar', 'Layanan Publik', 'Pernikahan', 'Konferensi', 'Lainnya'],
        datasets: [
            {
                label: 'Tipe Acara',
                data: [35, 25, 15, 10, 15], // Data dummy persentase
                backgroundColor: ['#007bff', '#28a745', '#ffc107', '#dc3545', '#6c757d'],
                hoverOffset: 4,
            },
        ],
    };
     const doughnutChartOptions = {
        responsive: true,
        plugins: { legend: { position: 'top' }, title: { display: true, text: 'Distribusi Tipe Acara (Dummy)' } },
    };


    // --- Format Tanggal Saat Ini ---
    const currentDate = new Date().toLocaleString('id-ID', { // Format Indonesia
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: false // Gunakan format 24 jam
    });


    // Tampilkan loader jika data pengguna belum siap
    if (isLoading) {
        return <LoadingIndicator message="Loading dashboard data..." />;
    }

    // Tampilkan error jika fetch gagal
    if (error) {
         return <div style={{ padding: '20px', color: 'red' }}>Error: {error}</div>;
    }


    return (
        <div>
            {/* --- Header & Welcome --- */}
            <h1 className="page-title">Admin Dashboard</h1>
            {user && <p>Selamat Datang Kembali, <strong>{user.name}</strong>!</p>}
            <p style={{color: '#555', fontSize: '0.9em', marginBottom: '25px'}}>Overview untuk: {currentDate}</p>

            {/* --- Grid Kartu Statistik --- */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                <StatCard title="Total Pengguna" value={stats.totalUsers} icon="👥" linkTo="/users" bgColor="#e7f3ff" textColor="#007bff"/>
                <StatCard title="JBI Aktif" value={stats.activeInterpreters} icon="🗣️" linkTo="#" bgColor="#eaf6ec" textColor="#28a745"/> {/* Ganti linkTo jika ada halaman JBI */}
                <StatCard title="Permintaan Baru" value={stats.pendingRequests} icon="⏳" linkTo="#" bgColor="#fff8e1" textColor="#ffc107"/> {/* Ganti linkTo jika ada halaman permintaan */}
                <StatCard title="Acara Mendatang" value={stats.upcomingEvents} icon="🗓️" linkTo="#" bgColor="#fdecea" textColor="#dc3545"/> {/* Ganti linkTo jika ada halaman acara */}
            </div>

            {/* --- Grid Grafik & Daftar Aktivitas --- */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '30px' }}>
                {/* Grafik Pertumbuhan Pengguna */}
                <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
                    <Line options={lineChartOptions} data={lineChartData} />
                </div>

                {/* Grafik Tipe Acara */}
                 <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
                     <Doughnut options={doughnutChartOptions} data={doughnutChartData} />
                 </div>

                {/* Daftar Pengguna Terbaru */}
                <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
                    <h4 style={{ marginTop: 0, marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Pengguna Baru Terdaftar</h4>
                    {recentUsers.length > 0 ? (
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {recentUsers.map(u => (
                                <ActivityItem
                                    key={u.id}
                                    text={`${u.name} (${u.email})`}
                                    date={new Date(u.created_at).toLocaleDateString('id-ID')} // Format tanggal Indonesia sederhana
                                    linkTo={`/users/edit/${u.id}`} // Link ke edit user
                                />
                            ))}
                        </ul>
                    ) : (
                        <p>Belum ada pengguna baru.</p>
                    )}
                     {/* Link ke halaman user jika daftar > 5 */}
                     {users.length > 5 && <Link to="/users" style={{display: 'block', textAlign: 'right', marginTop: '15px', fontSize: '0.9em'}}>Lihat Semua Pengguna</Link>}
                </div>

                 {/* Quick Actions */}
                 <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
                    <h4 style={{ marginTop: 0, marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Aksi Cepat</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                         <Link to="/users/create" className="create-button" style={{textDecoration:'none', textAlign:'center', padding: '10px 0'}}>Tambah Pengguna Baru</Link>
                         <Link to="/users" style={{ textDecoration: 'none', color: '#007bff', padding: '5px 0' }}>Kelola Semua Pengguna</Link>
                         <Link to="#" style={{ textDecoration: 'none', color: '#007bff', padding: '5px 0' }}>Kelola Permintaan Layanan (Dummy)</Link>
                         <Link to="#" style={{ textDecoration: 'none', color: '#007bff', padding: '5px 0' }}>Pengaturan Akun (Dummy)</Link>
                     </div>
                 </div>

            </div>

            {/* Anda bisa tambahkan elemen lain di sini */}

        </div>
    );
};

export default DashboardPage;
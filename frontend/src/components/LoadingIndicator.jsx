// src/components/LoadingIndicator.jsx
import React from 'react';
import { ThreeDot } from "react-loading-indicators";


const LoadingIndicator = ({
    message = null,
    overlay = true, // Prop baru untuk mengontrol overlay
    size = 'medium', // Prop untuk ukuran ThreeDots ('small', 'medium', 'large')
    color = '#0085ff' // Warna default sesuai permintaan Anda
}) => {

    const loaderElement = (
        <div style={{ textAlign: 'center' }}>
            <ThreeDot 
                variant="pulsate" // Atau 'bounce', 'rotating', dll. (pilih salah satu)
                color={color}
                size={size}
                text={message} // Pesan bisa ditampilkan oleh loader ini
                textColor="#555" // Warna teks pesan
            />
        </div>
    );

    // Jika menggunakan overlay
    if (overlay) {
        return (
            <div style={{
                position: 'fixed', // Posisi fixed agar menutupi layar
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.5)', // Background putih semi-transparan
                backdropFilter: 'blur(4px)', // Efek blur (cek kompatibilitas browser)
                WebkitBackdropFilter: 'blur(4px)', // Prefix untuk Safari
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999, // Pastikan di atas konten lain
            }}>
                {loaderElement}
            </div>
        );
    }

    // Jika tidak menggunakan overlay (misal untuk di dalam tabel)
    // Kembalikan hanya loader (mungkin perlu wrapper div untuk layout)
    return (
         <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', minHeight: '80px' }}>
             {loaderElement}
        </div>
    );
};

export default LoadingIndicator;
import React, { useState, useEffect, useCallback, useMemo, useContext } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { AuthContext } from '../App';
import { format } from 'date-fns';

// Import DataTable dan dependensi export (tanpa PDF)
import DataTable from 'react-data-table-component';
import styled from 'styled-components';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import LoadingIndicator from '../components/LoadingIndicator'; // <-- Import loader

// Styled component untuk input filter
const FilterInput = styled.input.attrs(props => ({
    type: 'text',
    placeholder: 'Search users...',
}))`
  height: 32px;
  width: 250px;
  border-radius: 3px;
  border: 1px solid #ccc;
  padding: 0 10px;
  margin-right: 10px;
`;

// Styled component untuk tombol export
const ExportButton = styled.button`
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 5px 10px;
    cursor: pointer;
    margin-left: 5px;
    font-size: 0.9em;

    &:hover {
        background-color: #0056b3;
    }
`;

const UsersPage = () => {
    const [users, setUsers] = useState([]); // State untuk semua data asli
    const [loading, setLoading] = useState(true); // State loading data tabel
    const [error, setError] = useState('');
    const { user: loggedInUser } = useContext(AuthContext);

    const [filterText, setFilterText] = useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            return format(new Date(dateString), 'dd/MM/yyyy HH:mm:ss');
        } catch (e) {
            console.error("Failed to format date:", dateString, e);
            return 'Invalid Date';
        }
    };

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axiosInstance.get('/users');
            setUsers(response.data);
        } catch (err) {
            console.error("Failed to fetch users:", err);
            setError('Failed to load users. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleDelete = async (userId) => {
         if (loggedInUser && loggedInUser.id === userId) {
             alert("You cannot delete your own account.");
             return;
         }
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            try {
                await axiosInstance.delete(`/users/${userId}`);
                fetchUsers();
            } catch (err) {
                 console.error("Failed to delete user:", err);
                 setError('Failed to delete user. Please try again.');
                 if (err.response?.data?.message) {
                     setError(`Failed to delete user: ${err.response.data.message}`);
                 }
            }
        }
    };

    const columns = useMemo(() => [
        { name: 'ID', selector: row => row.id, sortable: true, width: '80px', exportable: true },
        { name: 'Name', selector: row => row.name, sortable: true, exportable: true },
        { name: 'Email', selector: row => row.email, sortable: true, exportable: true },
        { name: 'Created At', selector: row => row.created_at, sortable: true, format: row => formatDate(row.created_at), exportable: true, minWidth: '180px' },
        { name: 'Updated At', selector: row => row.updated_at, sortable: true, format: row => formatDate(row.updated_at), exportable: true, minWidth: '180px' },
        {
            name: 'Actions', sortable: false, ignoreRowClick: true, allowOverflow: true, button: true, width: '150px', exportable: false,
            cell: (row) => (
                <div className="action-buttons">
                    <Link to={`/users/edit/${row.id}`} className="edit-button">Edit</Link>
                    <button onClick={() => handleDelete(row.id)} className="delete-button" disabled={loggedInUser && loggedInUser.id === row.id}>Delete</button>
                </div>
            ),
        },
    ], [loggedInUser, handleDelete]);

    const filteredUsers = useMemo(() => users.filter(user => {
        const filterLower = filterText.toLowerCase();
        return (
            user.id.toString().toLowerCase().includes(filterLower) ||
            user.name.toLowerCase().includes(filterLower) ||
            user.email.toLowerCase().includes(filterLower) ||
            formatDate(user.created_at).toLowerCase().includes(filterLower) ||
            formatDate(user.updated_at).toLowerCase().includes(filterLower)
        );
    }), [users, filterText]);

    const getExportData = () => {
        const columnsToExport = columns.filter(col => col.exportable !== false);
        const headers = columnsToExport.map(col => col.name);
        const data = users.map(user => { // <-- Ambil dari 'users' (semua data)
            return columnsToExport.map(col => {
                if (col.format) return col.format(user);
                if (col.selector) return col.selector(user);
                return '';
            });
        });
        return { headers, data };
    };

    const exportCSV = () => {
        const { headers, data } = getExportData();
        const csvContent = [
            headers.join(','),
            ...data.map(row => row.map(cell => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
        ].join('\n');
        const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, 'users_export.csv');
    };

    const exportExcel = () => {
        const { headers, data } = getExportData();
        const dataForSheet = data.map(row => {
            let obj = {};
            headers.forEach((header, index) => obj[header] = row[index]);
            return obj;
        });
        const ws = XLSX.utils.json_to_sheet(dataForSheet);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Users');
        XLSX.writeFile(wb, 'users_export.xlsx');
    };

    const subHeaderComponentMemo = useMemo(() => {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0' }}>
                <FilterInput id="search" value={filterText} onChange={e => setFilterText(e.target.value)} />
                <div>
                    <span>Export: </span>
                    <ExportButton onClick={exportCSV}>CSV</ExportButton>
                    <ExportButton onClick={exportExcel}>Excel</ExportButton>
                </div>
            </div>
        );
    }, [filterText]);

    return (
        <div>
            <h1 className="page-title">Manage Users</h1>
            {error && <p className="error-message" style={{ border: '1px solid red', padding: '10px', marginBottom: '1rem' }}>{error}</p>}
            <Link to="/users/create" className="create-button">Create New User</Link>

            <DataTable
                columns={columns}
                data={filteredUsers} // Tampilan tabel gunakan data terfilter
                progressPending={loading}
                // Gunakan loader kustom TANPA overlay untuk progress tabel
                progressComponent={<LoadingIndicator overlay={false} size="medium" />}
                pagination
                paginationResetDefaultPage={resetPaginationToggle}
                striped
                highlightOnHover
                persistTableHead
                subHeader
                subHeaderComponent={subHeaderComponentMemo}
            />
        </div>
    );
};

export default UsersPage;
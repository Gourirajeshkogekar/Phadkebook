import React, { useState, useEffect, useMemo } from 'react';
import { Box, CircularProgress, TextField, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

// 1. Global cache to prevent re-fetching/re-parsing on tab switch
let cachedBooks = null;

const BookSelectionFilter = ({ filters, setFilters }) => {
  const [books, setBooks] = useState(cachedBooks || []);
  const [loading, setLoading] = useState(!cachedBooks);
  const [searchText, setSearchText] = useState('');


  // useEffect(() => {
  //     setFilters(prev => ({
  //       ...prev,
  //       books: []  
  //     }));
  //   }, [setFilters]); 

  // 2. Fetch data once
  useEffect(() => {
    if (cachedBooks) return;

    fetch('https://publication.microtechsolutions.net.in/php/Bookget.php')
      .then((res) => res.json())
      .then((data) => {
        const formattedData = data.map((book, index) => ({
          ...book,
          // Using a combination or index to guarantee uniqueness for DataGrid
          id: book.Id || book.BookCode || index, 
        }));
        cachedBooks = formattedData;
        setBooks(formattedData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // 3. Memoize the filtered rows so they only recalculate when searchText changes
  const filteredRows = useMemo(() => {
    const term = searchText.toLowerCase().trim();
    if (!term) return books;
    return books.filter((row) =>
      row.BookName?.toLowerCase().includes(term) ||
      row.BookCode?.toString().includes(term) ||
      row.BookNameMarathi?.includes(term)
    );
  }, [books, searchText]);

  // 4. Functional state update to prevent lag during selection
  const handleSelectionChange = (newSelection) => {
    setFilters(prev => ({
      ...prev,
      selectedBooks: newSelection
    }));
  };

 const columns = [
  { field: 'BookCode', headerName: 'Code', width: 90 },
  { 
    field: 'BookName', 
    headerName: 'Book Name', 
    flex: 1,
    // This allows the text to wrap instead of showing "..."
    renderCell: (params) => (
      <Typography sx={{ fontSize: '0.82rem', whiteSpace: 'normal', py: 1 }}>
        {params.value}
      </Typography>
    ),
  },
  { 
    field: 'BookNameMarathi', 
    headerName: 'Marathi Name', 
    flex: 1,
    renderCell: (params) => (
      <Typography sx={{ fontSize: '0.82rem', whiteSpace: 'normal', py: 1 }}>
        {params.value}
      </Typography>
    ),
  },
];



  if (loading) return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 5 }}>
      <CircularProgress size={30} />
      <Typography variant="caption" sx={{ mt: 1 }}>Loading Books...</Typography>
    </Box>
  );

  return (
    <Box sx={{ height: 480, width: '100%', mt: 1 }}>
      <Typography variant="subtitle1" textAlign='center' fontWeight={600} >
        Book Selection filter
      </Typography> 

      <TextField
        fullWidth
        size="small"
        placeholder="Quick search books..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        sx={{ mb: 1.5, mt: 1, bgcolor: 'white' }}
      />

 <DataGrid
  rows={filteredRows}
  columns={columns}
  checkboxSelection
  disableRowSelectionOnClick
  // 1. Set row height to auto to accommodate wrapped text
  getRowHeight={() => 'auto'} 
  headerHeight={40}
  onRowSelectionModelChange={handleSelectionChange}
  rowSelectionModel={filters.selectedBooks || []}
  // 2. Remove density="compact" as it restricts height
  sx={{
    bgcolor: '#fafafa',
    '& .MuiDataGrid-cell': {
      display: 'flex',
      alignItems: 'center',
    },
  }}
/>
    </Box>
  );
};

export default BookSelectionFilter;
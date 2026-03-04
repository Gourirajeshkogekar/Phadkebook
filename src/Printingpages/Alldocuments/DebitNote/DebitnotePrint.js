import React, { forwardRef } from 'react';
import { Box, Typography, Divider } from '@mui/material';

const DebitnotePrint = forwardRef(({ data }, ref) => {
  return (
    <Box ref={ref} sx={{ bgcolor: "white", p: 0 }}>
      {/* A4 Page Container */}
      <Box sx={{ width: "210mm", minHeight: "297mm", mx: "auto", p: "20mm", border: '1px solid #ddd' }}>
        
        {/* Company Header */}
        <Box textAlign="center" mb={1}>
          <Typography variant="h5" fontWeight={700} sx={{ letterSpacing: 1.5 }}>PHADKE BOOK HOUSE</Typography>
          <Typography variant="body2" sx={{ fontSize: '12px' }}>Phadke Bhavan, Near Hari Mandir, Dudhali Kolhapur 416012</Typography>
        </Box>

        <Divider sx={{ borderBottomWidth: 1.5, mb: 1, borderColor: 'black' }} />
        
        {/* Title */}
        <Typography align="center" fontWeight={700} sx={{ textDecoration: 'underline', mb: 3, fontSize: '18px' }}>
          Debit Note
        </Typography>

        {/* Recipient and Reference Info */}
        <Box display="flex" justifyContent="space-between" mb={4}>
          <Box sx={{ maxWidth: '60%' }}>
            <Typography fontSize={14}>To,</Typography>
            <Typography fontWeight={700} fontSize={15} sx={{ mt: 0.5 }}>{data.to}</Typography>
            <Box sx={{ mt: 1, ml: 2 }}>
              <Typography fontSize={13}>{data.address}</Typography>
              <Typography fontSize={13} sx={{ mt: 0.5 }}>{data.district}</Typography>
            </Box>
            <Typography fontWeight={700} fontSize={13} sx={{ mt: 2 }}>Dist. - {data.district}</Typography>
          </Box>
          <Box textAlign="right">
            <Typography fontSize={13} fontWeight={700}>Debit Note No.: &nbsp;&nbsp;&nbsp; {data.debitNoteNo}</Typography>
            <Typography fontSize={13} fontWeight={700} sx={{ mt: 1 }}>Date : &nbsp;&nbsp;&nbsp; {data.date}</Typography>
          </Box>
        </Box>

        <Divider sx={{ borderBottomWidth: 1.5, mb: 3, borderColor: 'black' }} />

        {/* Message Body */}
        <Box sx={{ px: 4, mb: 8 }}>
          <Typography fontSize={14}>
            We have debited your account with the sum of Rs. <span style={{ textDecoration: 'underline', fontWeight: 700 }}>{data.amountWords}</span> Particulars are given below.
          </Typography>
          <Typography fontSize={14} sx={{ mt: 1 }}>
            Please do the needful in your Books of Accounts.
          </Typography>

          {/* Particulars Listing */}
          <Box sx={{ mt: 6, position: 'relative', width: '100%' }}>
            <Typography sx={{ position: 'absolute', right: 0, top: -25, fontWeight: 700, fontSize: '13px' }}>Rs.</Typography>
            
            {data.particulars.map((item, index) => (
              <Box key={index} display="flex" justifyContent="space-between" sx={{ mb: 1.5 }}>
                <Typography fontSize={14}>{item.desc}</Typography>
                <Typography fontSize={14} sx={{ pr: 1 }}>{item.amount}</Typography>
              </Box>
            ))}
            
            {/* Total Section with Double Line */}
            <Box display="flex" justifyContent="space-between" sx={{ mt: 4, pt: 1, borderTop: '1px solid black' }}>
              <Typography fontWeight={700} fontSize={14}>Total Rs.</Typography>
              <Box sx={{ borderBottom: '3px double black', pb: 0.2 }}>
                <Typography fontWeight={700} fontSize={14} sx={{ pr: 1 }}>{data.totalAmount}</Typography>
              </Box>
            </Box>
          </Box>

          <Typography sx={{ mt: 5, fontSize: 13, fontStyle: 'italic' }}>Commission</Typography>
        </Box>

        <Divider sx={{ borderBottomWidth: 1.5, mb: 1, borderColor: 'black' }} />

        {/* Footer Signature */}
        <Box display="flex" justifyContent="flex-end" sx={{ mt: 6 }}>
          <Box textAlign="center">
             <Typography fontSize={14} fontWeight={700}>For PHADKE BOOK HOUSE</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
});

export default DebitnotePrint;
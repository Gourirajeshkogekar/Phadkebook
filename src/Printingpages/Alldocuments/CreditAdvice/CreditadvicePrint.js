// import React, { forwardRef } from 'react';
// import { Box, Typography, Divider } from '@mui/material';

// const CreditadvicePrint = forwardRef(({ data }, ref) => {
//   return (
//     <Box ref={ref} sx={{ bgcolor: "white", p: 0 }}>
//       <Box sx={{ width: "210mm", minHeight: "297mm", mx: "auto", p: "20mm", position: 'relative', border: '1px solid #eee' }}>
        
//         {/* Header */}
//         <Box textAlign="center" mb={2}>
//           <Typography variant="h5" fontWeight={700} sx={{ letterSpacing: 1 }}>PHADKE BOOK HOUSE</Typography>
//           <Typography variant="body2">Phadke Bhavan, Near Hari Mandir, Dudhali Kolhapur 416012</Typography>
//         </Box>

//         <Divider sx={{ borderBottomWidth: 1.5, mb: 1, borderColor: 'black' }} />
//         <Typography align="center" fontWeight={700} sx={{ textDecoration: 'underline', mb: 4 }}>Credit Advice</Typography>

//         {/* Address and Details */}
//         <Box display="flex" justifyContent="space-between" mb={4}>
//           <Box sx={{ maxWidth: '60%' }}>
//             <Typography fontWeight={700} fontSize={13}>To,</Typography>
//             <Typography fontWeight={700} fontSize={14} sx={{ mt: 1 }}>{data.to}</Typography>
//             <Typography fontSize={12} sx={{ mt: 1, width: '250px' }}>{data.address}</Typography>
//             <Typography fontWeight={700} fontSize={13} sx={{ mt: 1 }}>Dist. - {data.district}</Typography>
//           </Box>
//           <Box textAlign="right">
//             <Typography fontSize={13} fontWeight={700}>Credit Advice No.: &nbsp;&nbsp;&nbsp; {data.adviceNo}</Typography>
//             <Typography fontSize={13} fontWeight={700} sx={{ mt: 1 }}>Date : &nbsp;&nbsp;&nbsp; {data.date}</Typography>
//           </Box>
//         </Box>

//         <Divider sx={{ borderBottomWidth: 1.5, mb: 3, borderColor: 'black' }} />

//         {/* Content Body */}
//         <Box sx={{ px: 4, mb: 10 }}>
//           <Typography fontSize={14}>
//             We have credited your account with the sum of Rs. <span style={{ textDecoration: 'underline', fontWeight: 700 }}>{data.amountWords}</span> Particulars are given below.
//           </Typography>
//           <Typography fontSize={14} sx={{ mt: 1 }}>
//             Please do the needful in your Books of Accounts.
//           </Typography>

//           {/* Particulars Table */}
//           <Box sx={{ mt: 6, position: 'relative' }}>
//             <Typography sx={{ position: 'absolute', right: 0, top: -20, fontWeight: 700 }}>Rs.</Typography>
//             {data.particulars.map((item, index) => (
//               <Box key={index} display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
//                 <Typography fontSize={14}>{item.desc}</Typography>
//                 <Typography fontSize={14}>{item.amount}</Typography>
//               </Box>
//             ))}
            
//             <Box display="flex" justifyContent="space-between" sx={{ mt: 2, pt: 1, borderTop: '1px solid black' }}>
//               <Typography fontWeight={700}>Total Rs.</Typography>
//               <Box sx={{ borderBottom: '3px double black' }}>
//                 <Typography fontWeight={700}>{data.totalAmount}</Typography>
//               </Box>
//             </Box>
//           </Box>

//           <Typography sx={{ mt: 5, fontSize: 13, fontStyle: 'italic' }}>Commission</Typography>
//         </Box>

//         <Divider sx={{ borderBottomWidth: 1.5, mb: 1, borderColor: 'black' }} />

//         {/* Signature */}
//         <Box textAlign="right" sx={{ mt: 4, pr: 4 }}>
//           <Typography fontSize={13} fontWeight={700}>For PHADKE BOOK HOUSE</Typography>
//         </Box>
//       </Box>
//     </Box>
//   );
// });

// export default CreditadvicePrint;

import React, { forwardRef } from 'react';
import { Box, Typography, Divider } from '@mui/material';

const CreditadvicePrint = forwardRef(({ data }, ref) => {
  return (
    <Box ref={ref} sx={{ bgcolor: "white", p: 0 }}>
      <Box sx={{ width: "210mm", minHeight: "297mm", mx: "auto", p: "20mm", position: 'relative', border: '1px solid #eee' }}>
        
        {/* Header */}
        <Box textAlign="center" mb={2}>
          <Typography variant="h5" fontWeight={700} sx={{ letterSpacing: 1 }}>PHADKE BOOK HOUSE</Typography>
          <Typography variant="body2">Phadke Bhavan, Near Hari Mandir, Dudhali Kolhapur 416012</Typography>
        </Box>

        <Divider sx={{ borderBottomWidth: 1.5, mb: 1, borderColor: 'black' }} />
        <Typography align="center" fontWeight={700} sx={{ textDecoration: 'underline', mb: 4 }}>Credit Advice</Typography>

        {/* Address and Details */}
        <Box display="flex" justifyContent="space-between" mb={4}>
          <Box sx={{ maxWidth: '60%' }}>
            <Typography fontWeight={700} fontSize={13}>To,</Typography>
            <Typography fontWeight={700} fontSize={14} sx={{ mt: 1 }}>{data.to}</Typography>
            <Typography fontSize={12} sx={{ mt: 1, width: '250px' }}>{data.address}</Typography>
            <Typography fontWeight={700} fontSize={13} sx={{ mt: 1 }}>Dist. - {data.district}</Typography>
          </Box>
          <Box textAlign="right">
            <Typography fontSize={13} fontWeight={700}>Credit Advice No.: &nbsp;&nbsp;&nbsp; {data.adviceNo}</Typography>
            <Typography fontSize={13} fontWeight={700} sx={{ mt: 1 }}>Date : &nbsp;&nbsp;&nbsp; {data.date}</Typography>
          </Box>
        </Box>

        <Divider sx={{ borderBottomWidth: 1.5, mb: 3, borderColor: 'black' }} />

        {/* Content Body */}
        <Box sx={{ px: 4, mb: 10 }}>
          <Typography fontSize={14}>
            We have credited your account with the sum of Rs. <span style={{ textDecoration: 'underline', fontWeight: 700 }}>{data.amountWords}</span> Particulars are given below.
          </Typography>
          <Typography fontSize={14} sx={{ mt: 1 }}>
            Please do the needful in your Books of Accounts.
          </Typography>

          {/* Particulars Table */}
          <Box sx={{ mt: 6, position: 'relative' }}>
            <Typography sx={{ position: 'absolute', right: 0, top: -20, fontWeight: 700 }}>Rs.</Typography>
            {data.particulars.map((item, index) => (
              <Box key={index} display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography fontSize={14}>{item.desc}</Typography>
                <Typography fontSize={14}>{item.amount}</Typography>
              </Box>
            ))}
            
            <Box display="flex" justifyContent="space-between" sx={{ mt: 2, pt: 1, borderTop: '1px solid black' }}>
              <Typography fontWeight={700}>Total Rs.</Typography>
              <Box sx={{ borderBottom: '3px double black' }}>
                <Typography fontWeight={700}>{data.totalAmount}</Typography>
              </Box>
            </Box>
          </Box>

          <Typography sx={{ mt: 5, fontSize: 13, fontStyle: 'italic' }}>Commission</Typography>
        </Box>

        <Divider sx={{ borderBottomWidth: 1.5, mb: 1, borderColor: 'black' }} />

        {/* Signature */}
        <Box textAlign="right" sx={{ mt: 4, pr: 4 }}>
          <Typography fontSize={13} fontWeight={700}>For PHADKE BOOK HOUSE</Typography>
        </Box>
      </Box>
    </Box>
  );
});

export default CreditadvicePrint;
import React from "react";
import {
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";

function ContactSupport() {
  return (
    <Container maxWidth="md" sx={{ mt: 3, mb: 3 }}>
      <Typography variant="h6" align="center" gutterBottom fontWeight="bold">
        Contact & Support
      </Typography>

      <Typography variant="subtitle1" align="center" gutterBottom>
        We're here to help you! Reach out to us for any inquiries, support, or
        feedback.
      </Typography>

      <Grid container spacing={4} sx={{ mt: 1 }}>
        {/* Contact Info */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <LocationOnIcon color="primary" sx={{ mr: 1 }} />
              <Typography>
                Phadke Bhavan, Near Hari Mandir, Dudhali, Kolhapur - 416012
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" mb={1}>
              <PhoneIcon color="primary" sx={{ mr: 1 }} />
              <Typography>+91 98765 43210</Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <EmailIcon color="primary" sx={{ mr: 1 }} />
              <Typography>support@phadkebooks.in</Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Contact Form */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Send Us a Message
            </Typography>
            <form>
              <TextField fullWidth label="Your Name" margin="normal" required />
              <TextField
                fullWidth
                label="Your Email"
                type="email"
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Message"
                multiline
                rows={4}
                margin="normal"
                required
              />
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 1 }}
                type="submit">
                Submit
              </Button>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default ContactSupport;

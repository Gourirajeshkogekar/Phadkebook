import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./image.png";

const Home = () => {
  const navigate = useNavigate();

  const quickActions = [
    { title: "➕ Add New Book", color: "#2196f3", path: "/masters/book" },
    {
      title: "📈 Royalty Reports",
      color: "#4caf50",
      path: "/royalty",
    },
    { title: "👩‍🏫 Top Authors", color: "#ff9800", path: "/masters/authors" },
    { title: "📞 Contact Support", color: "#f44336", path: "/support" },
  ];
  return (
    <Box
      sx={{
        p: 3,
        bgcolor: "#f4f6f8",
        minHeight: "50vh",
      }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #1e3c72, #2a5298)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "220px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          textAlign: "center",
          position: "relative",
          borderRadius: 3,
          boxShadow: 4,
        }}>
        <Box
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(to right, rgba(0,0,0,0.6), rgba(0,0,0,0.3))",
            borderRadius: 3,
          }}
        />
        <Box sx={{ zIndex: 2 }}>
          <Typography variant="h3" fontWeight="bold">
            📚 Phadke Prakashan
          </Typography>
          <Typography variant="h6" mt={1}>
            Discover. Publish. Grow. Inspire.
          </Typography>
        </Box>
      </Box>

      {/* Quick Actions */}
      <Grid container spacing={3} mt={5}>
        {quickActions.map((item, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Card
              sx={{
                textAlign: "center",
                boxShadow: 6,
                borderRadius: 3,
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: 10,
                },
              }}>
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{ color: item.color, fontWeight: "bold" }}>
                  {item.title}
                </Typography>
                <Button
                  onClick={() => navigate(item.path)}
                  variant="contained"
                  sx={{
                    mt: 2,
                    bgcolor: item.color,
                    color: "white",
                    "&:hover": {
                      bgcolor: "#333",
                    },
                  }}
                  fullWidth>
                  Go
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quote Section */}
      <Box mt={6} textAlign="center">
        <Typography
          variant="h6"
          fontStyle="italic"
          color="text.secondary"
          sx={{ maxWidth: 600, mx: "auto" }}>
          "Empowering knowledge through words — one page at a time."
        </Typography>
      </Box>
    </Box>
  );
};

export default Home;

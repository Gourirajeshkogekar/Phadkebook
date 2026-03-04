import { useState, useEffect, useRef } from "react";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  List,
  ListItemButton,
  ListItemText,
  CircularProgress,
  Grid
} from "@mui/material";

import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import axios from "axios";
import CanvassingCollegeListPrint from "./CanvassingCollegelistPrint";

export default function CanvassingCollegeList() {

  const reportRef = useRef();

  const [city, setCity] = useState("");
  const [college, setCollege] = useState("");

  const [cities, setCities] = useState([]);
  const [colleges, setColleges] = useState([]);

  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingColleges, setLoadingColleges] = useState(false);

  const [printing, setPrinting] = useState(false);


  /* ================= LOAD CITY ================= */

  useEffect(() => {
    loadCities();
  }, []);

  const loadCities = async () => {

    try {

      setLoadingCities(true);

      const res = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Cityget.php"
      );

      console.log("CITY API:", res.data);

      let list = [];

      if (Array.isArray(res.data))
        list = res.data;
      else if (Array.isArray(res.data.data))
        list = res.data.data;
      else if (Array.isArray(res.data.result))
        list = res.data.result;

      setCities(list);

    }
    catch (err) {

      console.error(err);
      setCities([]);

    }
    finally {

      setLoadingCities(false);

    }

  };


  /* ================= LOAD COLLEGE ================= */

  useEffect(() => {
    loadColleges();
  }, []);

  const loadColleges = async () => {

    try {

      setLoadingColleges(true);

      const res = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Collegeget.php"
      );

      console.log("COLLEGE API:", res.data);

      let list = [];

      if (Array.isArray(res.data))
        list = res.data;

      else if (Array.isArray(res.data.data))
        list = res.data.data;

      else if (Array.isArray(res.data.result))
        list = res.data.result;

      setColleges(list);

    }
    catch (err) {

      console.error(err);
      setColleges([]);

    }
    finally {

      setLoadingColleges(false);

    }

  };


    
    const handlePrint = async () => {
      if (!reportRef.current) return;
      setPrinting(true);
  
      try {
   
        // Small delay to allow the hidden component to render the dynamic data
        await new Promise((resolve) => setTimeout(resolve, 500));
  
        const element = reportRef.current;
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          logging: false,
        });
  
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        
        // A4 dimensions: 210mm x 297mm
        pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
        window.open(pdf.output("bloburl"), "_blank");
      } catch (error) {
        console.error("PDF Generation Error:", error);
      } finally {
        setPrinting(false);
      }
    };

  


 
  return (

    <Box sx={rootStyle}>

      <Paper sx={cardStyle}>

        <Typography variant="h6" textAlign='center' fontWeight="bold" mb={2}>
          Canvassing College List
        </Typography>


        <Grid container spacing={2}>


          {/* CITY */}

          <Grid item xs={6}>

            <TextField
              label="City / District"
              size="small"
              fullWidth
              value={city}
              onChange={(e)=>setCity(e.target.value)}
            />

            <Box sx={listStyle}>

              {loadingCities
                ?
                <CircularProgress/>
                :
                <List dense>

                  {cities.map((c)=>(
                    <ListItemButton
                      key={c.Id}
                      onClick={()=>setCity(c.CityName)}
                    >
                      <ListItemText primary={c.CityName}/>
                    </ListItemButton>
                  ))}

                </List>
              }

            </Box>

          </Grid>



          {/* COLLEGE */}

          <Grid item xs={6}>

            <TextField
              label="College / School"
              size="small"
              fullWidth
              value={college}
              onChange={(e)=>setCollege(e.target.value)}
            />

            <Box sx={listStyle}>

              {loadingColleges
                ?
                <CircularProgress/>
                :
                <List dense>

                  {colleges.map((c)=>(
                    <ListItemButton
                      key={c.Id}
                      onClick={()=>setCollege(c.CollegeName)}
                    >
                      <ListItemText primary={c.CollegeName}/>
                    </ListItemButton>
                  ))}

                </List>
              }

            </Box>

          </Grid>

        </Grid>



        <Stack direction="row" spacing={2} justifyContent="center" mt={3}>

          <Button
            variant="contained"
            startIcon={<PrintIcon/>}
            onClick={handlePrint}
            disabled={printing}
          >
            Print
          </Button>

          <Button
            variant="contained"
            color="error"
            startIcon={<CloseIcon/>}
          >
            Close
          </Button>

        </Stack>

      </Paper>



       <Box sx={{ position: "absolute", top: "-10000px", left: "-10000px",  }}>
                    <div ref={reportRef} style={{ width: "210mm" }}>
                      <CanvassingCollegeListPrint 
                        state={{ city, college, }} 
                      />
                    </div>
                  </Box>

    </Box>

  );

}



/* STYLES */

const rootStyle = {
  minHeight:"100vh",
  background:"#eef2f6",
  display:"flex",
  justifyContent:"center",
  alignItems:"center"
};

const cardStyle = {
  width:700,
  padding:3,
  borderRadius:3
};

const listStyle = {
  border:"1px solid #999",
  height:220,
  overflow:"auto",
  marginTop:1
};

const printStyle = {
  position:"absolute",
  left:"-9999px",
  width:"210mm",
  minHeight:"297mm",
  padding:"20mm",
  background:"#fff"
};
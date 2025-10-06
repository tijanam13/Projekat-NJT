import React, { useEffect, useState, useCallback } from "react";
import http from "../api/http";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import "../css/UpravljanjeRezervacijama.css";

export default function RezervacijePage() {
  const [rezervacije, setRezervacije] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRezervacija, setSelectedRezervacija] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("SVI");

  const statuses = ["SVI", "AKTIVNO", "PREUZETO", "OTKAZANO", "ISTEKLO"];

  useEffect(() => {
    fetchRezervacije();
  }, [filterStatus]);

  const fetchRezervacije = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {},
      };

      if (filterStatus !== "SVI") {
        config.params.status = filterStatus;
      }

      const response = await http.get("/rezervacija", config);

      const data = response.data.map((rez) => ({
        ...rez,
        status: rez.status ? rez.status.toString() : "NEPOZNAT",
        stavke: rez.stavke || [],
      }));

      setRezervacije(data);
    } catch (error) {
      console.error("Greška pri učitavanju rezervacija:", error);
      alert("Došlo je do greške pri učitavanju rezervacija.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (rezervacija) => {
    setSelectedRezervacija(rezervacija);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedRezervacija(null);
    setOpenModal(false);
  };

  const handlePreuzeto = async (rezervacijaId) => {
    if (
      !window.confirm(
        "Da li ste sigurni da želite da promenite status rezervacije u 'PREUZETO'?"
      )
    ) {
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await http.patch(
        `/rezervacija/${rezervacijaId}/status`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { status: "PREUZETO" },
        }
      );
      alert("Status rezervacije uspešno promenjen u 'PREUZETO'!");
      fetchRezervacije();
    } catch (error) {
      console.error("Greška pri promeni statusa:", error);
      alert("Došlo je do greške pri promeni statusa rezervacije.");
    }
  };

  const buttonStyle = {
    backgroundColor: "#655a7c",
    color: "#fff",
    minWidth: 100,
    height: 36,
    padding: "6px 12px",
    fontSize: 13,
    textTransform: "none",
    "&:hover": { backgroundColor: "#7b66b1" },
  };

  const actionButtonStyle = {
    backgroundColor: " #655a7cff",
    color: "white",
    "&:hover": { backgroundColor: "#7b66b1" },
    borderRadius: 1,
    marginRight: "5px",
    minWidth: 120,
    textTransform: "none",
    fontSize: 13,
  };

  const preuzetoButtonStyle = {
    backgroundColor: "#28a745",
    color: "white",
    "&:hover": { backgroundColor: "#218838" },
    borderRadius: 1,
    minWidth: 90,
    textTransform: "none",
    fontSize: 13,
  };

  const dialogCloseButtonStyle = {
    backgroundColor: "#655a7c",
    color: "white",
    "&:hover": { backgroundColor: "#4a3f6e" },
    borderRadius: 1,
    marginTop: "10px",
    textTransform: "none",
    fontSize: 13,
  };

  return (
    <div className="rezervacije-page">
      <Box sx={{ p: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 3 }}
        >
          <Box>
            <Typography variant="h4" sx={{ color: "#655a7c" }}>
              Pregled Rezervacija
            </Typography>
            <Typography variant="body2" sx={{ color: "#655a7c" }}>
              Upravljanje svim rezervacijama.
            </Typography>
          </Box>
          <Stack direction="row" spacing={2} alignItems="center">
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel id="filter-status-label" sx={{ color: "#655a7c" }}>
                Status
              </InputLabel>
              <Select
                labelId="filter-status-label"
                value={filterStatus}
                label="Status"
                onChange={(e) => setFilterStatus(e.target.value)}
                sx={{
                  color: "#655a7c",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#655a7c",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#655a7c",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#7b66b1",
                  },
                  "& .MuiSvgIcon-root": { color: "#655a7c" },
                }}
              >
                {statuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status.replace(/_/g, " ")}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              disableElevation
              sx={buttonStyle}
              onClick={() => {
                setFilterStatus("SVI");
              }}
            >
              Osveži
            </Button>
          </Stack>
        </Stack>

        {loading ? (
          <Box
            sx={{ display: "flex", justifyContent: "center", mt: 4 }}
          >
            <CircularProgress sx={{ color: "#655a7c" }} />
          </Box>
        ) : rezervacije.length === 0 ? (
          <Typography sx={{ color: "#655a7c", mt: 2 }}>
            Nema pronađenih rezervacija.
          </Typography>
        ) : (
          <div className="scroll-table">
            <Table className="rezervacije-table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Datum rezervacije</TableCell>
                  <TableCell>Rok za preuzimanje</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Korisnik</TableCell>
                  <TableCell align="center">Akcije</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rezervacije.map((rez) => (
                  <TableRow key={rez.id}>
                    <TableCell>{rez.id}</TableCell>
                    <TableCell>
                      {new Date(rez.datumRezervacije).toLocaleDateString(
                        "sr-RS"
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(rez.rokZaPreuzimanje).toLocaleDateString(
                        "sr-RS"
                      )}
                    </TableCell>
                    <TableCell>{rez.status.replace(/_/g, " ")}</TableCell>
                    <TableCell>
                      {rez.korisnik
                        ? `${rez.korisnik.korisnickoIme}`
                        : "N/A"}
                    </TableCell>
                    <TableCell align="center">
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="center"
                      >
                        <Button
                          variant="contained"
                          disableElevation
                          sx={actionButtonStyle}
                          onClick={() => handleOpenModal(rez)}
                        >
                          Pogledaj stavke
                        </Button>
                        {rez.status === "AKTIVNO" && (
                          <Button
                            variant="contained"
                            disableElevation
                            sx={preuzetoButtonStyle}
                            onClick={() => handlePreuzeto(rez.id)}
                          >
                            Preuzeto
                          </Button>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth>
          <DialogTitle sx={{ color: "#655a7c" }}>
            Detalji Rezervacije #{selectedRezervacija?.id}
          </DialogTitle>
          <DialogContent dividers>
            {selectedRezervacija && (
              <Box className="modal-form">
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Korisnik:</strong>{" "}
                  {selectedRezervacija.korisnik
                    ? `${selectedRezervacija.korisnik.korisnickoIme}`
                    : "N/A"}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Datum rezervacije:</strong>{" "}
                  {new Date(
                    selectedRezervacija.datumRezervacije
                  ).toLocaleDateString("sr-RS")}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  <strong>Rok za preuzimanje:</strong>{" "}
                  {new Date(
                    selectedRezervacija.rokZaPreuzimanje
                  ).toLocaleDateString("sr-RS")}
                </Typography>

                <Typography
                  variant="h6"
                  sx={{ color: "#655a7c", mt: 2, mb: 1 }}
                >
                  Stavke:
                </Typography>
                {selectedRezervacija.stavke &&
                  selectedRezervacija.stavke.length > 0 ? (
                  <Box
                    className="scroll-table"
                    sx={{ maxHeight: "400px", overflowY: "auto" }}
                  >
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Redni broj</TableCell>
                          <TableCell>Količina</TableCell>
                          <TableCell>Naziv knjige</TableCell>
                          <TableCell>Autori</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedRezervacija.stavke.map((stavka, index) => (
                          <TableRow key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{stavka.brojPrimeraka}</TableCell>
                            <TableCell>
                              {stavka.knjiga?.naslov || "Nepoznato"}
                            </TableCell>
                            <TableCell>
                              {stavka.knjiga?.autori
                                ?.map((a) => `${a.autor.ime} ${a.autor.prezime}`)
                                .join(", ") || "N/A"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                ) : (
                  <Typography>Nema stavki u ovoj rezervaciji.</Typography>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              disableElevation
              sx={dialogCloseButtonStyle}
              onClick={handleCloseModal}
            >
              Zatvori
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </div>
  );
}
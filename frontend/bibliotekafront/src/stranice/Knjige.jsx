import React, { useEffect, useState } from "react";
import http from "../api/http";

import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  MenuItem,
  IconButton,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Edit, Delete } from "@mui/icons-material";
import "../css/Knjige.css";

export default function KnjigePage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [authorsList, setAuthorsList] = useState([]);
  const [allAuthors, setAllAuthors] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [opisDialog, setOpisDialog] = useState({ open: false, text: "" });

  const [authorModalOpen, setAuthorModalOpen] = useState(false);
  const [authorFormData, setAuthorFormData] = useState({
    ime: "",
    prezime: "",
    biografija: "",
  });

  const [form, setForm] = useState({
    naslov: "",
    izdavac: "",
    godinaIzdanja: "",
    brojDosupnihPrimeraka: "",
    zanr: "",
    autori: [],
    slika: "",
    opis: "",
  });

  const [deleteModal, setDeleteModal] = useState({
    show: false,
    knjigaId: null,
    knjigaNaslov: "",
  });

  const zanrovi = [
    "Novela", "Pripovetka", "Poezija", "Drama", "Satira", "Esej", "Ljubavni_roman",
    "Kriminalistički_roman", "Triler", "Horor", "Naučna_fantastika", "Psihološki_roman",
    "Istorijski_roman", "Ratni_roman", "Avanturistički_roman", "Detektivski_roman", "Bajka", "Komedija", "Satirična_alegorija", "Filozofski_roman", "Tragedija"
  ];

  const columns = [
    { field: "id", headerName: "ID", width: 80, headerAlign: "center", align: "center" },
    { field: "naslov", headerName: "Naslov", flex: 1, minWidth: 140, headerAlign: "center", align: "center" },
    { field: "izdavac", headerName: "Izdavač", flex: 1, minWidth: 140, headerAlign: "center", align: "center" },
    { field: "godinaIzdanja", headerName: "Godina izdavanja", width: 140, headerAlign: "center", align: "center" },
    { field: "brojDosupnihPrimeraka", headerName: "Broj primeraka", width: 140, headerAlign: "center", align: "center" },
    {
      field: "zanr",
      headerName: "Žanr",
      width: 180,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (params.value ?? "").replace(/_/g, " ")
    },
    {
      field: "slika",
      headerName: "Slika",
      width: 100,
      sortable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params) =>
        params.value ? (
          <img src={params.value} alt="knjiga" style={{ width: 40, height: 60, objectFit: "cover" }} />
        ) : "Nema"
    },
    {
      field: "opis",
      headerName: "Opis",
      flex: 2,
      minWidth: 200,
      sortable: false,
      headerAlign: "center",
      align: "left",
      renderCell: (params) => {
        const fullText = params.value ?? "";
        const truncated = fullText.length > 20 ? fullText.slice(0, 20) + "..." : fullText;
        return (
          <Box>
            <Typography variant="body2" sx={{ display: "inline" }}>{truncated}</Typography>
            {fullText.length > 20 && (
              <Button
                size="small"
                onClick={() => setOpisDialog({ open: true, text: fullText })}
                sx={{ textTransform: "none", ml: 1, color: "#655a7cff" }}
              >
                Prikaži više
              </Button>
            )}
          </Box>
        );
      },
    },
    {
      field: "autori",
      headerName: "Autori",
      flex: 1.5,
      minWidth: 200,
      sortable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params) =>
        (params.row.autori ?? []).map((a) => `${a.ime} ${a.prezime}`).join(", ")
    },
    {
      field: "actions",
      headerName: "Akcije",
      width: 100,
      sortable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <IconButton
            size="small"
            sx={{ color: "#655a7cff" }}
            onClick={() => startEdit(params.row)}
          >
            <Edit fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            sx={{ color: "#655a7cff" }}
            onClick={() => handleDeleteClick(params.row)}
          >
            <Delete fontSize="small" />
          </IconButton>
        </Stack>
      ),
    },
  ];

  useEffect(() => {
    fetchBooks();
    fetchAllAuthors();
  }, []);

  function fetchBooks() {
    setLoading(true);
    http.get("/knjiga")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setRows(
          data.map((x) => ({
            id: x.id,
            naslov: x.naslov ?? "",
            izdavac: x.izdavac ?? "",
            godinaIzdanja: x.godinaIzdanja ?? "",
            brojDosupnihPrimeraka: x.brojDosupnihPrimeraka ?? "",
            zanr: x.zanr ?? "",
            autori: x.autori ?? [],
            slika: x.slika ?? "",
            opis: x.opis ?? "",
          }))
        );
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }

  function fetchAllAuthors() {
    http.get("/autori")
      .then((res) => setAllAuthors(Array.isArray(res.data) ? res.data : []))
      .catch((e) => console.error("Greška kod učitavanja autora:", e));
  }

  function openCreate() {
    setEditing(null);
    setForm({ naslov: "", izdavac: "", godinaIzdanja: "", brojDosupnihPrimeraka: "", zanr: "", autori: [], slika: "", opis: "" });
    setAuthorsList([]);
    setOpen(true);
  }

  function startEdit(row) {
    setEditing(row);
    setAuthorsList(row.autori ?? []);
    setOpen(true);
    setForm({ ...row, opis: row.opis ?? "" });
  }

  function closeDialog() {
    setOpen(false);
    setEditing(null);
    setAuthorsList([]);
    setForm({ naslov: "", izdavac: "", godinaIzdanja: "", brojDosupnihPrimeraka: "", zanr: "", autori: [], slika: "", opis: "" });
  }

  async function handleSave(e) {
    e.preventDefault();

    if (!form.naslov.trim() || !form.izdavac.trim() || !form.godinaIzdanja || !form.brojDosupnihPrimeraka || !form.zanr.trim()) {
      alert("Sva polja su obavezna!");
      return;
    }

    if ((authorsList ?? []).length === 0) {
      alert("Morate dodati bar jednog autora.");
      return;
    }

    const knjigaPayload = {
      naslov: form.naslov,
      izdavac: form.izdavac,
      godinaIzdanja: Number(form.godinaIzdanja),
      brojDosupnihPrimeraka: Number(form.brojDosupnihPrimeraka),
      zanr: form.zanr,
      slika: form.slika,
      opis: form.opis,
    };

    try {
      let knjigaId;
      if (!editing) {
        const res = await http.post("/knjiga", knjigaPayload);
        knjigaId = res.data.id;
      } else {
        await http.put(`/knjiga/${editing.id}`, knjigaPayload);
        knjigaId = editing.id;
      }

      const payload = (authorsList ?? []).map((autor) => ({
        autor: { id: autor.id },
        knjiga: { id: knjigaId },
      }));
      if (payload.length > 0) {
        await http.post("/knjiga/autor", payload);
      } else {
        console.warn("Nema autora za povezivanje sa knjigom.");
      }


      fetchBooks();
      closeDialog();
    } catch (e) {
      alert(e?.response?.data?.message || e.message);
    }
  }

  const handleDeleteClick = (row) => {
    setDeleteModal({ show: true, knjigaId: row.id, knjigaNaslov: row.naslov });
  };

  const confirmDelete = async () => {
    try {
      await http.delete(`/knjiga/${deleteModal.knjigaId}`);
      setRows((prev) => prev.filter((r) => r.id !== deleteModal.knjigaId));
    } catch (e) {
      alert(e?.response?.data?.message || e.message);
    } finally {
      setDeleteModal({ show: false, knjigaId: null, knjigaNaslov: "" });
    }
  };

  const cancelDelete = () => {
    setDeleteModal({ show: false, knjigaId: null, knjigaNaslov: "" });
  };

  function addAuthorToBook() {
    if (!selectedAuthor) return;
    const autor = allAuthors.find((a) => a.id === Number(selectedAuthor));
    if (!autor) return;
    if (authorsList.some((a) => a.id === autor.id)) {
      alert("Ovaj autor je već dodat.");
      return;
    }
    setAuthorsList((prev) => [...prev, autor]);
    setSelectedAuthor("");
  }

  function handleAuthorChange(e) {
    const { name, value } = e.target;
    setAuthorFormData((f) => ({ ...f, [name]: value }));
  }

  async function saveAuthor() {
    if (!authorFormData.ime.trim() || !authorFormData.prezime.trim() || !authorFormData.biografija.trim()) {
      alert("Sva polja su obavezna!");
      return;
    }

    try {
      await http.post("/autori", authorFormData);
      fetchAllAuthors();
      setAuthorModalOpen(false);
      setAuthorFormData({ ime: "", prezime: "", biografija: "" });
    } catch (e) {
      alert(e?.response?.data?.message || e.message);
    }
  }

  const filteredRows = rows.filter((row) => {
    return Object.entries(row).some(([key, val]) => {
      if (key === "autori") {
        const authorsStr = (val ?? []).map((a) => `${a.ime} ${a.prezime}`).join(" ");
        return authorsStr.toLowerCase().includes(q.toLowerCase());
      }
      return val != null && val.toString().toLowerCase().includes(q.toLowerCase());
    });
  });

  const buttonStyle = {
    backgroundColor: "#655a7cff",
    color: "#fff",
    minWidth: 140,
    height: 42,
    padding: "6px 16px",
    fontSize: 14,
    textTransform: "none",
    "&:hover": { backgroundColor: "#7b66b1ff" },
  };

  const formButtonStyle = {
    ...buttonStyle,
    minWidth: 120,
    height: 38,
    fontSize: 13,
  };

  const srLocaleText = {
    noRowsLabel: 'Nema redova',
    noResultsOverlayLabel: 'Nema rezultata.',
    errorOverlayDefaultLabel: 'Došlo je do greške.',

    toolbarColumns: 'Kolone',
    toolbarColumnsLabel: 'Prikaži/sakrij kolone',
    toolbarColumnsPanelTitle: 'Upravljanje kolonama',
    columnsPanelTextFieldLabel: 'Pronađi kolonu',
    columnsPanelTextFieldPlaceholder: 'Naslov kolone',
    columnsPanelShowAllButton: 'Prikaži sve',
    columnsPanelHideAllButton: 'Sakrij sve',
    columnMenuManageColumns: 'Upravljaj kolonama',
    columnMenuShowHideColumns: 'Prikaži/sakrij kolone',


    toolbarFilters: 'Filteri',
    toolbarFiltersLabel: 'Prikaži/sakrij filtere',
    toolbarFiltersPanelTitle: 'Filteri',
    toolbarFiltersPanelShowFilters: 'Prikaži filtere',
    toolbarFiltersPanelHideAll: 'Sakrij sve',
    filterPanelOperator: 'Operator',
    filterPanelOperatorAnd: 'I',
    filterPanelOperatorOr: 'ILI',
    filterPanelColumns: 'Kolone',
    filterPanelInputLabel: 'Vrednost',
    filterPanelInputPlaceholder: 'Vrednost filtera',

    columnMenuLabel: 'Meni kolone',
    columnMenuShowColumns: 'Prikaži kolone',
    columnMenuFilter: 'Filtriraj',
    columnMenuHideColumn: 'Sakrij kolonu',
    columnMenuUnsort: 'Poništi sortiranje',
    columnMenuSortAsc: 'Sortiraj rastuće',
    columnMenuSortDesc: 'Sortiraj opadajuće',
    columnMenuShowColumn: 'Prikaži kolonu',

    toolbarQuickFilterPlaceholder: 'Pretraži...',
    toolbarQuickFilterLabel: 'Pretraga',
    toolbarQuickFilterDeleteIconLabel: 'Obriši',

    toolbarExport: 'Izvezi',
    toolbarExportLabel: 'Izvezi',
    toolbarExportCSV: 'Preuzmi kao CSV',
    toolbarExportPrint: 'Štampaj',
    toolbarExportExcel: 'Preuzmi kao Excel',

    footerRowSelected: (count) =>
      count !== 1 ? `${count} redova selektovano` : `${count} red selektovan`,
    footerTotalRows: 'Ukupno redova:',
    footerTotalVisibleRows: (visibleCount, totalCount) =>
      `${visibleCount} od ${totalCount !== -1 ? totalCount : `više od ${visibleCount}`}`,

    paginationRowsPerPage: 'Redova po stranici:',
    MuiTablePagination: {
      labelRowsPerPage: 'Redova po stranici:',
      labelDisplayedRows: ({ from, to, count }) =>
        `${from}-${to} od ${count !== -1 ? count : `više od ${to}`}`,
    },

  };

  return (
    <div className="books-wrap">
      <Box sx={{ p: 2 }}>
        <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ color: "#655a7cff" }}>Knjige</Typography>
            <Typography variant="body2" sx={{ color: "#655a7cff" }}>Prikaz svih knjiga.</Typography>
          </Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <TextField
              label="Pretraži knjige"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              variant="outlined"

              size="small"
              sx={{
                minHeight: 35,
                width: 180,
                '& .MuiInputBase-input': { paddingY: '4px' },
              }}
            />
            <Button
              variant="contained"
              disableElevation
              sx={{ ...buttonStyle, minHeight: 40 }}
              onClick={() => setQ("")}
            >
              Osveži
            </Button>
          </Stack>
        </Stack>

        <Stack direction="row" sx={{ mb: 2 }}>
          <Button variant="contained" disableElevation sx={buttonStyle} onClick={openCreate}>+ Nova Knjiga</Button>
        </Stack>

        <div style={{ height: 560, width: "100%" }}>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            loading={loading}
            disableRowSelectionOnClick
            initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
            pageSizeOptions={[5, 10, 25, 50]}
            slots={{ toolbar: GridToolbar }}
            localeText={srLocaleText}
          />
        </div>
        <Dialog
          open={opisDialog.open}
          onClose={() => setOpisDialog({ open: false, text: "" })}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ color: "#655a7cff" }}>Opis knjige</DialogTitle>
          <DialogContent>
            <Typography variant="body1">{opisDialog.text}</Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" disableElevation sx={formButtonStyle} onClick={() => setOpisDialog({ open: false, text: "" })}>
              Zatvori
            </Button>
          </DialogActions>
        </Dialog>


        <Dialog open={open} onClose={closeDialog} maxWidth="sm" fullWidth>
          <form onSubmit={handleSave}>
            <DialogTitle sx={{ color: "#655a7cff" }}>
              {editing ? "Izmeni knjigu" : "Nova knjiga"}
            </DialogTitle>
            <DialogContent>
              <Stack spacing={2} sx={{ mt: 1 }}>
                {["Naslov", "Izdavac", "Godina izdanja", "Broj dostupnih primeraka"].map((field) => {
                  const fieldMap = {
                    "Naslov": "naslov",
                    "Izdavac": "izdavac",
                    "Godina izdanja": "godinaIzdanja",
                    "Broj dostupnih primeraka": "brojDosupnihPrimeraka"
                  };
                  const isNumber = field.includes("Godina") || field.includes("Broj");
                  const formKey = fieldMap[field];

                  return (
                    <TextField
                      key={field}
                      label={field}
                      value={form[formKey]}
                      type={isNumber ? "number" : "text"}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, [formKey]: isNumber ? Number(e.target.value) : e.target.value }))
                      }
                      fullWidth
                      InputLabelProps={{ sx: { color: "#655a7cff" } }}
                      inputProps={isNumber ? { min: 0 } : {}}
                    />
                  );
                })}
                <TextField
                  label="Opis knjige"
                  value={form.opis}
                  onChange={(e) => setForm((f) => ({ ...f, opis: e.target.value }))}
                  fullWidth
                  multiline
                  rows={4}
                  InputLabelProps={{ sx: { color: "#655a7cff" } }}
                />

                <TextField
                  select
                  label="Žanr"
                  value={form.zanr}
                  onChange={(e) => setForm((f) => ({ ...f, zanr: e.target.value }))}
                  fullWidth
                  InputLabelProps={{ sx: { color: "#655a7cff" } }}
                >
                  {zanrovi.map((z) => (
                    <MenuItem key={z} value={z}>
                      {z.replace(/_/g, " ")}
                    </MenuItem>
                  ))}
                </TextField>

                <Box>
                  <Typography variant="subtitle2" sx={{ color: "#655a7cff", mb: 1 }}>
                    Slika knjige:
                  </Typography>
                  <input
                    accept="image/*"
                    style={{ display: "none" }}
                    id="upload-slika"
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setForm((f) => ({ ...f, slika: reader.result }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <label htmlFor="upload-slika">
                    <Button
                      variant="contained"
                      component="span"
                      sx={{
                        backgroundColor: "#655a7cff",
                        color: "#fff",
                        textTransform: "none",
                        "&:hover": { backgroundColor: "#7b66b1ff" },
                      }}
                    >
                      Izaberi sliku
                    </Button>
                  </label>
                  <Typography
                    variant="body2"
                    sx={{ ml: 2, display: "inline", color: "#655a7cff" }}
                  >
                    {form.slika ? "Fajl je izabran ✅" : "Nijedan fajl nije izabran"}
                  </Typography>
                </Box>

                {/* Autori */}
                <Box>
                  <Typography variant="subtitle1" sx={{ color: "#655a7cff" }}>Autori:</Typography>
                  <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                    <TextField
                      select
                      label="Izaberi autora"
                      value={selectedAuthor}
                      onChange={(e) => setSelectedAuthor(e.target.value)}
                      sx={{ minWidth: 200 }}
                      InputLabelProps={{ sx: { color: "#655a7cff" } }}
                    >
                      {allAuthors.map((a) => (
                        <MenuItem key={a.id} value={a.id}>
                          {a.ime} {a.prezime}
                        </MenuItem>
                      ))}
                    </TextField>
                    <Button variant="contained" disableElevation sx={formButtonStyle} onClick={addAuthorToBook}>Dodaj</Button>
                    <Button variant="contained" disableElevation sx={formButtonStyle} onClick={() => setAuthorModalOpen(true)}>+ Novi autor</Button>
                  </Stack>

                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ color: "#655a7cff" }}>Ime</TableCell>
                        <TableCell sx={{ color: "#655a7cff" }}>Prezime</TableCell>
                        <TableCell sx={{ color: "#655a7cff" }}>Akcije</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(authorsList ?? []).map((a, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{a.ime}</TableCell>
                          <TableCell>{a.prezime}</TableCell>
                          <TableCell>
                            <IconButton onClick={() => setAuthorsList((prev) => prev.filter((_, i) => i !== idx))}>
                              <Delete fontSize="small" sx={{ color: "#655a7cff" }} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </Stack>
            </DialogContent>

            <DialogActions>
              <Button variant="contained" disableElevation sx={formButtonStyle} onClick={closeDialog}>Odustani</Button>
              <Button variant="contained" disableElevation type="submit" sx={formButtonStyle}>Sačuvaj</Button>
            </DialogActions>
          </form>
        </Dialog>
        <Dialog
          open={authorModalOpen}
          onClose={() => setAuthorModalOpen(false)}
          maxWidth="xs"
          fullWidth
          PaperProps={{ sx: { minHeight: 480, p: 3 } }}
        >
          <DialogTitle sx={{ color: "#655a7cff", mb: 2 }}>Kreiraj novog autora</DialogTitle>
          <DialogContent>
            <Stack spacing={2}>
              <TextField
                label="Ime"
                name="ime"
                value={authorFormData.ime}
                onChange={handleAuthorChange}
                fullWidth
                size="small"
                margin="dense"
                InputLabelProps={{ sx: { color: "#655a7cff" } }}
              />

              <TextField
                label="Prezime"
                name="prezime"
                value={authorFormData.prezime}
                onChange={handleAuthorChange}
                fullWidth
                size="small"
                margin="dense"
                InputLabelProps={{ sx: { color: "#655a7cff" } }}
              />
              <TextField
                label="Biografija"
                name="biografija"
                value={authorFormData.biografija}
                onChange={handleAuthorChange}
                fullWidth
                multiline
                rows={5}
                margin="dense"
                InputLabelProps={{ sx: { color: "#655a7cff" } }}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" disableElevation sx={formButtonStyle} onClick={() => setAuthorModalOpen(false)}>Odustani</Button>
            <Button variant="contained" disableElevation sx={formButtonStyle} onClick={saveAuthor}>Sačuvaj</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={deleteModal.show} onClose={cancelDelete} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ color: "#655a7cff" }}>Potvrda brisanja knjige</DialogTitle>
          <DialogContent>
            <Typography variant="body1" sx={{ color: "#00000" }}>
              Da li ste sigurni da želite da obrišete knjigu:<br />
              <strong>{deleteModal.knjigaNaslov}</strong>
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" disableElevation sx={formButtonStyle} onClick={confirmDelete}>OK</Button>
            <Button variant="contained" disableElevation sx={formButtonStyle} onClick={cancelDelete}>Odustani</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </div>
  );
}
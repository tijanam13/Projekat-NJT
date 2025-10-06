import React, { useState, useEffect } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  TextField,
  Button,
} from "@mui/material";
import http from "../api/http";
import "../css/Autori.css";

const Autori = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [authorModalOpen, setAuthorModalOpen] = useState(false);
  const [authorFormData, setAuthorFormData] = useState({ ime: "", prezime: "", biografija: "" });
  const [formType, setFormType] = useState("");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState({ by: "id", dir: "asc" });
  const [deleteModal, setDeleteModal] = useState({ show: false, autorId: null, message: "" });

  const [biographyViewModalOpen, setBiographyViewModalOpen] = useState(false);
  const [currentBiography, setCurrentBiography] = useState({ ime: "", prezime: "", biografija: "" });


  const formButtonStyle = {
    backgroundColor: "#655a7cff",
    color: "#fff",
    minWidth: 100,
    "&:hover": { backgroundColor: "#7b66b1ff" },
    textTransform: "none",
  };

  const readMoreButtonStyle = {
    color: "#7b66b1ff",
    textTransform: "none",
    minWidth: 0,
    padding: '2px 5px',
    fontSize: '0.75rem',
    '&:hover': {
      backgroundColor: 'transparent',
      textDecoration: 'underline',
    },
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    http
      .get("/autori")
      .then((res) => setData(Array.isArray(res.data) ? res.data : []))
      .catch((e) => setError(e?.response?.data?.message || e.message))
      .finally(() => setLoading(false));
  };

  const openCreateModal = () => {
    setFormType("create");
    setAuthorFormData({ ime: "", prezime: "", biografija: "" });
    setAuthorModalOpen(true);
  };

  const openEditModal = (autor) => {
    setFormType("edit");
    setAuthorFormData({ ime: autor.ime, prezime: autor.prezime, biografija: autor.biografija });
    setCurrentBiography(autor);
    setAuthorModalOpen(true);
  };

  const handleAuthorChange = (e) => {
    setAuthorFormData({ ...authorFormData, [e.target.name]: e.target.value });
  };

  const saveAuthor = async () => {
    if (!authorFormData.ime.trim() || !authorFormData.prezime.trim() || !authorFormData.biografija.trim()) {
      alert("Sva polja su obavezna!");
      return;
    }
    try {
      if (formType === "create") {
        await http.post("/autori", authorFormData);
      } else if (formType === "edit") {
        await http.put(`/autori/${currentBiography.id}`, authorFormData);
      }
      fetchData();
      setAuthorModalOpen(false);
      setCurrentBiography({ ime: "", prezime: "", biografija: "" });
    } catch (e) {
      alert(e?.response?.data?.message || e.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await http.get(`/knjiga/autor/${id}`);
      const knjige = Array.isArray(res.data) ? res.data : [];
      let confirmMsg = knjige.length
        ? (
          <>
            Autor je povezan sa knjigama:
            <br />
            {knjige.map((k) => <span key={k.id}>{k.naslov}<br /></span>)}
            Da li želite da obrišete autora i sve njegove veze sa knjigama?
          </>
        )
        : "Da li ste sigurni da želite da obrišete ovog autora?";
      setDeleteModal({ show: true, autorId: id, message: confirmMsg });
    } catch (e) {
      alert(e?.response?.data?.message || e.message);
    }
  };

  const confirmDelete = async () => {
    try {
      await http.delete(`/autori/${deleteModal.autorId}`);
      setData(data.filter(a => a.id !== deleteModal.autorId));
    } catch (e) {
      alert(e?.response?.data?.message || e.message);
    } finally {
      setDeleteModal({ show: false, autorId: null, message: "" });
    }
  };

  const cancelDelete = () => {
    setDeleteModal({ show: false, autorId: null, message: "" });
  };

  const openBiographyViewModal = (autor) => {
    setCurrentBiography(autor);
    setBiographyViewModalOpen(true);
  };

  const closeBiographyViewModal = () => {
    setBiographyViewModalOpen(false);
    setCurrentBiography({ ime: "", prezime: "", biografija: "" });
  };


  let prikazani = data.filter(
    (r) =>
      r.ime.toLowerCase().includes(q.toLowerCase()) ||
      r.prezime.toLowerCase().includes(q.toLowerCase()) ||
      (r.biografija && r.biografija.toLowerCase().includes(q.toLowerCase()))
  );

  prikazani.sort((a, b) => {
    let fieldA = a[sort.by];
    let fieldB = b[sort.by];

    if (typeof fieldA === "number" && typeof fieldB === "number") return sort.dir === "asc" ? fieldA - fieldB : fieldB - fieldA;
    fieldA = fieldA ? fieldA.toString().toLowerCase() : "";
    fieldB = fieldB ? fieldB.toString().toLowerCase() : "";
    if (fieldA < fieldB) return sort.dir === "asc" ? -1 : 1;
    if (fieldA > fieldB) return sort.dir === "asc" ? 1 : -1;
    return 0;
  });

  const BIOGRAPHY_TRUNCATE_LENGTH = 100;

  return (
    <div className="container admin-wrap">
      <header className="admin-head">
        <div>
          <h1>Autori</h1>
          <p className="muted">Prikaz svih autora.</p>
        </div>
        <div className="row-gap">
          <input
            className="input"
            placeholder="Pretraži"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button className="btn" onClick={() => setQ("")}>Osveži</button>
        </div>
      </header>

      <div style={{ margin: "20px 0" }}>
        <p className="add-author-text">Dodaj novog autora:</p>
        <button className="btn" onClick={openCreateModal}>Dodaj</button>
      </div>

      {loading && <p className="loading">Učitavanje...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <table className="table">
          <thead>
            <tr>
              <th onClick={() => setSort({ by: "id", dir: sort.dir === "asc" ? "desc" : "asc" })}>ID</th>
              <th onClick={() => setSort({ by: "ime", dir: sort.dir === "asc" ? "desc" : "asc" })}>Ime</th>
              <th onClick={() => setSort({ by: "prezime", dir: sort.dir === "asc" ? "desc" : "asc" })}>Prezime</th>
              <th>Biografija</th>
              <th>Akcije</th>
            </tr>
          </thead>
          <tbody>
            {prikazani.map((autor) => (
              <tr key={autor.id}>
                <td>{autor.id}</td>
                <td>{autor.ime}</td>
                <td>{autor.prezime}</td>
                <td>
                  {autor.biografija && autor.biografija.length > BIOGRAPHY_TRUNCATE_LENGTH ? (
                    <>
                      {autor.biografija.substring(0, BIOGRAPHY_TRUNCATE_LENGTH) + "..."}
                      <Button
                        onClick={() => openBiographyViewModal(autor)}
                        sx={readMoreButtonStyle}
                      >
                        Pročitaj celu
                      </Button>
                    </>
                  ) : (
                    autor.biografija
                  )}
                </td>
                <td>
                  <button className="btn-icon" onClick={() => openEditModal(autor)} title="Izmeni"><FaEdit /></button>
                  <button className="btn-icon" onClick={() => handleDelete(autor.id)} title="Obriši"><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Dialog
        open={authorModalOpen}
        onClose={() => setAuthorModalOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { minHeight: 480, p: 3 } }}
      >
        <DialogTitle sx={{ color: "#655a7cff", mb: 2 }}>{formType === "create" ? "Kreiraj novog autora" : "Promeni autora"}</DialogTitle>
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

      <Dialog
        open={biographyViewModalOpen}
        onClose={closeBiographyViewModal}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { minHeight: 400, p: 3 } }}
      >
        <DialogTitle sx={{ color: "#655a7cff", mb: 2 }}>Biografija autora: {currentBiography.ime} {currentBiography.prezime}</DialogTitle>
        <DialogContent dividers>
          <p style={{ whiteSpace: 'pre-wrap' }}>{currentBiography.biografija}</p>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" disableElevation sx={formButtonStyle} onClick={closeBiographyViewModal}>Zatvori</Button>
        </DialogActions>
      </Dialog>

      {deleteModal.show && (
        <div className="my-custom-modal" onClick={cancelDelete}>
          <div className="modal-content-wrapper" onClick={(e) => e.stopPropagation()}>
            <p>{deleteModal.message}</p>
            <div className="modal-buttons">
              <button className="btn" onClick={confirmDelete}>OK</button>
              <button className="btn-close" onClick={cancelDelete}>Odustani</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Autori;
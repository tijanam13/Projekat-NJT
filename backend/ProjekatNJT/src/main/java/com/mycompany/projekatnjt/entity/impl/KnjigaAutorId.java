package com.mycompany.projekatnjt.entity.impl;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class KnjigaAutorId implements Serializable {

    private Long knjigaId;
    private Long autorId;

    public KnjigaAutorId() {
    }

    public KnjigaAutorId(Long knjigaId, Long autorId) {
        this.knjigaId = knjigaId;
        this.autorId = autorId;
    }

    public Long getKnjigaId() {
        return knjigaId;
    }

    public void setKnjigaId(Long knjigaId) {
        this.knjigaId = knjigaId;
    }

    public Long getAutorId() {
        return autorId;
    }

    public void setAutorId(Long autorId) {
        this.autorId = autorId;
    }

    @Override
    public int hashCode() {
        int hash = 7;
        hash = 53 * hash + Objects.hashCode(this.knjigaId);
        hash = 53 * hash + Objects.hashCode(this.autorId);
        return hash;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        final KnjigaAutorId other = (KnjigaAutorId) obj;
        if (!Objects.equals(this.knjigaId, other.knjigaId)) {
            return false;
        }
        return Objects.equals(this.autorId, other.autorId);
    }

}

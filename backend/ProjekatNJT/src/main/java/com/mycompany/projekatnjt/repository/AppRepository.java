package com.mycompany.projekatnjt.repository;

import java.util.List;

public interface AppRepository<E, ID> {

    List<E> findAll();

    E findById(ID id) throws Exception;

    void save(E entity);

    void deleteById(ID id);

}

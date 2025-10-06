package com.mycompany.projekatnjt.mapper;

public interface DtoEntityMapper<T, E> {

    T toDto(E e);

    E toEntity(T t);

}

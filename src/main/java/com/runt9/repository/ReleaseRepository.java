package com.runt9.repository;

import com.runt9.model.Release;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReleaseRepository extends ElasticsearchRepository<Release, String> {
    List<Release> findByProjectId(@Param("projectId") String projectId);
}

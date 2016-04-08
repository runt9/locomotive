package com.runt9.repository;

import com.runt9.model.Project;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

public interface ProjectRepository extends ElasticsearchRepository<Project, String> {
}

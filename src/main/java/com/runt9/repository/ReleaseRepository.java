package com.runt9.repository;

import com.runt9.model.Release;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

public interface ReleaseRepository extends ElasticsearchRepository<Release, String> {
}

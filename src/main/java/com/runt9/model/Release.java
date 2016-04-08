package com.runt9.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;

import java.util.Date;
import java.util.List;

@Document(indexName = "release", type = "release")
public class Release {
    @Id
    String id;
    String projectId;
    String name;
    Date createdAt = new Date();
    Date releasedAt;
    List<Story> stories;

    public Release() {
    }

    public Release(String id, String projectId, String name, Date createdAt, Date releasedAt, List<Story> stories) {
        this.id = id;
        this.projectId = projectId;
        this.name = name;
        this.createdAt = createdAt;
        this.releasedAt = releasedAt;
        this.stories = stories;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getReleasedAt() {
        return releasedAt;
    }

    public void setReleasedAt(Date releasedAt) {
        this.releasedAt = releasedAt;
    }

    public List<Story> getStories() {
        return stories;
    }

    public void setStories(List<Story> stories) {
        this.stories = stories;
    }
}

package com.runt9.model;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
public class Release {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne
    @JoinColumn(name = "project_id")
    Project project;

    String name;

    Date createdAt;

    Date releasedAt;

    @OneToMany(mappedBy = "release", cascade = CascadeType.ALL)
    List<Story> stories;
}

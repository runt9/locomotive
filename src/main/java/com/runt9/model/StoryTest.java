package com.runt9.model;

import javax.persistence.*;
import java.util.List;

@Entity
public class StoryTest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne
    @JoinColumn(name = "story_id")
    Story story;

    String testNotes;

    @ManyToMany
    @JoinTable(name = "story_test_environments",
            joinColumns = {@JoinColumn(name = "story_test_id")},
            inverseJoinColumns = {@JoinColumn(name = "environment_id")})
    List<Environment> environments;

}

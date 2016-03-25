package com.runt9.model;

import javax.persistence.*;
import java.util.List;

@Entity
public class Story {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne
    @JoinColumn(name = "release_id")
    Release release;

    String name;

    String notes;

    @OneToMany(mappedBy = "story", cascade = CascadeType.ALL)
    List<StoryTest> storyTests;

    @ManyToMany
    @JoinTable(name = "story_tags",
            joinColumns = {@JoinColumn(name = "story_id")},
            inverseJoinColumns = {@JoinColumn(name = "tag_id")})
    List<Tag> tags;
}

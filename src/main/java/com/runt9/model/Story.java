package com.runt9.model;

import java.util.List;

public class Story {
    String name;
    String notes;
    List<StoryTest> tests;
    List<String> tags;

    public Story() {
    }

    public Story(String name, String notes, List<StoryTest> tests, List<String> tags) {
        this.name = name;
        this.notes = notes;
        this.tests = tests;
        this.tags = tags;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public List<StoryTest> getTests() {
        return tests;
    }

    public void setTests(List<StoryTest> tests) {
        this.tests = tests;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }
}

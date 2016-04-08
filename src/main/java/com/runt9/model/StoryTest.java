package com.runt9.model;

import java.util.List;

public class StoryTest {
    String testNotes;
    List<String> environments;

    public StoryTest() {
    }

    public StoryTest(String testNotes, List<String> environments) {
        this.testNotes = testNotes;
        this.environments = environments;
    }

    public String getTestNotes() {
        return testNotes;
    }

    public void setTestNotes(String testNotes) {
        this.testNotes = testNotes;
    }

    public List<String> getEnvironments() {
        return environments;
    }

    public void setEnvironments(List<String> environments) {
        this.environments = environments;
    }
}

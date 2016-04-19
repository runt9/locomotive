package com.runt9.model;

import java.util.List;

public class StoryTest {
    String testNotes;
    List<StoryTestEnvironment> environments;

    public StoryTest() {
    }

    public StoryTest(String testNotes, List<StoryTestEnvironment> environments) {
        this.testNotes = testNotes;
        this.environments = environments;
    }

    public String getTestNotes() {
        return testNotes;
    }

    public void setTestNotes(String testNotes) {
        this.testNotes = testNotes;
    }

    public List<StoryTestEnvironment> getEnvironments() {
        return environments;
    }

    public void setEnvironments(List<StoryTestEnvironment> environments) {
        this.environments = environments;
    }
}

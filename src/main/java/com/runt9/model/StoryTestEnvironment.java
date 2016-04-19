package com.runt9.model;

public class StoryTestEnvironment {
    String name;
    boolean completed;

    public StoryTestEnvironment() {
    }

    public StoryTestEnvironment(String name, boolean completed) {
        this.name = name;
        this.completed = completed;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }
}

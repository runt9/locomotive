package com.runt9.model;

public class StoryTestEnvironment {
    String name;
    boolean completed;
    boolean inUse;

    public StoryTestEnvironment() {
    }

    public StoryTestEnvironment(String name, boolean completed, boolean inUse) {
        this.name = name;
        this.completed = completed;
        this.inUse = inUse;
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

    public boolean isInUse() {
        return inUse;
    }

    public void setInUse(boolean inUse) {
        this.inUse = inUse;
    }
}

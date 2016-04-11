# Locomotive
Locomotive is an open-source release train and quality assurance management tool. More details will be provided as time goes by and the application is currently a work-in-progress.

# Developer Environment
Spinning up Locomotive locally is fairly easy, and it's highly recommended you use an IDE, such as IntelliJ IDEA to run the app itself locally. Because the in-memory Elasticsearch service can persist all of its data right into the root of your local repo, there's no need for anything like a Vagrant box!

Simply package the app with:
```
mvn package
```

Then start it with:
```
java -jar target/locomotive-<version>.jar
```

Or just setup a run configuration in IntelliJ and go to town!

### Requirements
- Java 8

### Live Reloading
If you're using IntelliJ, this feature is fairly pointless, as restarting the app on build is very painless. However, if you're just leaving the app running on its own and programming in a text editor, then you're going to be very pleased to know that you do not have to restart the app, or even do a full re-package. A simple re-compile (modifying the classpath) will automatically trigger a restart of the app. When working on web items (namely Javascript and CSS), the livereload script in the browser will happily pull in changes automatically for you! The best way to do this is to have two terminal windows (or tabs) open, one running the app, and the other running the following Maven command when necessary:
```
mvn compile
```

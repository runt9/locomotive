# Locomotive
Locomotive is an open-source release train and quality assurance management tool. More details will be provided as time goes by and the application is currently a work-in-progress.

# Developer Environment
Spinning up Locomotive locally is fairly easy, and it's highly recommended you use an IDE, such as IntelliJ IDEA to run the app itself locally.

### Requirements
- Vagrant >= 1.6
- Ansible >= 1.7
Note that other versions may work, but these are the only versions tested at the moment.

### Vagrant Box
The local database and required libraries are spun up in a local Vagrant box. After cloning the repo, the following command will get your environment ready:
```
vagrant up
```
Once that's done, you can now build and run the app locally, either through your IDE, or by running the following commands (replacing VERSION with the current app version, of course):
```
mvn clean package
java -jar target/locomotive-VERSION.jar
```
This will bind the app to localhost:8080 and connect to the Postgres instance running inside the Vagrant box across port 15432.

### Live Reloading
If you're using IntelliJ, this feature is fairly pointless, as restarting the app on build is very painless. However, if you're just leaving the app running on its own and programming in a text editor, then you're going to be very pleased to know that you do not have to restart the app, or even do a full re-package. A simple re-compile (modifying the classpath) will automatically trigger a restart of the app. When working on web items (namely Javascript and CSS), the livereload script in the browser will happily pull in changes automatically for you! The best way to do this is to have two terminal windows (or tabs) open, one running the app, and the other running the following Maven command when necessary:
```
mvn compile
```

### Doing Everything in the Vagrant Box
If you're so inclined, you can do everything in the Vagrant box. Once you spin the box up and let Ansible provision it for you, the app will be running inside the box and available on your host machine at localhost:8085. The issue is live reloading doesn't quite work, at least not yet. You have to re-package the app with
```
mvn package
```
Then get inside the box with:
```
vagrant ssh
```
And run the following commands:
```
sudo systemctl daemon-reload
sudo service locomotive restart
```
It's something that's being worked on to get the app inside the VM to restart automatically when changes are detected.
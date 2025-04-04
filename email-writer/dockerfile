# Use an openjdk 21 base image for building the application
FROM openjdk:21-jdk-slim as build

# Set the working directory in the container
WORKDIR /app

# Copy the Maven project file into the container
COPY pom.xml ./

# Download the dependencies
RUN mvn dependency:go-offline

# Copy the entire project into the container
COPY src /app/src

# Package the app using Maven
RUN mvn clean package -DskipTests

# Use openjdk 21 image to run the app
FROM openjdk:21-jdk-slim

# Copy the built jar file from the previous step
COPY --from=build /app/target/smart-email-assistant.jar /smart-email-assistant.jar

# Set the command to run the jar
CMD ["java", "-jar", "/smart-email-assistant.jar"]

# Use OpenJDK 21 as the base image for building
FROM openjdk:21-jdk-slim as build

# Install Maven (not preinstalled in slim images)
RUN apt update && apt install -y maven

# Set the working directory
WORKDIR /app

# Copy Maven configuration
COPY email-writer/pom.xml .

# Pre-download dependencies
RUN mvn dependency:go-offline

# Copy the full source code
COPY email-writer/src ./src

# Package the app
RUN mvn clean package -DskipTests

# Runtime image
FROM openjdk:21-jdk-slim

# Copy built JAR from the builder stage
COPY --from=build /app/target/*.jar /app.jar

# Expose application port
EXPOSE 10000

# Command to run the app
CMD ["java", "-jar", "/app.jar"]

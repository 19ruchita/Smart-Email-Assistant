# Use OpenJDK 21 as the base image for building
FROM openjdk:21-jdk-slim as build

# Install Maven (since it's not pre-installed in openjdk images)
RUN apt update && apt install -y maven

# Set the working directory in the container
WORKDIR /app

# Copy only backend files from email-writer
COPY email-writer/pom.xml .

# Download dependencies
RUN mvn dependency:go-offline

# Copy the backend source code
COPY email-writer/src ./src

# Build the application
RUN mvn clean package -DskipTests

# Use OpenJDK 21 as the runtime image
FROM openjdk:21-jdk-slim

# Copy the built JAR file
COPY --from=build /app/target/*.jar /app.jar

# Expose the application port (if needed)
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "/app.jar"]

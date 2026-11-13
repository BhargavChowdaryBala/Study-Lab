# Multi-Stage Dockerfile for Spring Boot deployment on Render
# Stage 1: Build the Application
FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app

# Copy Maven POM and source code
COPY pom.xml .
COPY src ./src

# Build production JAR skipping unit tests
RUN mvn clean package -DskipTests

# Stage 2: Minimal Production JRE Runtime Image
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy compiled JAR from build stage
COPY --from=build /app/target/*.jar app.jar

# Render assigns dynamic port via $PORT
ENV PORT=8080
EXPOSE 8080

# Keep JVM heap usage within Render's free 512MB RAM limit to prevent OOM termination
ENTRYPOINT ["sh", "-c", "java -XX:MaxRAMPercentage=75 -Dserver.port=${PORT:-8080} -jar app.jar"]


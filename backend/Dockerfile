FROM ubuntu:latest
LABEL authors="andres"

ENTRYPOINT ["top", "-b"]


FROM maven:3.9.6-amazoncorretto-17 AS build

WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests


FROM amazoncorretto:17-alpine

WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
# Dockerfile pour le microservice équipement Spring Boot

# Étape 1: Build avec Maven
FROM maven:3.8.4-openjdk-17 AS build

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de configuration Maven
COPY pom.xml .
COPY src ./src

# Construire l'application (skip tests pour accélérer le build)
RUN mvn clean package -DskipTests

# Étape 2: Runtime avec OpenJDK
FROM openjdk:17-jdk-slim

# Créer un utilisateur non-root pour la sécurité
RUN addgroup --system spring && adduser --system spring --ingroup spring

# Installer curl pour le healthcheck
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Définir le répertoire de travail
WORKDIR /app

# Copier le JAR depuis l'étape de build
COPY --from=build /app/target/*.jar app.jar

# Changer le propriétaire du fichier
RUN chown spring:spring app.jar

# Basculer vers l'utilisateur non-root
USER spring:spring

# Exposer le port de l'application
EXPOSE 8085

# Variables d'environnement par défaut
ENV SPRING_PROFILES_ACTIVE=docker
ENV JAVA_OPTS="-Xmx512m -Xms256m"

# Point d'entrée avec optimisations JVM
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Djava.security.egd=file:/dev/./urandom -jar app.jar"]

# Healthcheck pour vérifier que l'application fonctionne
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8085/actuator/health || exit 1
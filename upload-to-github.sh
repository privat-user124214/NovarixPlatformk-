#!/bin/bash
# Dieses Skript fügt das GitHub-Repository hinzu und pusht das Projekt

# Remote-Repository hinzufügen
git remote add origin git@github.com:privat-user124214/downloade.git

# Branch umbenennen, falls nötig
git branch -M main

# Weitere Dateien zum Staging hinzufügen
git add .

# Commit erstellen
git commit -m "Initial commit"

# Hochladen des Codes (hier wirst du nach deinem Benutzernamen und deinem Token gefragt)
git push -u origin main
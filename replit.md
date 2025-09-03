# Messenger-Automated-Bot

## Overview
This is a Facebook Messenger automation bot built with Node.js and the ws3-fca library. The project includes both a backend bot system and a web interface for configuration and monitoring.

## Recent Changes
- **September 03, 2025**: Initial setup for Replit environment
  - Configured server to run on port 5000 with proper host binding for Replit proxy
  - Created required data directories and configuration files
  - Set up workflow for automatic bot server startup
  - Configured deployment for VM target to maintain bot state

## Project Architecture
- **Backend**: Node.js Express server (auto.js) handling bot functionality
- **Frontend**: Static HTML/CSS/JS interface in public/ directory
- **Bot Scripts**: Modular command system in script/ directory
- **Data Storage**: JSON-based configuration and session storage
- **Bot Core**: ws3-fca library for Facebook Messenger integration

## Key Components
- `index.js`: Main entry point that spawns auto.js
- `auto.js`: Core bot server with Express web interface
- `script/`: Contains all bot commands and event handlers
- `public/`: Web interface files (HTML, CSS, JS, images)
- `data/`: Configuration files and user sessions
- `ws3-fca/`: Custom Facebook Chat API library

## Configuration
- Server runs on port 5000 with 0.0.0.0 binding for Replit compatibility
- Automatic restart functionality built-in
- Supports multiple user sessions and command management
- Web interface for bot login and configuration

## Features
- Facebook Messenger bot automation
- Web-based configuration interface
- Multi-user session management
- Command system with cooldowns and permissions
- Auto-restart and error handling
- Modern, responsive web UI with animated background

## User Preferences
- Modern, clean web interface design
- Automated bot functionality for Facebook Messenger
- Easy-to-use web configuration panel
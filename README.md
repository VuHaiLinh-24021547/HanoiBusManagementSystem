# Hanoi Bus Management System

A modern, responsive web application for managing urban bus transit in Hanoi. Built with React and Vite.

## Overview

This system provides a comprehensive suite of tools for three main user roles:

1. **Passengers**
   - View bus routes, schedules, and real-time locations
   - Purchase and manage digital tickets (with QR code generation)
   - Receive notifications about route changes or delays
   - Manage account settings and balance

2. **Dispatchers**
   - Real-time fleet tracking via interactive map
   - Monitor bus statuses (On Route, Maintenance, etc.)
   - Incident management and reporting (Breakdowns, Traffic, etc.)
   - Dynamic route assignment

3. **Administrators**
   - Complete oversight of the system
   - Manage fleet operations and vehicle records
   - Route planning, scheduling, and frequency management
   - User account administration

## Technology Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Maps**: Leaflet & React-Leaflet
- **Data Storage**: LocalStorage (Prototype DB)

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd HanoiBusManagementSystem
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Default Accounts

The system includes pre-configured demo accounts for testing different roles:

- **Passenger**: `passenger@hanoibus.vn` (Pass: `demo`)
- **Admin**: `admin@hanoibus.vn` (Pass: `demo`)
- **Dispatcher**: `dispatcher@hanoibus.vn` (Pass: `demo`)

## Development

This application currently uses a mocked database (`src/lib/db.js`) that persists data to the browser's LocalStorage for demonstration purposes.

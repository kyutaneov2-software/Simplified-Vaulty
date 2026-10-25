Here is a complete, professional `README.md` tailored specifically for **Vaulty**. 

I have replaced the default Expo boilerplate with your project's details, including the features we've built so far, the tech stack, setup instructions, and the future roadmap (like AAL2 and ESP32).

You can replace the entire contents of your `README.md` with this:

```markdown
# 🔒 Vaulty - Smart Rental Vaults

Vaulty is a mobile application designed to manage physical rental vaults connected to an ESP32 microcontroller. Built as a school project, this app provides a secure, real-time interface for users to rent, monitor, and unlock their smart vaults.

## 🚀 Current Features
- **Authentication (Supabase)**: Secure Sign In and Sign Up using email and password.
- **Welcome Screen**: A polished landing page for unauthenticated users.
- **Tab Navigation**: Seamless bottom-tab navigation between Home, Vaults, and Profile.
- **Custom Theme**: A professional "Silver & Blue" design system for a security-focused aesthetic.
- **Platform Awareness**: Optimized for both iOS and Android (Safe Area, Keyboard Avoiding, Tab Bar heights).

## 🛠️ Tech Stack
- **Frontend**: React Native, Expo (Expo Router for file-based routing)
- **Language**: TypeScript
- **Backend & Auth**: Supabase (PostgreSQL, Row Level Security, AAL1 Authentication)
- **Hardware**: ESP32 (Planned integration for physical vault control)
- **Icons**: `@expo/vector-icons` (Ionicons)

## 📂 Project Structure
```text
src/
 ┣ app/                 # Expo Router file-based routing
 ┃ ┣ (auth)/            # Unauthenticated routes (sign-in, sign-up)
 ┃ ┣ (app)/             # Authenticated routes (Home, Vaults, Profile)
 ┃ ┣ _layout.tsx        # Root layout (Auth state protection)
 ┃ ┗ index.tsx          # Welcome Screen
 ┣ context/             # AuthContext for managing session state
 ┣ lib/                 # Supabase client initialization
 ┗ theme/               # Global Silver & Blue design system
```

## ⚙️ Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) installed
- [Expo Go](https://expo.dev/go) app on your physical device (or an emulator)
- A [Supabase](https://supabase.com/) account and project

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone <your-repo-url>
cd Vaulty
npm install
```

### 3. Environment Variables
Create a `.env` file in the root of your project and add your Supabase credentials:
```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```
*(You can find these in your Supabase Dashboard under **Project Settings -> API**)*

### 4. Database Setup
Ensure your Supabase database has the required tables (`profiles`, `vaults`, `rentals`) and **Row Level Security (RLS)** enabled. *(Refer to the project SQL scripts for the exact schema and security policies).*

### 5. Run the App
```bash
npx expo start
```
Scan the QR code with **Expo Go** or press `a`/`i` to run on an Android/iOS emulator.

## 🗺️ Roadmap
- [x] UI/UX Foundation & Theme
- [x] Supabase Email Auth (AAL1)
- [x] Basic Tab Navigation
- [ ] **AAL2 (MFA)**: Custom Supabase Edge Function for TOTP generation.
- [ ] **Vaults Screen**: Fetch and display real-time vault statuses from the database.
- [ ] **ESP32 Integration**: Connect the app to the physical prototype via Supabase Realtime or WebSockets.

## 📚 Learn More
- [Expo Documentation](https://docs.expo.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [Expo Router](https://docs.expo.dev/router/introduction)

---
*Created for our school project. Securing the future of rentals, one vault at a time.*
```

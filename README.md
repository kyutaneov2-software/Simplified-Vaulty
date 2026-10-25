# 🔒 Vaulty - Smart Rental Vaults

Vaulty is a mobile application designed to manage physical rental vaults connected to an ESP32 microcontroller. Built as a school project, this app provides a secure, real-time interface for users to rent, monitor, and unlock their smart vaults — protected by **enterprise-grade multi-factor authentication**.

---

## 🚀 Current Features

### Authentication & Security
- **Email/Password Auth (AAL1)**: Secure sign-up and sign-in powered by Supabase Auth.
- **Two-Factor Authentication (AAL2 / TOTP)**: Full TOTP enrollment flow with QR code scanning and 6-digit verification. Compatible with Google Authenticator, Authy, and Microsoft Authenticator.
- **Session Protection**: Automatic route guards that enforce both authentication *and* assurance level (`aal1` vs `aal2`) before granting access.
- **MFA Challenge on Login**: Users with active MFA are forced to enter their code after password sign-in — no bypass.
- **Secure Token Management**: JWT access tokens auto-refresh; refresh tokens stored securely via `AsyncStorage`.

### User Interface
- **Welcome Screen**: Polished landing page introducing Vaulty to new users.
- **Tab Navigation**: Seamless bottom-tab navigation between **Home**, **Vaults**, and **Profile**.
- **Custom Theme**: A professional "Silver & Blue" design system built around security and trust.
- **Platform Awareness**: Optimized for both iOS and Android (Safe Area, Keyboard Avoiding, platform-specific Tab Bar heights, native focus states for icons).
- **Dynamic Profile UI**: Live MFA status indicator — shows "Enabled (TOTP)" or "Setup Authenticator" based on real database state.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React Native, Expo (SDK 54+), Expo Router (file-based routing) |
| **Language** | TypeScript |
| **Auth & Backend** | Supabase (PostgreSQL, Row Level Security, AAL1 + AAL2) |
| **QR Codes** | `react-native-qrcode-svg` + `react-native-svg` |
| **Icons** | `@expo/vector-icons` (Ionicons) |
| **Local Storage** | `@react-native-async-storage/async-storage` |
| **Hardware** | ESP32 (planned integration for physical vault control) |

---

## 🔐 Security Model

Vaulty implements a **defense-in-depth** approach:

| Layer | Mechanism | Enforced By |
|---|---|---|
| **Transport** | HTTPS (TLS 1.2+) | Supabase API |
| **Password Storage** | bcrypt hashing (salted) | Supabase Auth (GoTrue) |
| **Session Tokens** | Signed JWTs (1h expiry) + refresh tokens | Supabase Auth |
| **Data Access** | Row Level Security (RLS) | PostgreSQL policies |
| **MFA** | Time-based One-Time Password (RFC 6238) | Supabase MFA (AAL2) |
| **Route Guards** | `useSegments` + `getAuthenticatorAssuranceLevel()` | App `_layout.tsx` |

**Assurance Levels:**
- **AAL1** = Password verified only.
- **AAL2** = Password + TOTP verified (required to access protected screens once MFA is enrolled).

---

## 📂 Project Structure

```text
src/
 ┣ app/                       # Expo Router file-based routing
 ┃ ┣ (auth)/                  # Unauthenticated routes
 ┃ ┃ ┣ _layout.tsx
 ┃ ┃ ┣ sign-in.tsx
 ┃ ┃ ┗ sign-up.tsx
 ┃ ┣ (app)/                   # Authenticated routes (protected by AAL guard)
 ┃ ┃ ┣ _layout.tsx            # Bottom tab navigator
 ┃ ┃ ┣ HomeScreen.tsx
 ┃ ┃ ┣ Vaults.tsx
 ┃ ┃ ┗ profile.tsx
 ┃ ┣ _layout.tsx              # Root layout (auth + AAL guard)
 ┃ ┣ index.tsx                # Welcome Screen
 ┃ ┣ mfa-setup.tsx            # TOTP enrollment (scan QR + verify)
 ┃ ┗ mfa-challenge.tsx        # TOTP challenge (prompt on login)
 ┣ context/
 ┃ ┗ AuthContext.tsx          # Session management + auth methods
 ┣ lib/
 ┃ ┗ supabase.ts              # Supabase client (AsyncStorage-backed)
 ┗ theme/
   ┗ index.ts                 # Silver & Blue design system
```

---

## ⚙️ Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Expo Go](https://expo.dev/go) app on a physical device **or** Android/iOS emulator
- A [Supabase](https://supabase.com/) account and project

### 2. Installation
```bash
git clone <your-repo-url>
cd Vaulty
npm install
```

### 3. Environment Variables
Create a `.env` file in the project root:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> ⚠️ **Important:** The `anon` key is safe to expose (RLS protects your data). **Never** commit a `service_role` key to the mobile app.

Find both values in **Supabase Dashboard → Project Settings → API**.

### 4. Supabase Configuration

**Step A — Enable Email Auth:**
- Go to **Authentication → Providers → Email** → Enable.

**Step B — Enable TOTP (MFA):**
- Go to **Authentication → Providers → Multi-Factor Authentication (TOTP)** → Enable.

**Step C — Create the database schema:**

Run the following in the **SQL Editor**:

```sql
-- 1. Enum for vault status
CREATE TYPE vault_status AS ENUM ('available', 'locked', 'maintenance');

-- 2. Profiles (linked to auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  updated_at TIMESTAMPTZ,
  username TEXT UNIQUE,
  full_name TEXT,
  CONSTRAINT username_length CHECK (char_length(username) >= 3)
);

-- 3. Vaults (physical ESP32 devices)
CREATE TABLE public.vaults (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  status vault_status NOT NULL DEFAULT 'available',
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. Rentals (user ↔ vault history)
CREATE TABLE public.rentals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  vault_id UUID REFERENCES public.vaults(id) ON DELETE CASCADE NOT NULL,
  start_time TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  end_time TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE NOT NULL
);

-- 5. Indexes
CREATE INDEX idx_rentals_user_id ON public.rentals (user_id);
CREATE INDEX idx_rentals_vault_id ON public.rentals (vault_id);
CREATE INDEX idx_vaults_status ON public.vaults (status);
```

**Step D — Enable RLS + create policies:**

```sql
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vaults ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rentals ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Vaults
CREATE POLICY "Authenticated users can view vaults" ON public.vaults
  FOR SELECT TO authenticated USING (true);

-- Rentals
CREATE POLICY "Users can view own rentals" ON public.rentals
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own rentals" ON public.rentals
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### 5. Run the App

```bash
npx expo start --clear
```

Scan the QR with **Expo Go** or press `a` / `i` for emulator.

---

## 🧪 Testing the Full Auth Flow

Run this checklist to verify everything is wired correctly:

| Step | Expected Result |
|---|---|
| 1. Open app (no session) | Welcome screen appears |
| 2. Tap "Get Started" → sign up | Redirects to Sign Up, then to Home |
| 3. Go to Profile → Two-Factor Auth | "Setup TOTP Authenticator" is shown |
| 4. Tap card → scan QR in authenticator app | QR displays + manual secret shown |
| 5. Enter 6-digit code | "2FA Enabled!" confirmation |
| 6. Sign out | Returns to Welcome |
| 7. Sign in with same email/password | **Immediately prompted** for TOTP code |
| 8. Enter correct code | Lands on Home screen |
| 9. Enter wrong code | Stays on challenge, input clears |
| 10. Kill & reopen app | Session persists (already AAL2) |
| 11. Profile shows "Enabled (TOTP)" in green | ✅ Confirmed |

---

## 🗺️ Roadmap

### ✅ Completed
- [x] UI/UX Foundation & Silver & Blue Theme
- [x] Supabase Email Auth (AAL1)
- [x] Tab Navigation (Home, Vaults, Profile)
- [x] **AAL2 TOTP Enrollment** (QR code + verification)
- [x] **AAL2 TOTP Challenge on Login**
- [x] Route guards for auth + AAL
- [x] Profile screen with live MFA status

### 🚧 In Progress
- [ ] **Vaults Screen**: Fetch and display real vault statuses from Supabase
- [ ] **Rentals Flow**: Rent / return vaults with history

### 🔮 Planned
- [ ] **RLS AAL2 Policies**: Require `aal2` claim for vault unlock actions (defense at DB level)
- [ ] **ESP32 Integration**: Connect physical prototype via Supabase Realtime or WebSockets
- [ ] **Real-time Vault Status**: Live updates using `supabase.channel()`
- [ ] **Push Notifications**: Rental end alerts via `expo-notifications`
- [ ] **Biometric Login**: `expo-local-authentication` as AAL2 shortcut
- [ ] **MFA Management Screen**: Unenroll / re-enroll authenticators

---

## 📚 Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Supabase MFA](https://supabase.com/docs/guides/auth/auth-mfa)
- [RFC 6238 — TOTP Specification](https://datatracker.ietf.org/doc/html/rfc6238)
- [Ionicons Directory](https://icons.expo.fyi/)

---

## 👥 Team

*Created as a school project — combining mobile development, cloud security, and embedded hardware.*

> *"Securing the future of rentals, one vault at a time."* 🔐

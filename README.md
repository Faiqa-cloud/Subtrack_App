<div align="center">

<img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
<img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" />
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white" />
<img src="https://img.shields.io/badge/NativeWind-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />

# 📱 Subscription Tracker

**A clean, modern mobile app to manage all your recurring subscriptions in one place.**

Track renewals · Monitor spending · Stay on top of your subscriptions

</div>

---

## ✨ What it does

- 🔐 **Auth** — Sign up, sign in, email verification via Clerk
- 🏠 **Dashboard** — Overview of all active subscriptions + upcoming renewals
- 📋 **Subscriptions** — View name, price, billing cycle, category, status, renewal date
- 📊 **Insights** — Analytics UI ready for spending trends and charts
- ⚙️ **Settings** — Account management and app preferences
- 🔒 **Protected Routes** — Unauthenticated users can't access the dashboard

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native + Expo |
| Language | TypeScript |
| Navigation | Expo Router (file-based) |
| Styling | NativeWind + Tailwind CSS v4 |
| Auth | Clerk + Expo Secure Store |
| Icons | Ionicons (`@expo/vector-icons`) |
| Fonts | Inter (Regular, SemiBold, Bold, Thin Italic) |
| Analytics | PostHog — user behavior tracking |

---

## 📁 Project Structure

```
├── components/
│   ├── SubscriptionCard.tsx
│   └── UpcomingSubscriptionCard.tsx
├── constants/
│   ├── data.ts        # Static subscription data
│   ├── icons.ts       # Centralized icon references
│   └── theme.ts       # Colors, spacing, design tokens
├── src/app/
│   ├── (auth)/        # SignIn.tsx · SignUp.tsx
│   ├── (tabs)/        # index · subscription · insights · settings
│   ├── subscription/
│   │   └── [id].tsx   # Dynamic subscription detail
│   └── onboarding.tsx
└── assets/fonts/      # Inter font files
```

---

## 🔐 Auth Flow

```
Sign Up → Email + Password → Verify Code → Dashboard
Sign In → Credentials → isSignedIn check → Dashboard
```

Built with `ClerkProvider`, `useSignUp`, `useSignIn`, `useAuth` and secure token caching via `expo-secure-store`.

---
## 🚀 Getting Started

```bash
# 1. Clone
git clone https://github.com/Faiqa-cloud/subscription-tracker.git
cd subscription-tracker

# 2. Install
npm install

# 3. Add environment variables
# Create .env file and add:
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key_here
EXPO_PUBLIC_POSTHOG_API_KEY=your_posthog_key_here
EXPO_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# 4. Run
npx expo start
```

---

## 📌 Current Data

App currently uses structured **local data** (Spotify, Notion, Figma, ChatGPT, Behance, KlingAI).  
Architecture is designed so the data layer can be swapped for a real backend without rebuilding the UI.

---

## 🔮 Planned Features

- [ ] Backend API + database
- [ ] Add / Edit / Delete subscriptions
- [ ] Monthly & yearly spending calculations
- [ ] Spending charts and analytics
- [ ] Push notification reminders
- [ ] Multi-currency support
- [ ] PDF export

---

## 👩‍💻 Author

**Faiqa** — BS Information Technology · React Native Developer  
🔗 [github.com/Faiqa-cloud](https://github.com/Faiqa-cloud)

---

<div align="center">

*If this project helped you or impressed you — drop a ⭐*

</div>

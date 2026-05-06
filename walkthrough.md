# DineReserve - User Walkthrough

Welcome to the **DineReserve** seat booking system! This guide explains how to use the application and how it meets your requirements.

## 🚀 Getting Started

1.  **Access the App**: The frontend is running at `http://localhost:5173`.
2.  **Registration**:
    *   Go to the "Sign Up" page.
    *   Enter your name, email, and password.
    *   **Anti-Fraud Check**: The system captures your device's unique fingerprint. If you try to create another account from the same device, it will be blocked to ensure fair booking.
3.  **Login**: Use your credentials to sign in.

## 🏛️ The Dining Hall

Once logged in, navigate to the **Hall View**.

### Layout Configuration
- **Total Seats**: 40
- **Teacher Seats**: 2 (Located at the top "Head of Table", pre-reserved for faculty).
- **Student Seats**: 38 (Split into two columns of 19 seats each, flanking the central dining table).

### Seat Legend
- 🟢 **Available**: You can click these to select them.
- 🔴 **Occupied**: Already booked by another student. Hover to see who booked it.
- 🟣 **Reserved**: Teacher seats that cannot be booked.
- 🟠 **Your Seat**: Your current booking (highlighted with a golden glow).

## 🪑 Booking a Seat

1.  **Select**: Click on any available (green) seat.
2.  **Confirm**: A confirmation panel will appear at the bottom. Click "Confirm Booking".
3.  **Rule Enforcement**:
    *   **One Seat Only**: You can only book one seat at a time.
    *   **Modification**: To change your seat, you must first "Cancel Booking" on your current seat.

## 🛠️ Tech Stack & Security

-   **Frontend**: React + Vite with a custom CSS design system.
-   **Backend**: Node.js + Express with JWT Auth.
-   **Database**: MongoDB (Seeded with the 40-seat hall layout).
-   **Security**: Device fingerprinting + Rate limiting on auth routes.

Enjoy your meal! 🍽️

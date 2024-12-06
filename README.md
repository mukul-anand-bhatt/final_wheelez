# Peer-to-Peer Scooty Rental App

## Overview
This is a peer-to-peer scooty rental app built to simplify the process of renting and listing two-wheelers. It uses modern web and mobile development technologies to provide an intuitive and seamless user experience.

---

## Features
1. **User Authentication**  
   - Login or sign up using Clerk for secure authentication.

2. **Two Main Pages**  
   - **Map and Listing View:**  
     - Displays a map (powered by Google Maps) showing the user's location and nearby available two-wheelers.  
     - Two-wheelers are also listed below the map for easy browsing.
   - **Listing Page:**  
     - Users can list their two-wheelers by filling out a form with details.  
     - Images uploaded during listing are processed using a Redis-based queue for verification.

3. **Payment Integration**  
   - Secure and easy payments powered by Stripe.

4. **Real-time Updates**  
   - Zustand is used for state management to ensure a responsive and real-time experience.

5. **Tailored UI/UX**  
   - Built using React Native and styled with Tailwind CSS for a modern and consistent interface.

---

## Technologies Used
### Frontend
- **React Native** with **Expo** for cross-platform mobile app development.
- **Tailwind CSS** for UI styling.
- **Google Maps API** for geolocation and map rendering.

### Backend
- **PostgreSQL** (hosted on Neon DB) for data storage.
- **Redis** for queuing and processing images uploaded during listings.
- **Stripe** for secure payment handling.

### State Management
- **Zustand** for efficient state management.

### Authentication
- **Clerk** for user authentication.

---

## How It Works
1. **Login or Signup**  
   - Users authenticate via Clerk on app launch.

2. **View Nearby Two-Wheelers**  
   - On the first main page:
     - See a Google Map with real-time markers for nearby two-wheelers.
     - Browse a list of available two-wheelers below the map.

3. **List Your Two-Wheeler**  
   - On the second main page:
     - Provide details and images for the two-wheeler.
     - Details are stored in PostgreSQL (Neon DB).
     - Uploaded images are added to a Redis queue for verification.

4. **Book and Pay**  
   - Select a two-wheeler, confirm booking, and make a secure payment via Stripe.

---

## Getting Started
### Prerequisites
- Install [Node.js](https://nodejs.org/) and [Expo CLI](https://docs.expo.dev/get-started/installation/).
- Set up a PostgreSQL database on [Neon DB](https://neon.tech/).
- Configure Redis and Stripe keys.

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Install dependencies:
   ```bash
   cd app-directory
   npm install
   ```

3. Start the app:
   ```bash
   expo start
   ```

4. Set up environment variables for Clerk, Stripe, Google Maps API, and Redis.

---

## Future Enhancements
- Implement user reviews and ratings for two-wheelers.
- Add filters for better search functionality.
- Introduce ride tracking and notifications.

---

## Contributors
Feel free to contribute by submitting issues or pull requests. Happy coding! 🚀

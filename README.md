# Roam: Your Next Adventure Awaits

Roam is a web application designed for travelers and adventurers to discover, plan, and join group trips around the world. Whether you're looking to explore a new city or embark on an expedition, Roam connects you with fellow travelers and helps you organize your journey.

## ✨ Features

- **User Authentication:** Secure sign-up and sign-in functionality using **Supabase Auth**, with options for password recovery and protected routes.
- **Trip Creation & Management:** Authenticated users can create detailed trip plans, including destination, dates, budget, and a full description, managed via **React Hook Form**.
- **Interactive Trip Discovery:** Explore upcoming trips on an interactive map powered by **Leaflet.js** and browse through destinations.
- **Destination Photo Showcase:** See beautiful, high-quality photos of trip destinations, fetched dynamically based on location coordinates. The gallery is powered by the **Unsplash API**, with location data from **Geoapify**, and displayed in a responsive, full-width layout using **React Photo Album**.
- **Detailed Trip Pages:** View comprehensive details for each trip, including host information, participant lists, and location maps.
- **Participant Management:** Trip hosts can approve or decline requests from users who want to join their trip.
- **Real-time Trip Chat:** Approved participants can communicate with each other in a real-time chat room for each trip, built with **Supabase Realtime**.
- **User Reviews & Ratings:** After a trip, participants can review and rate the host and fellow travelers to build a trustworthy community.
- **Personalized User Profiles:** Manage your profile information and keep track of the trips you've created or joined.

## 🛠️ Tech Stack

This project is built with a modern, full-stack technology set:

- **Framework:** [Next.js](https://nextjs.org/) (React Framework)
- **Backend & Database:** [Supabase](https://supabase.io/) (including Auth, Database, and Realtime)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** Built with [Shadcn/UI](https://ui.shadcn.com/), which uses [Radix UI](https://www.radix-ui.com/) primitives.
- **Map Library:** [Leaflet.js](https://leafletjs.com/) & [React Leaflet](https://react-leaflet.js.org/)
- **Image Gallery:** [React Photo Album](https://react-photo-album.com/) with [Yet Another React Lightbox](https://yet-another-react-lightbox.com/)
- **External APIs:** [Unsplash API](https://unsplash.com/developers) for photos, [Geoapify](https://www.geoapify.com/) for reverse geocoding.
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Forms:** [React Hook Form](https://react-hook-form.com/)

---

This README provides a general overview of the Roam application.


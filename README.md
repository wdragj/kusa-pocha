# Kusa Pocha Order System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-v14-blue?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)

The **Kusa Pocha Order System** is a modern, responsive order management solution tailored for Kusa Pocha. It provides a streamlined interface for customers to place orders and a robust dashboard for administrators to view, manage, and track orders in real time.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
    - [Installation](#installation)
    - [Set Up Environment Variables](#set-up-environment-variables)
    - [Running the Development Server](#running-the-development-server)
- [License](#license)

---

## Overview

The **Kusa Pocha Order System** is built to facilitate a smooth ordering experience while providing powerful administrative tools. The application leverages modern web technologies to deliver a fast, secure, and scalable platform. Whether you are managing day-to-day operations or scaling up for high traffic, this system has you covered.

---

## Features

- **Customer Ordering Interface:**  
  An intuitive and responsive front-end that makes ordering quick and easy.

- **Admin Dashboard:**  
  A comprehensive dashboard for monitoring and managing incoming orders, with real-time updates.

- **Performance Optimizations:**  
  Utilizes Next.js's server-side rendering and static optimization for rapid load times and excellent SEO.

- **Modern Development Practices:**  
  Configured with ESLint, Prettier, and TypeScript to ensure code quality and maintainability.

---

## Tech Stack

- **Framework:**  
  [Next.js 14](https://nextjs.org/)

- **UI Components:**  
  A suite of [Heroui components](https://github.com/heroui) (Button, Input, Navbar, etc.) that provide a consistent design language.

- **Styling:**  
  [Tailwind CSS](https://tailwindcss.com/) coupled with [Tailwind Variants](https://github.com/your/tailwind-variants) for custom theming.

- **Animations:**  
  [Framer Motion](https://www.framer.com/motion/) for smooth and dynamic animations.

- **Type Checking:**  
  [TypeScript](https://www.typescriptlang.org/) ensures robust and error-free code.

- **Data & Authentication:**  
  Integrations with Supabase and Neon Database offer seamless data handling and user authentication.

- **Additional Tools:**  
  ESLint, Prettier, and a variety of other utilities streamline the development workflow.

---

## Getting Started

Follow these steps to set up the project on your local machine.

### Installation

1. **Clone the Repository:**

    ```bash
    git clone https://github.com/yourusername/kusa-pocha-order-system.git
    cd kusa-pocha-order-system

    ```

2. **Install Dependencies:**

    ```bash
    npm install
    ```

## Set Up Environment Variables

Create a `.env.local` file in the root directory and add the following environment variables:

    ```bash
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

Replace `your_supabase_url` and `your_supabase_anon_key` with your Supabase project URL and anonymous key, respectively.

## Running the Development Server

    ```bash
    npm run dev
    ```

The application will be accessible at `http://localhost:3000`.

## License

This project is licensed under the MIT License.

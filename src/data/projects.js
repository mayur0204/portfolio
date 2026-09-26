/*
 * PROJECTS — single source of truth for the Work section, the project
 * detail view and the "Ask Mayur" assistant.
 *
 * Every statement here was checked against the repository's README,
 * build files (pom.xml / package.json) and source code. If you edit it,
 * keep it factual — the chatbot repeats whatever is written here.
 *
 * Note: these repositories are hosted under github.com/apeksha0463.
 * They are linked as project references only; Mayur's personal GitHub
 * profile is set separately in src/data/profile.js.
 */

export const projects = [
  {
    slug: 'ecommerce-chatbot',
    number: '01',
    title: 'E-Commerce Chatbot',
    // Words the assistant should recognise as referring to this project.
    aliases: [
      'e-commerce',
      'ecommerce',
      'e commerce',
      'shopping bot',
      'shop bot',
      'commerce chatbot',
      'store bot',
      'whatsapp shopping',
    ],
    categories: ['Chatbot', 'Backend', 'Automation'],
    type: 'WhatsApp commerce bot · Spring Boot service',
    visual: 'commerce',
    repo: 'https://github.com/apeksha0463/e-commerce-chatbot',
    summary:
      'A WhatsApp shopping assistant built with Spring Boot. Customers browse categories and products as carousel cards, then place an order — name, pincode, address and payment method — without leaving the chat.',
    overview:
      'A Spring Boot (Java 17) webhook service that runs a conversational storefront on WhatsApp. It receives incoming messages through AiSensy, guides each customer step by step — menu, categories, sub-categories, products, product details, then checkout — and calls an external commerce backend (the BGS API) for catalogue data, offers, orders and payments.',
    challenge:
      'In a chat there are no pages to click through. Every step has to be expressed as a message, each customer’s progress must be remembered between messages, and prices or stock can change between browsing and checkout.',
    approach: [
      'A per-customer state machine (START → MENU → CATEGORIES → SUBCATEGORIES → PRODUCTS → PRODUCT_DETAILS → ORDER_NAME → ORDER_PINCODE → ORDER_ADDRESS → ORDER_PAYMENT → ORDER_CONFIRM) tracks where each person is in the conversation.',
      'Categories and products are sent as image carousel cards through the AiSensy API, with a numbered text list as the fallback when a carousel cannot be built.',
      'Calls to the commerce backend go through one API client wrapped with Spring Retry (exponential backoff) and a Resilience4j circuit breaker.',
      'A scheduled job ends idle sessions after a configurable timeout (30 minutes by default) and tells the customer.',
      'Shipped as a multi-stage Docker image with Docker Compose and Spring Boot Actuator health checks.',
    ],
    features: [
      'Category, sub-category and product browsing with WhatsApp carousel cards',
      'Product details with stock status, including “only N left” notices',
      'Best-offer discount calculation shown next to prices',
      'Guided checkout that validates the 6-digit pincode and the delivery address',
      'Cash on Delivery or UPI / online payment, with Cashfree payment links generated through the commerce backend',
      'Stock is re-checked right before an order is created',
      '“hi”, “menu” or “0” returns to the main menu at any point',
      'Automatic session timeout with a notification message',
    ],
    tech: [
      'Java 17',
      'Spring Boot 3.2',
      'Spring Retry',
      'Resilience4j',
      'Jackson',
      'Apache HttpClient 5',
      'Spring Boot Actuator',
      'AiSensy WhatsApp API',
      'Cashfree (via BGS API)',
      'Docker',
      'Maven',
    ],
  },
  {
    slug: 'vazraa-website',
    number: '02',
    title: 'Vazraa Website',
    aliases: [
      'vazraa website',
      'vazraa site',
      'website',
      'web site',
      'cab booking website',
      'vazraa mobility website',
      'booking website',
    ],
    categories: ['Web Development', 'Full-Stack'],
    type: 'Cab-booking platform · website + REST API',
    visual: 'web',
    repo: 'https://github.com/apeksha0463/vazraa-website',
    summary:
      'The public website and booking platform for Vazraa Mobility, a cab-booking service: HTML/CSS/JS pages backed by a Node.js and Express API, MongoDB and Cashfree payments, deployed with Docker and Nginx.',
    overview:
      'A unified cab-booking platform. The public site — landing, about, contact, sign-up and login, customer and driver onboarding, ride booking, payment and ride-history pages — is written in plain HTML, CSS and JavaScript. It talks to a Node.js / Express REST API that stores users, drivers, vehicles and bookings in MongoDB. The repository also includes an operations portal (React + TypeScript frontend with a Spring Boot backend) for admin, super-admin and driver work.',
    challenge:
      'One platform has to serve customers, drivers, administrators and a WhatsApp chatbot, with a single source of truth for bookings, separate authentication for each role, and online payments.',
    approach: [
      'Layered Express backend: routes → controllers → services → repositories → Mongoose models, with express-validator on incoming requests.',
      'Separate JWT-protected flows for customers, drivers and admins; passwords hashed with bcrypt.',
      'Cashfree payments are created on the server, so the secret key never reaches the browser.',
      'An AiSensy webhook endpoint lets the WhatsApp chatbot use the same booking backend.',
      'Helmet, request rate limiting (a stricter limit on auth routes), gzip compression, a database-aware /health endpoint and graceful shutdown.',
      'Docker Compose runs MongoDB, the API and an Nginx container that serves the site and reverse-proxies /api/* from the same origin.',
      'API documented with Swagger (swagger-jsdoc + swagger-ui-express).',
    ],
    features: [
      'Customer sign-up, login and profile',
      'Ride booking, booking history, cancellation and ride tracking (tracking and map distance are mocked in v1, per the README)',
      'Driver registration, availability toggle, and accept / start (with OTP) / complete ride',
      'Admin dashboard with stats and lists of customers, drivers and bookings',
      'Vehicle category listing',
      'Online payment through Cashfree with a payment-result page',
      'WhatsApp chatbot webhook (AiSensy)',
      'Interactive API docs at /api-docs',
    ],
    tech: [
      'HTML',
      'CSS',
      'JavaScript',
      'Node.js',
      'Express',
      'MongoDB',
      'Mongoose',
      'JWT',
      'bcrypt',
      'express-validator',
      'Helmet',
      'Swagger',
      'Cashfree',
      'AiSensy',
      'Docker',
      'Nginx',
      'React',
      'TypeScript',
      'Spring Boot',
    ],
  },
  {
    slug: 'vazraa-chatbot',
    number: '03',
    title: 'Vazraa Chatbot',
    aliases: [
      'vazraa chatbot',
      'vazraa bot',
      'cab chatbot',
      'ride chatbot',
      'taxi bot',
      'cab bot',
      'brightcab',
      'ride booking bot',
      'booking chatbot',
    ],
    categories: ['Chatbot', 'Full-Stack'],
    type: 'WhatsApp ride-booking bot · fleet dashboards',
    visual: 'ride',
    repo: 'https://github.com/apeksha0463/vazraa-chatbot',
    summary:
      'A WhatsApp ride-booking chatbot and fleet-management system for Vazraa Mobility. Customers book, pay for and track cabs in WhatsApp, and React dashboards serve admins, super admins, customers and drivers.',
    overview:
      'A Spring Boot backend receives WhatsApp messages through an AiSensy webhook and walks each user through booking a ride in conversation. The same backend powers a React 19 + TypeScript web app with separate interfaces for admins, super admins, customers and drivers, all backed by MongoDB.',
    challenge:
      'Booking a cab over WhatsApp means collecting pickup, drop, vehicle choice, confirmation and payment one message at a time, then coordinating the ride with a driver — while operators need tools to manage drivers, pricing, complaints and live rides.',
    approach: [
      'A conversation state machine (AWAITING_PICKUP → AWAITING_DROP → AWAITING_VEHICLE_SELECTION → AWAITING_CONFIRMATION → AWAITING_PAYMENT → RIDE_ACTIVE → AWAITING_RATING) handles each booking and accepts shared locations as well as text.',
      'Separate conversational flows for driver registration (details, vehicle, Aadhaar, licence and document photos) and for fare estimation.',
      'Drivers accept, reject, start (with the passenger’s OTP) and complete rides from WhatsApp.',
      'Spring Security with JWT, Spring Data MongoDB, and WebSocket (STOMP) broadcasts for live driver location.',
      'React frontend with React Router, Tailwind CSS, Recharts dashboards and Leaflet maps; an Express + Vite dev server proxies API calls to Spring Boot.',
    ],
    features: [
      'Book a ride over WhatsApp: pickup, drop, vehicle category, confirmation',
      'Vehicle categories: Mini, Hatchback, Sedan, SUV, Bike, Auto and Luxury',
      'Fare estimation, Cashfree payment webhooks, ride tracking, cancellation and rating',
      'SOS emergency alerts for customers and drivers',
      'Driver onboarding over WhatsApp, including document uploads',
      'Admin dashboard: drivers, customers, rides, payments, complaints, reports, notifications, WhatsApp bot tools and live tracking',
      'Super-admin dashboard: admins, roles, cities, pricing, fare zones, promotions, analytics, audit logs, security and platform settings',
      'Customer and driver web apps (wallet, activity, earnings, active ride)',
    ],
    tech: [
      'Java 17',
      'Spring Boot 3.2',
      'Spring Security',
      'Spring Data MongoDB',
      'JWT',
      'WebSocket (STOMP)',
      'MongoDB',
      'React 19',
      'TypeScript',
      'Vite',
      'Tailwind CSS',
      'React Router',
      'Recharts',
      'Leaflet',
      'Express',
      'AiSensy WhatsApp API',
      'Cashfree',
      'Google Maps API',
      'Docker',
    ],
  },
];

export const getProject = (slug) => projects.find((p) => p.slug === slug);

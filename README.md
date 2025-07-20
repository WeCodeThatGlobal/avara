# Avara 


![Next.js](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![Medusa](https://img.shields.io/badge/Medusa-purple?style=for-the-badge&logo=medusa&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-blue?style=for-the-badge&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?&style=for-the-badge&logo=redis&logoColor=white)

## About The Project

This repository contains the complete codebase for the Avara e-commerce store. It is structured as a monorepo with two main components:

1.  **`avara/`**: The Medusa backend server. This handles all e-commerce logic, including products, orders, customers, payment processing, and provides a REST API. It also includes the Medusa Admin dashboard for store management.
2.  **`avara-storefront/`**: The Next.js frontend. This is the customer-facing website where users can browse products, add them to a cart, and complete their purchases.

---

## Getting Started

Follow these instructions to get a local copy up and running for development and testing purposes.

### Prerequisites

You need to have the following software installed on machine:

* [Node.js](https://nodejs.org/en/) (v16 or later recommended)
* [Yarn](https://yarnpkg.com/) or npm
* [PostgreSQL](https://www.postgresql.org/download/)
* [Redis](https://redis.io/docs/getting-started/installation/)
* [Medusa CLI](https://docs.medusajs.com/cli/overview)
    ```bash
    npm install -g @medusajs/medusa-cli
    ```

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/WeCodeThatGlobal/avara
    cd avara
    ```

2.  **Set up the Medusa Backend (`avara`):**

    * Navigate to the backend directory:
        ```bash
        cd avara
        ```
    * Install dependencies:
        ```bash
        npm install
        # or
        yarn
        ```

    * **Configure database.** Create a PostgreSQL database and update the `DATABASE_URL` in newly created `.env` file.
        ```env
        # .env in the 'avara' folder
        DATABASE_URL=postgres://<user>:<password>@<host>/<db_name>
        REDIS_URL=redis://localhost:6379
        JWT_SECRET=supersecret
        COOKIE_SECRET=supersecretcookie
        ```
    * Run database migrations:
        ```bash
        medusa migrations run
        ```
    * (Optional but Recommended) Seed the database with sample data to get started quickly:
        ```bash
        medusa seed -f data/seed.json
        ```

3.  **Set up the Next.js Storefront (`avara-storefront`):**

    * Navigate to the storefront directory from the root folder:
        ```bash
        cd ../avara-storefront
        ```
    * Install dependencies:
        ```bash
        npm install
        # or
        yarn
        ```
---

## Running the Development Servers

To run the project, you will need to start both the backend and the storefront servers simultaneously. It's best to use two separate terminal windows.

1.  **Start the Medusa Backend:**
    * In our first terminal, navigate to the `avara` directory and run:
        ```bash
        cd avara
        npm run dev
        ```
    * Medusa backend is now running at `http://localhost:9000`.
    * You can access the Medusa Admin panel at `http://localhost:7001`.

2.  **Start the Next.js Storefront:**
    * In second terminal, navigate to the `avara-storefront` directory and run:
        ```bash
        cd avara-storefront
        npm run dev
        ```
    * Avara storefront is now live at `http://localhost:3000`.

---

## ⚙️ Environment Variables

A summary of the essential environment variables for each part of the project.

### Backend (`avara/.env`)

| Variable        | Description                                                                 | Example                                 |
| :-------------- | :-------------------------------------------------------------------------- | :-------------------------------------- |
| `DATABASE_URL`  | Connection string for your PostgreSQL database.                             | `postgres://user:pass@localhost/medusa` |
| `REDIS_URL`     | Connection string for your Redis instance (used for caching and jobs).      | `redis://localhost:6379`                |
| `JWT_SECRET`    | A secret key for signing JSON Web Tokens (for users).                       | `supersecret`                           |
| `COOKIE_SECRET` | A secret key for signing cookies.                                           | `supersecretcookie`                     |

### Storefront (`avara-storefront/.env.local`)

| Variable                         | Description                                            | Example                    |
| :------------------------------- | :----------------------------------------------------- | :------------------------- |
| `NEXT_PUBLIC_MEDUSA_BACKEND_URL` | The URL of your running Medusa backend API.            | `http://localhost:9000`    |

---

## 📂 Project Structure

```
├── avara/                # Medusa.js Backend
│   ├── src/
│   ├── data/
│   ├── package.json
│   └── medusa-config.js
│
├── avara-storefront/     # Next.js Storefront
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── next.config.js
│
└── README.md
```


# Silang.id Admin Portal - Full Stack Application Documentation

**Version:** 1.0

**Date:** May 3, 2025

**Developed For:** Silang.id Full Stack Developer Recruitment

**GitHub:** https://github.com/achmadardanip/silang-id-crud 

**By:** Achmad Ardani Prasha


---

## 1. Application Overview

### 1.1. Context: Silang.id

Silang.id is a professional Sign Language Interpreter (Juru Bahasa Isyarat - JBI) service platform operating in Indonesia, particularly focused on areas like Jakarta. Its core mission is to foster an inclusive ecosystem by providing high-quality interpretation services for various events (seminars, public services, conferences, personal events, etc.), thereby supporting the activities and accessibility needs of the Deaf community.

### 1.2. Application Purpose

This application, the **Silang.id Admin Portal**, serves as a dedicated backend administration interface for Silang.id staff. It provides administrators with the tools to manage core platform data, starting with user management. This portal is crucial for maintaining the platform's user base, ensuring data integrity, and facilitating smooth operations.

### 1.3. Goal for Recruitment

This application has been developed as a requirement for the Full Stack Developer position at Silang.id. It demonstrates proficiency in building a complete web application using the specified technology stack, including:

* **Backend Development:** Using Laravel (PHP framework) to create a robust RESTful API.
* **Frontend Development:** Using ReactJS (with Vite) to build a responsive and interactive user interface.
* **API Integration:** Connecting the frontend and backend seamlessly.
* **Authentication:** Implementing secure user login, registration (optional), and password management features using Laravel Sanctum.
* **Database Management:** Performing CRUD (Create, Read, Update, Delete) operations on user data stored in a PostgreSQL database (hosted on Supabase).
* **Modern Tooling:** Utilizing tools like Composer, Node.js/npm, Git, and REST principles.

### 1.4. Technology Stack

* **Backend:** Laravel (PHP Framework), Laravel Sanctum (API Authentication)
* **Frontend:** ReactJS (v18+), Vite (Build Tool), `react-router-dom` (Routing), Axios (HTTP Client), `react-data-table-component` (Data Tables), `date-fns` (Date Formatting), `react-loading-indicators` (Loaders)
* **Database:** PostgreSQL (hosted on Supabase)
* **Styling:** CSS (potentially with Styled Components for DataTable)
* **Development Tools:** Composer, Node.js, npm/yarn, Git, VS Code (recommended)
* **Email Testing:** Mailtrap

---

## 2. Prerequisites & Setup Guide

Before you can install and run this application locally, you need several tools and services set up on your computer.

### 2.1. Required Software

* **Git:** A version control system essential for managing code.
    * **Purpose:** To clone the project repository and manage code changes.
    * **Setup:** Download and install Git from [git-scm.com](https://git-scm.com/downloads). Follow the instructions for your operating system (Windows, macOS, Linux). Verify installation by opening a terminal or command prompt and typing `git --version`.
* **PHP:** The scripting language used by Laravel.
    * **Purpose:** To run the Laravel backend application.
    * **Setup:** Version 8.1 or higher is recommended. Installation varies by OS:
        * **Windows:** Use tools like Laragon, XAMPP, WampServer, or install directly via php.net or Chocolatey (`choco install php`). Make sure PHP is added to your system's PATH.
        * **macOS:** Often pre-installed. Can be managed easily with Homebrew (`brew install php`).
        * **Linux:** Use your distribution's package manager (e.g., `sudo apt install php` on Debian/Ubuntu, `sudo dnf install php` on Fedora).
        * Verify installation: `php --version`. Ensure required PHP extensions (like pdo_pgsql, mbstring, curl, dom, fileinfo) are enabled in your `php.ini` file.
* **Composer:** A dependency manager for PHP.
    * **Purpose:** To install and manage Laravel's backend libraries.
    * **Setup:** Download and install Composer from [getcomposer.org](https://getcomposer.org/download/). Follow the official installation instructions for your OS. Verify installation: `composer --version`.
* **Node.js & npm (or Yarn):** JavaScript runtime and package manager.
    * **Purpose:** To build and run the React frontend application and manage its libraries.
    * **Setup:** Download and install the LTS (Long Term Support) version from [nodejs.org](https://nodejs.org/). npm is included with Node.js. Yarn is an alternative (`npm install --global yarn`). Verify installation: `node --version` and `npm --version` (or `yarn --version`). Version 18+ is recommended.
* **Code Editor:** A text editor for viewing and editing code.
    * **Recommendation:** Visual Studio Code ([code.visualstudio.com](https://code.visualstudio.com/)) is highly recommended due to its excellent support for PHP, JavaScript, Laravel, and React via extensions.

### 2.2. Required Accounts & Services

* **GitHub Account:** Needed to clone the repository (assuming the code is hosted there). Sign up at [github.com](https://github.com/).
* **Supabase Account & Project:** Used for hosting the PostgreSQL database.
    * **Purpose:** Provides a free-tier cloud PostgreSQL database for the application's data.
    * **Setup:**
        1.  Go to [supabase.com](https://supabase.com/) and sign up for a free account.
        2.  Create a new Project. Choose a name and generate a strong database password (save this password securely!). Select a region near you (e.g., Asia Pacific - Singapore). Choose the Free plan.
        3.  Wait for the project to be provisioned.
        4.  Once ready, navigate to **Project Settings** (gear icon in the left sidebar).
        5.  Click on **Database**.
        6.  Under **Connection info**, find and copy the following details. You will need them for the backend's `.env` file:
            * `Host`
            * `Port` (usually 5432 or 6543)
            * `Database name` (usually `postgres`)
            * `User` (usually `postgres`)
            * The database `Password` you set during project creation.
* **Mailtrap Account:** Used for testing email sending (like password resets) locally without sending real emails.
    * **Purpose:** Captures emails sent by the Laravel application during development.
    * **Setup:**
        1.  Go to [mailtrap.io](https://mailtrap.io/) and sign up for a Free account.
        2.  Navigate to "Email Testing" -> "Inboxes". Your default "My Inbox" should be sufficient.
        3.  Click on your inbox.
        4.  Under "SMTP Settings", ensure the integration dropdown shows "Laravel 7+".
        5.  Note down the credentials provided:
            * `Host` (e.g., `sandbox.smtp.mailtrap.io`)
            * `Port` (e.g., 2525, 587, etc.)
            * `Username`
            * `Password`
            * `Auth` (usually TLS)
        6.  You will use these credentials in the backend's `.env` file (`MAIL_*` variables).

---

## 3. Installation and Local Setup

Follow these steps to get the application running on your local machine.

### 3.1. Clone the Repository

1.  Open your terminal or command prompt.
2.  Navigate to the directory where you want to store the project.
3.  Clone the repository using Git (replace `<repository-url>` with the actual URL):
    ```bash
    git clone <repository-url> silangid-admin-app
    cd silangid-admin-app
    ```

### 3.2. Backend Setup (Laravel)

1.  **Navigate to Backend Directory:**
    ```bash
    cd backend
    ```
2.  **Install PHP Dependencies:**
    ```bash
    composer install
    ```
3.  **Create Environment File:** Copy the example environment file.
    ```bash
    cp .env.example .env
    ```
4.  **Configure `.env` File:** Open the `.env` file in your code editor and update the following variables:
    * `APP_NAME="Silang.id Admin Portal"`
    * `APP_ENV=local`
    * `APP_DEBUG=true`
    * `APP_URL=http://localhost:8000` (Default Laravel development server URL)

    * **Database Connection (Use Supabase Credentials):**
        * `DB_CONNECTION=pgsql`
        * `DB_HOST=` (Paste Host from Supabase)
        * `DB_PORT=` (Paste Port from Supabase)
        * `DB_DATABASE=postgres` (Or your Supabase DB name if different)
        * `DB_USERNAME=postgres` (Or your Supabase user if different)
        * `DB_PASSWORD=` (Paste your Supabase database password)
        * `DB_SSLMODE=require` (Add this line - usually required by Supabase)

    * **Frontend URL (for CORS/Sanctum during local dev):**
        * `FRONTEND_URL=http://localhost:5173` (Default Vite dev server URL)
        * `SANCTUM_STATEFUL_DOMAINS=localhost:5173,127.0.0.1:5173`
        * `SESSION_DOMAIN=localhost`
        * `SESSION_DRIVER=database` (Ensure sessions table exists via migrations)

    * **Mail Settings (Use Mailtrap Credentials):**
        * `MAIL_MAILER=smtp`
        * `MAIL_HOST=` (Paste Mailtrap Host)
        * `MAIL_PORT=` (Paste Mailtrap Port)
        * `MAIL_USERNAME=` (Paste Mailtrap Username)
        * `MAIL_PASSWORD=` (Paste Mailtrap Password)
        * `MAIL_ENCRYPTION=tls` (Usually TLS for Mailtrap)
        * `MAIL_FROM_ADDRESS="admin@silang.id"` (Example)
        * `MAIL_FROM_NAME="${APP_NAME}"`

    * **Save** the `.env` file.

5.  **Generate Application Key:**
    ```bash
    php artisan key:generate
    ```
6.  **Run Database Migrations:** This will create the necessary tables (`users`, `password_reset_tokens`, `personal_access_tokens`, `sessions` etc.) in your **Supabase** database.
    ```bash
    php artisan migrate
    ```
7.  **(Optional) Link Storage:** If the app uses local file storage visible publicly.
    ```bash
    php artisan storage:link
    ```
8.  **Start Development Server:**
    ```bash
    php artisan serve
    ```
    Keep this terminal running. The backend API will usually be available at `http://localhost:8000`.

### 3.3. Frontend Setup (React)

1.  **Navigate to Frontend Directory:** Open a **new** terminal or command prompt window/tab. Navigate to the frontend folder:
    ```bash
    cd ../frontend
    # Or from the root: cd frontend
    ```
2.  **Create Environment File:** Create a `.env` file in the `frontend/` directory:
    ```bash
    touch .env
    ```
3.  **Configure `.env` File:** Open `frontend/.env` and add the URL of your **local backend API**:
    ```env
    VITE_API_BASE_URL=http://localhost:8000/api
    ```
    **Save** the file.
4.  **Install JavaScript Dependencies:**
    ```bash
    npm install
    # or if you prefer yarn:
    # yarn install
    ```
5.  **Start Development Server:**
    ```bash
    npm run dev
    # or: yarn dev
    ```
    Keep this terminal running. The frontend application will usually be available at `http://localhost:5173`.

### 3.4. Verification

* Open your web browser and navigate to the frontend URL (usually `http://localhost:5173`).
* You should see the Login page.
* Check the browser's Developer Console (F12) for any immediate errors.
* Check the terminal windows for the backend (`php artisan serve`) and frontend (`npm run dev`) for any error messages.

---

## 4. Application Features and Usage

This Admin Portal provides core functionalities for managing users.

### 4.1. Authentication

* **Login:**
    * Navigate to `http://localhost:5173/login`.
    * Enter the email and password of a registered administrator user.
      
      ![image](https://github.com/user-attachments/assets/d330bb19-7ce6-420b-9327-c5027cb95013)

    * Upon successful login, you will be redirected to the `/dashboard`.

      ![image](https://github.com/user-attachments/assets/9dd09d51-e5fe-4f3b-809f-be57ae0dc8d4)

      
* **Logout:**
    * While logged in, click the "Logout" button in the top-right corner of the navigation bar.
    * A confirmation dialog ("Are you sure you want to logout?") will appear. Click "OK".

      ![image](https://github.com/user-attachments/assets/760a2db2-b843-4841-b2fb-733688e7b398)

    * You will be redirected back to the `/login` page.

* **Forgot Password:**
    * On the Login page, click the "Forgot Password?" link.
    * Enter the email address associated with your admin account and click "Send Password Reset Link".

      ![image](https://github.com/user-attachments/assets/7e350102-3f79-4a8c-8ecf-37e1b9e2042e)

    * Check your **Mailtrap inbox** (not your real email) for the password reset email.
      
      ![image](https://github.com/user-attachments/assets/6c79b792-9230-48b4-b2af-46018426b601)

* **Reset Password:**
    * Click the "Reset Password" link/button within the email in Mailtrap. This will open the frontend reset page (e.g., `http://localhost:5173/password-reset/TOKEN?email=...`).
    * Enter the email address (it might be pre-filled), your new desired password, and confirm the new password.
    * Click "Reset Password". If successful, you should see a success message and potentially be redirected to the Login page.
      
      ![image](https://github.com/user-attachments/assets/ab32c5db-eb20-436d-a0ad-e30488de655c)

* **Registration:** The Register page allows creating a new user account directly.

  ![image](https://github.com/user-attachments/assets/b6d46655-7f69-482a-9dc3-df8478a4e6b1)


### 4.2. Dashboard (`/dashboard`)

* Upon successful login, you are directed here.
* **Welcome Message:** Greets the logged-in administrator by name and shows the current date/time.
* **KPI Cards:** Display key statistics:
    * `Total Pengguna`: Shows the **actual total number** of users fetched from the database. (Clickable, links to `/users`).
    * `JBI Aktif`: Dummy data showing active interpreters. (Link currently disabled).
    * `Permintaan Baru`: Dummy data for new service requests. (Link currently disabled).
    * `Acara Mendatang`: Dummy data for upcoming events. (Link currently disabled).
* **Charts:** Visualizations (using dummy data):
    * `Pertumbuhan Pengguna`: Line chart showing dummy user registration trends.
    * `Distribusi Tipe Acara`: Doughnut chart showing dummy event type distribution.
* **Recent Users:** Lists the 5 most recently registered users (real data fetched from the user list), linking to their edit page.
* **Quick Actions:** Provides quick links/buttons to common tasks like "Tambah Pengguna Baru" and "Kelola Semua Pengguna".
  
  ![image](https://github.com/user-attachments/assets/9dd09d51-e5fe-4f3b-809f-be57ae0dc8d4)


### 4.3. User Management (`/users`)

* Accessible via the "Users" link in the navbar.
* **View Users:**
    * Displays a list of all registered users in a data table.
    * **Sorting:** Click on column headers (ID, Name, Email, Created At, Updated At) to sort the data. The "Actions" column is not sortable.
    * **Search:** Use the search box above the table to filter users. The search is case-insensitive and looks across ID, Name, Email, and the formatted Created At/Updated At columns.
    * **Pagination:** The table includes pagination controls (Previous, Next, page numbers) to navigate through large user lists.

      ![image](https://github.com/user-attachments/assets/55c6ee12-6cb9-4737-ae27-34845b1fe784)

* **Create User:**
    * Click the "Create New User" button.
    * Fill in the Name, Email, and Password fields.
    * Click "Create User". You will be redirected back to the user list upon success.

      ![image](https://github.com/user-attachments/assets/f1d63ee8-eedf-494c-90a2-a83faa712c2a)

* **Edit User:**
    * Click the "Edit" button next to a user in the table.
    * Modify the Name and/or Email.
    * Optionally, enter a new password to change it (leave blank to keep the current one).
    * Click "Save Changes".

      ![image](https://github.com/user-attachments/assets/a50f24a9-2d54-4ee8-89dd-742f6c3ffb26)

* **Delete User:**
    * Click the "Delete" button next to a user.
    * Confirm the deletion in the browser prompt.
    * The user will be removed from the list upon success. *Note: You cannot delete your own logged-in account.*

      ![image](https://github.com/user-attachments/assets/25aa7c1d-7092-460a-a9b4-3e334038839e)


### 4.4. Export Data

* On the `/users` page, above the table, there are "Export" buttons.
* **CSV/Excel:** Clicking these buttons will download a `.csv` or `.xlsx` file containing **all user data** (ID, Name, Email, Created At, Updated At), regardless of the current search filter or pagination page. The "Actions" column is excluded.

---

## 5. End-to-End Testing Scenarios

These scenarios simulate typical user flows to ensure the application works correctly from start to finish.

1.  **Scenario: Successful Login & Logout**
    * Open `http://localhost:5173`. Redirected to `/login`.
    * Enter valid admin email and password. Click "Login".
    * **Expected:** Redirected to `/dashboard`. Welcome message shows correct admin name. KPI cards and other elements load.
    * Click the "Logout" button in the navbar.
    * **Expected:** Confirmation alert appears. Click "OK".
    * **Expected:** Redirected back to `/login` page.

2.  **Scenario: Password Reset Flow**
    * Navigate to the `/login` page. Click "Forgot Password?".
    * Enter the admin's registered email. Click "Send Password Reset Link".
    * **Expected:** Success message appears.
    * Open Mailtrap inbox (`mailtrap.io`). Find the reset email.
    * Click the "Reset Password" link/button in the email.
    * **Expected:** Browser opens a new tab to `http://localhost:5173/password-reset/...`. The reset form is displayed.
    * Enter the email address, a new password, and confirm the new password. Click "Reset Password".
    * **Expected:** Success message appears. User is potentially redirected to `/login`.
    * Try logging in with the **new** password.
    * **Expected:** Login is successful.

3.  **Scenario: User CRUD Cycle**
    * Log in as an administrator. Navigate to `/users`.
    * Click "Create New User". Enter Name (`Test User`), Email (`test.user@example.com`), Password (`password123`). Click "Create User".
    * **Expected:** Redirected to `/users`. The new "Test User" appears in the table. Check the "Created At" date.
    * Use the search bar, type "Test User".
    * **Expected:** Only "Test User" remains visible in the table. Clear the search bar.
    * Find "Test User" and click "Edit".
    * Change Name to "Test User Edited". Enter a new Password (`newpassword123`). Click "Save Changes".
    * **Expected:** Redirected to `/users`. The user's name is updated to "Test User Edited".
    * Log out. Log back in using `test.user@example.com` and the **new** password (`newpassword123`).
    * **Expected:** Login is successful. Log out.
    * Log back in as the **administrator**. Navigate to `/users`.
    * Find "Test User Edited" and click "Delete".
    * **Expected:** Confirmation alert appears. Click "OK".
    * **Expected:** The user "Test User Edited" disappears from the table. Search for "Test User Edited".
    * **Expected:** No users found.

4.  **Scenario: Data Export**
    * Log in as administrator. Navigate to `/users`.
    * (Optional) Apply a search filter so only some users are visible.
    * Click the "Export CSV" button.
    * **Expected:** A `users_export.csv` file is downloaded. Open it and verify it contains **all** users (not just filtered ones) and includes columns ID, Name, Email, Created At, Updated At (but not Actions). Check date formatting.
    * Click the "Export Excel" button.
    * **Expected:** A `users_export.xlsx` file is downloaded. Open it and verify the same content and format as the CSV.

5.  **Scenario: Access Control**
    * Ensure you are logged out.
    * Try to directly access `http://localhost:5173/dashboard` in the browser.
    * **Expected:** Redirected to `/login`.
    * Try to directly access `http://localhost:5173/users`.
    * **Expected:** Redirected to `/login`.
    * Log in successfully.
    * **Expected:** Able to access `/dashboard` and `/users`.

---

## 6. API Documentation

This section details the backend API endpoints provided by the Laravel application. All endpoints requiring authentication expect a valid Bearer Token (obtained from `/api/login`) in the `Authorization` header.

**Base URL:** `http://localhost:8000/api` (for local development)

---

**Authentication Endpoints**

* **Register User**
    * **Method:** `POST`
    * **URL Path:** `/register`
    * **Description:** Creates a new user account. (May or may not be enabled/used depending on admin policy).
    * **Authentication:** Public
    * **Request Body:** `application/json`
        ```json
        {
          "name": "string|required|max:255",
          "email": "string|required|email|unique:users|max:255",
          "password": "string|required|min:8|confirmed"
        }
        ```
    * **Success Response:** `201 Created`
        ```json
        {
          "message": "User registered successfully",
          "user": { "id": 1, "name": "...", "email": "...", ... }
        }
        ```
    * **Error Response:** `422 Unprocessable Entity` (Validation errors)
        ```json
        { "message": "The given data was invalid.", "errors": { ... } }
        ```
* **Login User**
    * **Method:** `POST`
    * **URL Path:** `/login`
    * **Description:** Authenticates a user and returns an API token.
    * **Authentication:** Public
    * **Request Body:** `application/json`
        ```json
        {
          "email": "string|required|email",
          "password": "string|required"
        }
        ```
    * **Success Response:** `200 OK`
        ```json
        {
          "token": "SANCTUM_API_TOKEN_STRING",
          "user": { "id": 1, "name": "...", "email": "...", ... }
        }
        ```
    * **Error Response:** `422 Unprocessable Entity` (Invalid credentials)
* **Forgot Password Request**
    * **Method:** `POST`
    * **URL Path:** `/forgot-password`
    * **Description:** Sends a password reset link to the user's email.
    * **Authentication:** Public
    * **Request Body:** `application/json`
        ```json
        { "email": "string|required|email|exists:users,email" }
        ```
    * **Success Response:** `200 OK`
        ```json
        { "message": "We have emailed your password reset link!" }
        ```
    * **Error Response:** `422 Unprocessable Entity` (Email not found or validation error)
* **Reset Password**
    * **Method:** `POST`
    * **URL Path:** `/reset-password`
    * **Description:** Updates the user's password using the token from the reset link.
    * **Authentication:** Public
    * **Request Body:** `application/json`
        ```json
        {
          "token": "string|required",
          "email": "string|required|email",
          "password": "string|required|min:8|confirmed"
        }
        ```
    * **Success Response:** `200 OK`
        ```json
        { "message": "Your password has been reset!" }
        ```
    * **Error Response:** `422 Unprocessable Entity` (Invalid token, email, password mismatch, or validation error)
* **Logout User**
    * **Method:** `POST`
    * **URL Path:** `/logout`
    * **Description:** Revokes the current API token used for the request.
    * **Authentication:** Required (Sanctum)
    * **Request Body:** None
    * **Success Response:** `200 OK`
        ```json
        { "message": "Logged out successfully" }
        ```
    * **Error Response:** `401 Unauthorized`

---

**User Information Endpoint**

* **Get Authenticated User**
    * **Method:** `GET`
    * **URL Path:** `/user`
    * **Description:** Returns the details of the currently authenticated user based on the provided token.
    * **Authentication:** Required (Sanctum)
    * **Request Body:** None
    * **Success Response:** `200 OK`
        ```json
        {
          "id": 1,
          "name": "Admin User",
          "email": "admin@example.com",
          "email_verified_at": null,
          "created_at": "...",
          "updated_at": "..."
        }
        ```
    * **Error Response:** `401 Unauthorized`

---

**User Management Endpoints (CRUD)**

* **List Users**
    * **Method:** `GET`
    * **URL Path:** `/users`
    * **Description:** Retrieves a list of all users. (Note: No pagination implemented in the backend for this version).
    * **Authentication:** Required (Sanctum)
    * **Request Body:** None
    * **Success Response:** `200 OK`
        ```json
        [
          { "id": 1, "name": "...", "email": "...", "created_at": "...", "updated_at": "..." },
          { "id": 2, "name": "...", "email": "...", "created_at": "...", "updated_at": "..." }
        ]
        ```
    * **Error Response:** `401 Unauthorized`
* **Create User**
    * **Method:** `POST`
    * **URL Path:** `/users`
    * **Description:** Creates a new user.
    * **Authentication:** Required (Sanctum)
    * **Request Body:** `application/json`
        ```json
        {
          "name": "string|required|max:255",
          "email": "string|required|email|unique:users|max:255",
          "password": "string|required|min:8"
        }
        ```
    * **Success Response:** `201 Created` (Returns the created user object)
        ```json
        { "id": 3, "name": "New User", "email": "...", "created_at": "...", "updated_at": "..." }
        ```
    * **Error Response:** `422 Unprocessable Entity`, `401 Unauthorized`
* **Show User Details**
    * **Method:** `GET`
    * **URL Path:** `/users/{id}`
    * **Description:** Retrieves details for a specific user.
    * **Authentication:** Required (Sanctum)
    * **URL Parameters:** `{id}` (integer, required) - The ID of the user.
    * **Request Body:** None
    * **Success Response:** `200 OK` (Returns the specific user object)
        ```json
        { "id": 1, "name": "...", "email": "...", "created_at": "...", "updated_at": "..." }
        ```
    * **Error Response:** `404 Not Found`, `401 Unauthorized`
* **Update User**
    * **Method:** `PUT`
    * **URL Path:** `/users/{id}`
    * **Description:** Updates details for a specific user.
    * **Authentication:** Required (Sanctum)
    * **URL Parameters:** `{id}` (integer, required) - The ID of the user to update.
    * **Request Body:** `application/json` (Fields are optional)
        ```json
        {
          "name": "string|max:255",
          "email": "string|email|unique:users,email,{id}|max:255",
          "password": "string|min:8|nullable" // Send only if changing password
        }
        ```
    * **Success Response:** `200 OK` (Returns the updated user object)
        ```json
        { "id": 1, "name": "Updated Name", "email": "...", "created_at": "...", "updated_at": "..." }
        ```
    * **Error Response:** `404 Not Found`, `422 Unprocessable Entity`, `401 Unauthorized`
* **Delete User**
    * **Method:** `DELETE`
    * **URL Path:** `/users/{id}`
    * **Description:** Deletes a specific user.
    * **Authentication:** Required (Sanctum)
    * **URL Parameters:** `{id}` (integer, required) - The ID of the user to delete.
    * **Request Body:** None
    * **Success Response:** `204 No Content`
    * **Error Response:** `404 Not Found`, `401 Unauthorized`, `403 Forbidden` (e.g., trying to delete self)

---

**Dashboard Statistics Endpoint**

* **Get User Count**
    * **Method:** `GET`
    * **URL Path:** `/stats/user-count`
    * **Description:** Returns the total number of registered users.
    * **Authentication:** Required (Sanctum)
    * **Request Body:** None
    * **Success Response:** `200 OK`
        ```json
        { "total_users": 123 }
        ```
    * **Error Response:** `401 Unauthorized`, `500 Internal Server Error`

---

## 7. Requirement Compliance Check

This section verifies how the developed application meets the specific requirements outlined for the recruitment process.

**Backend - Laravel (Mistakenly labeled "Frontend" in requirement list)**

1.  **Project Setup (10 Points)**
    * *Buat proyek Laravel baru dan konfigurasi database:* **Met.** A new Laravel project (`backend/` folder) was created using Composer. The `.env` file was configured to connect to a PostgreSQL database (specifically demonstrated with Supabase connection details).
    * *Buat model dan migrasi untuk tabel users:* **Met.** Laravel's built-in `User` model (`app/Models/User.php`) and the default user migration (`database/migrations/..._create_users_table.php`) were utilized and executed via `php artisan migrate`. The `User` model includes necessary traits (`HasApiTokens`, `HasFactory`, `Notifiable`).
2.  **Implementasi CRUD (30 Poin)**
    * *Buat controller untuk mengelola users:* **Met.** An API resource controller `app/Http/Controllers/Api/UserController.php` was generated using `php artisan make:controller Api/UserController --api --model=User`.
    * *Buat endpoint untuk:* **Met.** The `Route::apiResource('users', UserController::class)` in `routes/api.php` automatically creates the standard RESTful endpoints, and the `UserController` implements the logic for:
        * Menampilkan daftar pengguna (`GET /api/users` via `index` method).
        * Menambahkan pengguna (`POST /api/users` via `store` method).
        * Menampilkan detail pengguna (`GET /api/users/{id}` via `show` method).
        * Menghapus pengguna (`DELETE /api/users/{id}` via `destroy` method).
        * *(Additional)* Updating users (`PUT /api/users/{id}` via `update` method) was also implemented for full CRUD functionality.
3.  **Authentication (20 Poin)**
    * *Gunakan autentikasi laravel:* **Met.** Laravel Sanctum was implemented for API token-based authentication, leveraging Laravel's core authentication services (`Auth::attempt`, `request->user()`).
    * *Proteksi endpoint dengan middleware auth:* **Met.** All relevant API endpoints (User CRUD, Stats, Logout, Get User) were grouped within `Route::middleware('auth:sanctum')->group(...)` in `routes/api.php`, ensuring they require a valid Sanctum token.

**Frontend - ReactJS**

1.  **Setup Project (10 Poin)**
    * *Buat proyek ReactJS:* **Met.** A new React project (`frontend/` folder) was created using Vite.
    * *Konfigurasikan axios untuk koneksi ke API:* **Met.** Axios was installed, and a configured instance (`src/api/axiosInstance.js`) was created with a base URL pointing to the API and an interceptor to automatically attach the Bearer token.
2.  **Konsumsi API (30 Poin)**
    * *Tampilkan daftar pengguna dari API:* **Met.** The `UsersPage.jsx` component fetches data from `/api/users` using the configured Axios instance and displays it in a data table (`react-data-table-component`).
    * *Buat form untuk menambah pengguna baru:* **Met.** The `UserCreatePage.jsx` component provides a form that sends data via a `POST` request to `/api/users` using Axios. Edit and Delete functionalities consuming `/api/users/{id}` (PUT/DELETE) were also implemented.
3.  **Authentication & Routing (20 Poin)**
    * *Implementasikan autentikasi token:* **Met.** The login process retrieves a token, stores it (in `localStorage`), and the Axios interceptor includes it in subsequent requests. Logout clears the token. User context (`AuthContext`) manages auth state.
    * *(Implicit Requirement: Routing)* **Met.** `react-router-dom` was used to set up application routing (`App.jsx`). A `ProtectedRoute.jsx` component was created to restrict access to authenticated sections based on the presence of the auth token.

---

## Summary

The developed Silang.id Admin Portal application successfully meets all the specified functional requirements for both the backend (Laravel API) and frontend (ReactJS SPA), demonstrating core full-stack development capabilities.

Furthermore, several additional features and refinements were implemented during the development process to enhance usability, functionality, and robustness beyond the initial baseline requirements:

**Key Additional Features Developed:**

* **Complete Authentication Flow:** Implemented the full Forgot Password and Reset Password functionality, including backend logic, API endpoints, frontend forms, email handling (via Mailtrap locally), and custom email notifications pointing to the correct frontend reset route.
* **Enhanced User Management Table:**
    * Replaced the basic HTML table with the `react-data-table-component` library on the Users page.
    * Enabled column sorting (excluding the "Actions" column).
    * Implemented case-insensitive search functionality across relevant user data fields (excluding "Actions").
    * Added pagination managed by the DataTable component.
* **Data Export:**
    * Integrated export functionality on the Users page for **CSV** and **Excel** formats.
    * Ensured exported files contain the **entire user dataset**, regardless of current filters or pagination.
    * Excluded the "Actions" column from exported data.
* **Enhanced Dashboard:**
    * Developed a more informative dashboard with KPI statistic cards (using real-time total user count fetched from a dedicated API endpoint and dummy data for other stats).
    * Added placeholders for charts (User Growth Line Chart, Event Type Doughnut Chart) using `react-chartjs-2`.
    * Included a "Recent Users" list displaying the latest 5 registered users fetched from the API.
    * Added a "Quick Actions" section for easy navigation.
* **Backend Optimizations & Additions:**
    * Created a dedicated API endpoint (`/api/stats/user-count`) and controller method to efficiently retrieve the total user count directly from the database.
    * Implemented consistent lowercase handling for emails on the backend during login, forgot password, and reset password processes.
* **UI/UX Enhancements:**
    * Implemented custom loading indicators (`ThreeDots` from `react-loading-indicators`) with a background overlay effect across the application (initial load, auth checks, form submissions, table loading) for a better user experience.
    * Added Silang.id branding (logo and text) to authentication forms (Login, Register, Forgot Password, Reset Password).
    * Set a custom browser tab title ("Silang.id Admin Portal") and favicon for the application.
    * Added the favicon logo next to the title in the main application navbar.
    * Made authentication form containers wider for better readability.
    * Added a custom "by: [Name]" credit line with a LinkedIn link in the application footer.
    * Implemented a browser confirmation dialog (`window.confirm`) before executing the logout action.
* **Data Consistency:** Implemented automatic conversion of user-provided emails to lowercase on the frontend forms (Login, Register, Forgot/Reset Password, Edit User) before submitting to the API.
* **Date Formatting:** Implemented clear date and time formatting (`DD/MM/YYYY HH:MM:SS`) for "Created At" and "Updated At" columns in the user table using the `date-fns` library.

These additions create a more feature-rich, user-friendly, and robust administration tool compared to the initial basic requirements.


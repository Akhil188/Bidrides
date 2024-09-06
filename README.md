# BidRides

**BidRides** is a platform where users can place bids on rides, allowing for dynamic pricing based on demand. The application is built with an Angular frontend and a Python Django backend, ensuring a smooth user experience with a scalable and efficient API.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [File Structure](#file-structure)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Authentication**: Secure login and registration for users.
- **Bid System**: Users can place bids on rides.
- **Ride Management**: Drivers can create and manage ride listings.
- **Real-Time Updates**: Users get notified when bids are accepted or rejected.
- **Responsive Design**: Works across desktop and mobile devices.

## Tech Stack

- **Frontend**: Angular, TypeScript, HTML5, SCSS
- **Backend**: Django, Python
- **Database**: PostgreSQL
- **API**: RESTful API
- **Authentication**: JWT (JSON Web Tokens)
- **Others**: Docker (for containerization), Nginx (for reverse proxy)

## Installation

Follow these steps to set up the project locally:

### Prerequisites

- Node.js & npm
- Python 3.x & pip
- PostgreSQL
- Docker (optional for containerized deployment)
- Angular CLI

### Backend (Django Setup)

1. Clone the repository:
    ```bash
    git clone https://github.com/Akhil188/bidrides.git
    cd bidrides/Bid_Rides
    ```

2. Create and activate a virtual environment:
    ```bash
    python3 -m venv env
    source env/bin/activate  # On Windows use `env\Scripts\activate`
    ```

3. Install backend dependencies:
    ```bash
    pip install -r requirements.txt
    ```

4. Create a `.env` file with the following content:
    ```env
    DEBUG=True
    SECRET_KEY=your_secret_key
    DB_NAME=your_db_name
    DB_USER=your_db_user
    DB_PASSWORD=your_db_password
    DB_HOST=localhost
    ```

5. Run the migrations:
    ```bash
    python manage.py migrate
    ```

6. Start the Django development server:
    ```bash
    python manage.py runserver
    ```

### Frontend (Angular Setup)

1. Navigate to the frontend folder:
    ```bash
    cd ../Bids_Rides
    ```

2. Install frontend dependencies:
    ```bash
    npm install
    ```

3. Start the Angular development server:
    ```bash
    ng serve
    ```

## Usage

1. Open the browser and go to `http://localhost:8000` for the Django backend.
2. For the Angular frontend, visit `http://localhost:4200`.

## File Structure

The project is organized as follows:

BidRides/ ├── API/ │ └── myproject/ # Backend Django project │ ├── settings.py # Project settings │ ├── urls.py # Backend API routes │ └── ... └── Bids_Rides/ # Frontend Angular project ├── src/ │ ├── app/ # Angular components, services, etc. │ ├── assets/ # Static assets │ └── environments/ # Angular environment files └── ...


## API Endpoints

### Authentication
- `POST /api/register`: Register a new user.
- `POST /api/login`: Log in with email and password to receive a JWT token.

### Rides
- `GET /api/rides`: Get all available rides.
- `POST /api/rides`: Create a new ride (Driver only).

### Bids
- `POST /api/bids`: Place a bid on a ride.
- `GET /api/bids`: Get all bids for a specific ride.

Refer to the [API documentation](./API_DOC.md) for more details on available endpoints.

## Contributing

If you'd like to contribute, please fork the repository and use a feature branch. Pull requests are warmly welcome.

1. Fork the project.
2. Create your feature branch:
    ```bash
    git checkout -b feature/AmazingFeature
    ```
3. Commit your changes:
    ```bash
    git commit -m 'Add some AmazingFeature'
    ```
4. Push to the branch:
    ```bash
    git push origin feature/AmazingFeature
    ```
5. Open a pull request.

## License

Distributed under the MIT License. See `LICENSE` for more information.

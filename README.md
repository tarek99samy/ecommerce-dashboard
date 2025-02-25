# E-Commerce Dashboard

> The dashboard of Multi-language E-Commerce website similar to `dubbizzle`

## Technologies Used:

- ReactJS
- Zustand for state management
- PrimeReact and PrimeFlex for UI
- ChartJS for displaying useful UI charts
- Axios for API calling
- ESLint and Prettier for code formatting consistency
- integrating circleCI for connection with private cloud machine to automat CI/CD process

## Run for development:
1. Create an `.env` file having following keys:
```sh
REACT_APP_BASE_API_URL=... # BACKEND URL
REACT_APP_BASE_IMAGE_URL=... # SERVER IMAGES BASE PATH
```
2. Clone and install dependencies
```sh
git clone https://github.com/tarek99samy/ecommerce-dashboard.git
cd ecommerce-dashboard
npm install
```
3. Run script
```sh
npm run start
```

## Run for production:
1. Create an `.env.production` file having following keys same as `.env`:
2. Build for production
```sh
npm run build
```
3. Use the output `build` folder for deployment

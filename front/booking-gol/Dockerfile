# Build stage
FROM node:18 as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install
COPY . .
RUN npm run build -- --configuration development

# Production stage
FROM nginx:alpine

COPY --from=build /app/dist/booking-gol/browser /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
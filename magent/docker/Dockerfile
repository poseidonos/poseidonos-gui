# Start from latest GO base image
FROM golang:latest

# Set working directory inside container
WORKDIR /app

# Copy go mod and go sum files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy source from current directory to app directory inside container
COPY . .

# Download vendor dependencies
RUN go mod vendor

# Build the GO app
RUN go build -mod vendor

#Expose port 8090 to outside
EXPOSE 8090

# Command to run the executable
CMD ["./magent"]

# Start from latest GO base image
FROM ubuntu:18.04
LABEL org.opencontainers.image.source https://github.com/poseidonos/poseidonos-gui

# Set working directory inside container
WORKDIR /app

# Copy source from current directory to app directory inside container
COPY . .

#Expose port 8090 to outside
EXPOSE 8090

# Command to run the executable
CMD ["/app/bin/magent"]


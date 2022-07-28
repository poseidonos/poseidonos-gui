# Start from latest GO base image
FROM ubuntu:18.04

WORKDIR /app1

# Copy source from current directory to app directory inside container
COPY ./dagent/bin ./dagent/bin

WORKDIR /app1/dagent

#Expose port 8090 to outside
EXPOSE 3000

# Command to run the executable
CMD ["./bin/dagent"]


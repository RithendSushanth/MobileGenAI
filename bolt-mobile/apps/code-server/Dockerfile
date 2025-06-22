FROM codercom/code-server:4.96.4

USER root
RUN apt-get update \
    && apt-get install -y curl \
    && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Revert to the code-server default user
USER coder

# Expose code-server's default port
EXPOSE 8080

# Start code-server on container launch
CMD ["code-server", "--auth", "none", "--bind-addr", "0.0.0.0:8080", "/tmp/bolty-worker"]




#  Option 2: Use a Different Port on Host
# If you don’t want to stop the existing process, just use a different host port:


# docker run -p 9090:8080 -p 9091:8081 -v /tmp/bolty-worker:/tmp/bolty-worker code-server
# This means:

# Inside the container: services still run on ports 8080 and 8081

# On your machine (host): you'll access them via http://localhost:9090 and http://localhost:9091


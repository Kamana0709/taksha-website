FROM node:20-bullseye-slim

# Install TeX Live and required fonts for PDF generation
# We need xetex, latex-extra (for standalone, etc.), fonts-extra (for fontspec dependencies), and fonts-liberation
RUN apt-get update && apt-get install -y --no-install-recommends \
    texlive-xetex \
    texlive-latex-extra \
    texlive-fonts-extra \
    fonts-liberation \
    ca-certificates \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install Node dependencies
RUN npm ci --omit=dev

# Copy backend source code
COPY . .

# Run the font download script to ensure Poppins is available locally
RUN node scripts/download-fonts.js

# Expose the Express port
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]

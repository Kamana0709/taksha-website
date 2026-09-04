FROM node:22-bookworm-slim
# Install TeX Live and required fonts for PDF generation
# We need xetex, latex-extra (for standalone, etc.), fonts-extra (for fontspec dependencies), and fonts-liberation
RUN apt-get update && apt-get install -y --no-install-recommends \
    texlive-xetex \
    texlive-latex-extra \
    texlive-pictures \
    fonts-liberation \
    ca-certificates \
    curl \
    chromium \
    && rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app
# Copy package files
COPY package*.json ./
# Install Node dependencies
RUN npm ci --omit=dev
# Copy backend source code
COPY . .
# Generate Prisma Client now that schema.prisma is present
RUN npx prisma generate
# Run the font download script to ensure Poppins is available locally
RUN node scripts/download-fonts.js
# Expose the Express port
EXPOSE 5000
# Start the server
CMD ["node", "server.js"]
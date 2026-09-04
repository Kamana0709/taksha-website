FROM node:22-bookworm-slim

# Install TeX Live, fonts, and Chrome's runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    texlive-xetex \
    texlive-latex-extra \
    texlive-pictures \
    fonts-liberation \
    ca-certificates \
    curl \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libpangocairo-1.0-0 \
    libpango-1.0-0 \
    libcairo2 \
    libgtk-3-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files AND the puppeteer cache config BEFORE installing,
# so `npm ci`'s postinstall (which downloads Chrome) uses the SAME
# cache path the app will look in at runtime.
COPY package*.json ./
COPY .puppeteerrc.cjs ./

# Install Node dependencies (postinstall -> `npx puppeteer install` runs now,
# correctly honoring .puppeteerrc.cjs)
RUN npm ci --omit=dev

# Copy the rest of the backend source code
COPY . .

# Generate Prisma Client now that schema.prisma is present
RUN npx prisma generate

# Run the font download script to ensure Poppins is available locally
RUN node scripts/download-fonts.js

# Expose the Express port
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]
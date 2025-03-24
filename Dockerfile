FROM ubuntu:20.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update -y && \
    apt-get upgrade -y && \
    apt-get install -y \
    postgresql \
    postgresql-contrib \
    curl \
    git \
    nodejs \
    npm \
    sudo \
    && apt-get clean

RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs

RUN service postgresql stop && \
    sudo -u postgres /usr/lib/postgresql/12/bin/initdb -D /var/lib/postgresql/data && \
    echo "listen_addresses='*'" >> /etc/postgresql/12/main/postgresql.conf && \
    echo "host all all 0.0.0.0/0 trust" >> /etc/postgresql/12/main/pg_hba.conf

RUN service postgresql start && \
    sudo -u postgres psql -c "CREATE DATABASE hotel;" && \
    sudo -u postgres psql -c "CREATE USER root WITH PASSWORD 'password';" && \
    sudo -u postgres psql -c "ALTER ROLE root SET client_encoding TO 'utf8';" && \
    sudo -u postgres psql -c "ALTER ROLE root SET default_transaction_isolation TO 'read committed';" && \
    sudo -u postgres psql -c "ALTER ROLE root SET timezone TO 'UTC';" && \
    sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE hotel TO root;"

WORKDIR /app

RUN git clone https://Qerope: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@github.com/qerope/CSI2532-Project

WORKDIR /app/CSI2532-Project

COPY ./sql /docker-entrypoint-initdb.d/
RUN service postgresql start && \
    PGPASSWORD="password" psql -U root -d hotel -f ./sql/setup.sql && \
    PGPASSWORD="password" psql -U root -d hotel -f ./sql/triggers.sql && \
    PGPASSWORD="password" psql -U root -d hotel -f ./sql/views.sql && \
    PGPASSWORD="password" psql -U root -d hotel -f ./sql/sample.sql

RUN npm install -g npm@latest && \
    npm install -g express-generator && \
    npm install

WORKDIR /app/CSI2532-Project/app-v2
RUN npm install --force

EXPOSE 3000 5010

CMD service postgresql start && \
    nohup node /app/CSI2532-Project/server.js & \
    nohup npm run dev --prefix /app/CSI2532-Project/app-v2 & \
    tail -f /dev/null

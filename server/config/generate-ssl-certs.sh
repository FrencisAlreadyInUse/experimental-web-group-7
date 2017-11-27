#!/bin/bash

echo "Generating self-signed certificates..."
mkdir -p ./sslcerts
openssl genrsa -out ./sslcerts/key.pem 1024
openssl req -new -key ./sslcerts/key.pem -out ./sslcerts/csr.pem
openssl x509 -req -days 9999 -in ./sslcerts/csr.pem -signkey ./sslcerts/key.pem -out ./sslcerts/cert.pem
rm ./sslcerts/csr.pem
chmod 600 ./sslcerts/key.pem ./sslcerts/cert.pem

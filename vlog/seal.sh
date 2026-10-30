#!/usr/bin/env bash
# Encrypt a folder of review output so it can sit in a public repo: a random AES key locks the tarball,
# and the AES key itself is locked with vlog/review_pub.pem (only the editor holds the private key).
# usage: vlog/seal.sh SRC_DIR OUT_PREFIX   ->  OUT_PREFIX.tar.enc + OUT_PREFIX.key.enc
set -euo pipefail
src=$1; out=$2; k=$(mktemp)
openssl rand -hex 32 > "$k"
tar czf - -C "$(dirname "$src")" "$(basename "$src")" | openssl enc -aes-256-cbc -pbkdf2 -salt -pass file:"$k" -out "$out.tar.enc"
openssl pkeyutl -encrypt -pubin -inkey "$(dirname "$0")/review_pub.pem" -pkeyopt rsa_padding_mode:oaep -in "$k" -out "$out.key.enc"
rm -f "$k"

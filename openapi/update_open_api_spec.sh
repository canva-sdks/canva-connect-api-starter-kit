#!/usr/bin/env bash
# Download the publicly released Connect API OpenAPI description.

set -u -o pipefail

OPENAPI_SPEC_URL="https://www.canva.dev/sources/connect/api/latest/api.yml"
DEST_SPEC="$(dirname "${BASH_SOURCE[0]}")/spec.yml"

COLOR_RED='\033[31m'
COLOR_RESET='\033[0m'

main() {
  while true; do
    echo -e "\nAbout to download the latest OpenAPI spec from Canva to ${COLOR_RED}${DEST_SPEC}${COLOR_RESET}.\n"
    read -rp "Do you wish to proceed? (yes/no) " yn
    case $yn in
    [Yy][Ee][Ss])
      echo "You chose yes. Downloading the spec..."
      curl -fsSL -o "$DEST_SPEC" "$OPENAPI_SPEC_URL"
      break
      ;;
    [Nn][Oo])
      echo "You chose no. Aborting."
      exit 1
      ;;
    *)
      echo "Please answer yes or no."
      ;;
    esac
  done
}

main "$@"
exit

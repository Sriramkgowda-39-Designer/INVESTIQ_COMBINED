# Security

The local server binds to `127.0.0.1`, limits CSV request bodies to 15 MB and does not persist uploaded candle data. Prediction history is local and should be deleted when no longer needed. Do not upload data you are not authorized to use. Do not place credentials in CSV files or source control.

This is a development server with no authentication or TLS; do not expose it to a network. A cloud release needs authentication, least-privilege IAM, HTTPS, request validation/rate limits, secrets management where needed, log redaction, and a defined data retention policy.

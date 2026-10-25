# AWS deployment plan

This release is local-first. No AWS resources were created, and the app does not require AWS credentials. The Bedrock explanation adapter is off unless explicitly configured.

Before deployment, prepare an independently reviewable design for static UI hosting, API execution, model storage, logs, retention and authentication. A likely small-footprint option is S3/CloudFront for the UI and API Gateway with Lambda for inference, with S3 for approved datasets/model artifacts. Add DynamoDB only when durable multi-user history is needed. Yahoo Finance's yfinance project states personal-use intent; do not deploy or redistribute its data unless you confirm Yahoo's terms permit the intended use. Bedrock explanations remain optional and should be disabled by default.

Deployment prerequisites include a confirmed region, account budget alarm, data license and source, model artifact packaging/cold-start measurement, authentication and abuse controls, retention policy, and a reviewed infrastructure change set. Do not run deployment until those items and the actual monthly estimate are reviewed. Teardown instructions must accompany any eventual infrastructure template.

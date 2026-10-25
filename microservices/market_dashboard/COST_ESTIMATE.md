# Cost estimate

The current local app creates no AWS charges. AWS credits are not a market-data subscription and do not guarantee free use of AWS services.

No numeric cloud estimate is claimed because region, request volume, storage, model size, retention, and data-provider terms are not specified. Before any deployment, price the actual S3 storage/requests, CloudFront transfer, API Gateway calls, Lambda duration/memory, CloudWatch log retention, optional DynamoDB capacity/storage, and optional Bedrock tokens using the selected region and expected workload. Set a billing budget/alert below the available $150 credit and remove resources after evaluation.

"""Optional Bedrock explanation adapter; disabled unless a model ID is configured."""
import os


def is_enabled():
    return bool(os.environ.get("INVESTIQ_BEDROCK_MODEL_ID"))


def explain(prediction: dict, indicators: dict) -> str:
    model_id = os.environ.get("INVESTIQ_BEDROCK_MODEL_ID")
    if not model_id:
        raise RuntimeError("Bedrock explanations are disabled. Set INVESTIQ_BEDROCK_MODEL_ID to enable them.")
    try:
        import boto3
    except ImportError as exc:
        raise RuntimeError("Install the optional boto3 dependency to use Bedrock.") from exc
    region = os.environ.get("AWS_REGION") or os.environ.get("AWS_DEFAULT_REGION")
    if not region:
        raise RuntimeError("Set AWS_REGION or AWS_DEFAULT_REGION before enabling Bedrock.")
    client = boto3.client("bedrock-runtime", region_name=region)
    prompt = (
        "Explain this experimental historical model output in plain language. "
        "Only describe the provided values. Do not make a recommendation or infer future certainty. "
        "State that scores are uncalibrated and the data is historical.\n"
        f"Prediction: {prediction}\nRecent indicators: {indicators}"
    )
    response = client.converse(
        modelId=model_id,
        system=[{"text": "You explain structured market-model outputs cautiously. Never give trading advice."}],
        messages=[{"role": "user", "content": [{"text": prompt}]}],
        inferenceConfig={"maxTokens": 220, "temperature": 0.2},
    )
    return " ".join(part.get("text", "") for part in response["output"]["message"]["content"] if "text" in part).strip()

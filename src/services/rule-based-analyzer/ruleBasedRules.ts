import { ScamType } from "./ruleBasedTypes";

export type RuleBasedRule = {
    id: string;
    label: string;
    scamType: ScamType;
    weight: number;
    patterns: RegExp[];
};

export const RULE_BASED_SCAM_RULES: RuleBasedRule[] = [
    {
        id: "urgency",
        label: "Urgency or time pressure",
        scamType: "social_engineering",
        weight: 15,
        patterns: [
            /\burgent\b/i,
            /\bimmediately\b/i,
            /\bact now\b/i,
            /\blast chance\b/i,
            /\btoday\b/i,
            /\bwithin\s+\d+\s*(hour|hours|hr|hrs|day|days)\b/i,
        ],
    },
    {
        id: "account_threat",
        label: "Account blocking or suspension threat",
        scamType: "phishing",
        weight: 25,
        patterns: [
            /\baccount\b.*\b(blocked|locked|suspended|disabled)\b/i,
            /\bcard\b.*\b(blocked|locked|suspended)\b/i,
            /\bservice\b.*\b(disconnected|terminated|blocked)\b/i,
            /\bavoid\b.*\b(block|blocked|suspension|penalty)\b/i,
        ],
    },
    {
        id: "kyc_banking",
        label: "KYC or banking verification request",
        scamType: "kyc_phishing",
        weight: 25,
        patterns: [
            /\bkyc\b/i,
            /\bverify\b.*\b(bank|account|card|upi|wallet)\b/i,
            /\bupdate\b.*\b(kyc|bank|account|card|upi|wallet)\b/i,
            /\bnet\s*banking\b/i,
            /\bupi\b/i,
        ],
    },
    {
        id: "otp_password",
        label: "OTP, PIN, CVV, or password request",
        scamType: "credential_theft",
        weight: 35,
        patterns: [
            /\botp\b/i,
            /\bpassword\b/i,
            /\bpin\b/i,
            /\bcvv\b/i,
            /\bshare\b.*\b(otp|password|pin|cvv)\b/i,
            /\bsend\b.*\b(otp|password|pin|cvv)\b/i,
        ],
    },
    {
        id: "fake_reward",
        label: "Reward, lottery, cashback, or prize promise",
        scamType: "fake_reward",
        weight: 20,
        patterns: [
            /\bwon\b.*\b(lottery|prize|reward|cashback|cash)\b/i,
            /\bclaim\b.*\b(prize|reward|cashback|cash|bonus|gift)\b/i,
            /\bfree\b.*\b(gift|iphone|voucher|cash|reward)\b/i,
            /\bcongratulations\b/i,
            /₹\s?\d+/i,
            /\brs\.?\s?\d+/i,
        ],
    },
    {
        id: "payment_request",
        label: "Payment, transfer, or processing fee request",
        scamType: "advance_fee_fraud",
        weight: 25,
        patterns: [
            /\bpay\b.*\b(fee|charge|processing|verification|registration)\b/i,
            /\bprocessing fee\b/i,
            /\bregistration fee\b/i,
            /\btransfer\b.*\b(money|amount|funds)\b/i,
        ],
    },
    {
        id: "suspicious_link",
        label: "Suspicious link or click request",
        scamType: "phishing",
        weight: 30,
        patterns: [
            /https?:\/\/[^\s]+/i,
            /\bclick here\b/i,
            /\bbit\.ly\b/i,
            /\btinyurl\.com\b/i,
            /\bshorturl\b/i,
            /\brebrand\.ly\b/i,
        ],
    },
    {
        id: "authority_impersonation",
        label: "Authority or trusted brand impersonation",
        scamType: "impersonation",
        weight: 20,
        patterns: [
            /\brbi\b/i,
            /\bincome tax\b/i,
            /\bbank\b/i,
            /\bpolice\b/i,
            /\bgovernment\b/i,
            /\bcustoms\b/i,
            /\bcourier\b/i,
            /\belectricity board\b/i,
        ],
    },
    {
        id: "sensitive_info",
        label: "Sensitive personal information request",
        scamType: "identity_theft",
        weight: 30,
        patterns: [
            /\baadhaar\b/i,
            /\bpan\b/i,
            /\bdate of birth\b/i,
            /\bdebit card\b/i,
            /\bcredit card\b/i,
            /\baccount number\b/i,
        ],
    },
];


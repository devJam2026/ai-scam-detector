const examples = [
    {
        label: "Bank KYC Phishing",
        message:
            "Your SBI account will be blocked today. Click here to update your KYC immediately: http://sbi-verify-login.fake"
    },
    {
        label: "Fake Prize Scam",
        message:
            "Congratulations! You won ₹10,00,000. Pay ₹999 processing fee to claim your reward."
    },
    {
        label: "Manager Gift Card Scam",
        message:
            "I am your manager. I am in a meeting. Buy Amazon gift cards immediately and send me the codes."
    },
    {
        label: "Safe Message",
        message: "Hi Avick, are we still meeting at 4 PM today?"
    }
];

type ExampleMessagesProps = {
    onSelect: (message: string) => void;
};

export function ExampleMessages({ onSelect }: ExampleMessagesProps) {
    return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="text-lg font-semibold">Try Example Messages</h2>
            <p className="mt-1 text-sm text-slate-400">
                Use these examples to quickly test the detector.
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {examples.map((example) => (
                    <button
                        key={example.label}
                        onClick={() => onSelect(example.message)}
                        className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-left hover:border-blue-500"
                    >
                        <p className="font-medium">{example.label}</p>
                        <p className="mt-2 line-clamp-2 text-sm text-slate-400">
                            {example.message}
                        </p>
                    </button>
                ))}
            </div>
        </div>
    );
}
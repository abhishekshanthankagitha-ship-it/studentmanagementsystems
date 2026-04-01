import React, { useState } from "react";
import {
  Smartphone, CreditCard, Wallet, Banknote, CheckCircle2, ArrowLeft,
  Building, ChevronRight,
} from "lucide-react";

type PaymentMethod = "upi" | "card" | "netbanking" | "cash";
type PaymentStep = "select" | "details" | "processing" | "success";

interface PaymentGatewayProps {
  amount: number;
  title: string;
  onSuccess: (method: string) => void;
  onBack: () => void;
  isCashAllowed?: boolean;
  cashLabel?: string;
  successMessage?: string;
  cashSuccessMessage?: string;
}

const upiApps = [
  { id: "gpay", name: "Google Pay", color: "bg-blue-500" },
  { id: "phonepe", name: "PhonePe", color: "bg-purple-500" },
  { id: "paytm", name: "Paytm", color: "bg-sky-500" },
  { id: "amazonpay", name: "Amazon Pay", color: "bg-amber-500" },
  { id: "bhim", name: "BHIM UPI", color: "bg-green-600" },
];

const banks = [
  "State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank",
  "Punjab National Bank", "Bank of Baroda", "Kotak Mahindra Bank", "Yes Bank",
];

const PaymentGateway: React.FC<PaymentGatewayProps> = ({
  amount, title, onSuccess, onBack, isCashAllowed = true,
  cashLabel = "Pay at Counter", successMessage = "Payment Successful!",
  cashSuccessMessage = "Order Placed!",
}) => {
  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const [step, setStep] = useState<PaymentStep>("select");
  const [selectedUpiApp, setSelectedUpiApp] = useState("");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [bankUser, setBankUser] = useState("");
  const [bankPass, setBankPass] = useState("");
  const [usedMethod, setUsedMethod] = useState("");

  const formatCard = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const formatExpiry = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 4);
    if (digits.length > 2) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
  };

  const processPayment = (m: string) => {
    setUsedMethod(m);
    setStep("processing");
    setTimeout(() => {
      setStep("success");
      setTimeout(() => onSuccess(m), 2000);
    }, 2000);
  };

  if (step === "success") {
    const isCash = usedMethod === "cash";
    return (
      <div className="text-center py-8 animate-fade-in">
        <CheckCircle2 className="w-20 h-20 text-success mx-auto mb-4" />
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">
          {isCash ? cashSuccessMessage : successMessage}
        </h2>
        {!isCash && <p className="text-muted-foreground">₹{amount} paid via {usedMethod.toUpperCase()}</p>}
        {isCash && <p className="text-muted-foreground">Pay ₹{amount} at the counter</p>}
      </div>
    );
  }

  if (step === "processing") {
    return (
      <div className="text-center py-16 animate-fade-in">
        <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-6" />
        <h3 className="text-lg font-display font-semibold text-foreground">Processing Payment...</h3>
        <p className="text-sm text-muted-foreground mt-2">Please wait, do not close this page</p>
      </div>
    );
  }

  if (step === "details" && method === "upi") {
    return (
      <div className="space-y-4 animate-fade-in">
        <button onClick={() => setStep("select")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h3 className="font-display font-semibold text-foreground">Select UPI App</h3>
        <div className="grid grid-cols-2 gap-3">
          {upiApps.map(app => (
            <button
              key={app.id}
              onClick={() => setSelectedUpiApp(app.id)}
              className={`p-4 rounded-xl border-2 transition-all text-center ${
                selectedUpiApp === app.id ? "border-primary bg-primary/10" : "border-border bg-secondary/30"
              }`}
            >
              <div className={`w-10 h-10 rounded-full ${app.color} mx-auto mb-2 flex items-center justify-center text-white font-bold text-xs`}>
                {app.name[0]}
              </div>
              <div className="text-sm font-medium text-foreground">{app.name}</div>
            </button>
          ))}
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Or enter UPI ID</label>
          <input
            value={upiId}
            onChange={e => setUpiId(e.target.value)}
            placeholder="yourname@upi"
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
          />
        </div>
        <div className="p-4 rounded-xl bg-secondary/20 flex justify-between items-center">
          <span className="text-muted-foreground">Amount</span>
          <span className="text-xl font-display font-bold text-foreground">₹{amount}</span>
        </div>
        <button
          onClick={() => processPayment("upi")}
          disabled={!selectedUpiApp && !upiId}
          className="w-full py-3 rounded-xl gradient-bg text-primary-foreground font-semibold disabled:opacity-50"
        >
          Pay ₹{amount}
        </button>
      </div>
    );
  }

  if (step === "details" && method === "card") {
    return (
      <div className="space-y-4 animate-fade-in">
        <button onClick={() => setStep("select")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h3 className="font-display font-semibold text-foreground">Card Details</h3>
        <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/80 to-accent/80 text-white space-y-6">
          <div className="flex justify-between items-start">
            <CreditCard className="w-8 h-8" />
            <span className="text-xs opacity-70">VISA / MASTERCARD</span>
          </div>
          <div className="text-xl font-mono tracking-[0.2em]">
            {cardNumber || "•••• •••• •••• ••••"}
          </div>
          <div className="flex justify-between text-sm">
            <div>
              <div className="text-[10px] opacity-60">CARD HOLDER</div>
              <div className="font-medium">{cardName || "YOUR NAME"}</div>
            </div>
            <div>
              <div className="text-[10px] opacity-60">EXPIRES</div>
              <div className="font-medium">{cardExpiry || "MM/YY"}</div>
            </div>
          </div>
        </div>
        <input
          value={cardNumber}
          onChange={e => setCardNumber(formatCard(e.target.value))}
          placeholder="Card Number"
          className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-primary font-mono"
        />
        <input
          value={cardName}
          onChange={e => setCardName(e.target.value.toUpperCase())}
          placeholder="Card Holder Name"
          className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            value={cardExpiry}
            onChange={e => setCardExpiry(formatExpiry(e.target.value))}
            placeholder="MM/YY"
            className="px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-primary font-mono"
          />
          <input
            value={cardCvv}
            onChange={e => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
            placeholder="CVV"
            type="password"
            className="px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-primary font-mono"
          />
        </div>
        <button
          onClick={() => processPayment("card")}
          disabled={cardNumber.length < 19 || !cardExpiry || cardCvv.length < 3 || !cardName}
          className="w-full py-3 rounded-xl gradient-bg text-primary-foreground font-semibold disabled:opacity-50"
        >
          Pay ₹{amount}
        </button>
      </div>
    );
  }

  if (step === "details" && method === "netbanking") {
    return (
      <div className="space-y-4 animate-fade-in">
        <button onClick={() => setStep("select")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h3 className="font-display font-semibold text-foreground">Net Banking</h3>
        {!selectedBank ? (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Select your bank</p>
            {banks.map(bank => (
              <button
                key={bank}
                onClick={() => setSelectedBank(bank)}
                className="w-full flex items-center justify-between p-4 rounded-xl border border-border bg-secondary/30 hover:bg-secondary/50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Building className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-medium text-foreground text-sm">{bank}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-secondary/30 flex items-center gap-3">
              <Building className="w-5 h-5 text-primary" />
              <span className="font-medium text-foreground">{selectedBank}</span>
              <button onClick={() => setSelectedBank("")} className="ml-auto text-xs text-primary hover:underline">Change</button>
            </div>
            <div className="p-6 rounded-xl border border-border bg-secondary/20">
              <p className="text-sm text-muted-foreground mb-4">Login to your bank account</p>
              <input
                value={bankUser}
                onChange={e => setBankUser(e.target.value)}
                placeholder="User ID / Customer ID"
                className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-primary mb-3"
              />
              <input
                value={bankPass}
                onChange={e => setBankPass(e.target.value)}
                placeholder="Password"
                type="password"
                className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
              />
            </div>
            <div className="p-4 rounded-xl bg-secondary/20 flex justify-between items-center">
              <span className="text-muted-foreground">Amount</span>
              <span className="text-xl font-display font-bold text-foreground">₹{amount}</span>
            </div>
            <button
              onClick={() => processPayment("netbanking")}
              disabled={!bankUser || !bankPass}
              className="w-full py-3 rounded-xl gradient-bg text-primary-foreground font-semibold disabled:opacity-50"
            >
              Pay ₹{amount}
            </button>
          </div>
        )}
      </div>
    );
  }

  // Select payment method
  return (
    <div className="space-y-4 animate-fade-in">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <h3 className="font-display font-semibold text-foreground text-lg">{title}</h3>
      <p className="text-sm text-muted-foreground">Amount: ₹{amount}</p>
      <div className="space-y-2">
        {[
          { id: "upi" as PaymentMethod, label: "UPI", desc: "Google Pay, PhonePe, Paytm", icon: <Smartphone className="w-5 h-5" /> },
          { id: "card" as PaymentMethod, label: "Credit / Debit Card", desc: "Visa, Mastercard, RuPay", icon: <CreditCard className="w-5 h-5" /> },
          { id: "netbanking" as PaymentMethod, label: "Net Banking", desc: "All major banks supported", icon: <Building className="w-5 h-5" /> },
          ...(isCashAllowed ? [{ id: "cash" as PaymentMethod, label: cashLabel, desc: "No online payment required", icon: <Banknote className="w-5 h-5" /> }] : []),
        ].map(pm => (
          <button
            key={pm.id}
            onClick={() => {
              setMethod(pm.id);
              if (pm.id === "cash") {
                processPayment("cash");
              } else {
                setStep("details");
              }
            }}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
              method === pm.id ? "border-primary bg-primary/10" : "border-border bg-secondary/30 hover:bg-secondary/50"
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">{pm.icon}</div>
            <div className="flex-1">
              <div className="font-medium text-foreground text-sm">{pm.label}</div>
              <div className="text-xs text-muted-foreground">{pm.desc}</div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default PaymentGateway;

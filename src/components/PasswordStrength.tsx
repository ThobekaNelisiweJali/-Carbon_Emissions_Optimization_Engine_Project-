import { useMemo } from "react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface PasswordStrengthProps {
  password: string;
  className?: string;
}

interface StrengthResult {
  score: number;
  feedback: string[];
  color: string;
  label: string;
}

const PasswordStrength = ({ password, className }: PasswordStrengthProps) => {
  const strength = useMemo((): StrengthResult => {
    if (!password) {
      return { score: 0, feedback: [], color: "bg-muted", label: "Enter password" };
    }

    let score = 0;
    const feedback: string[] = [];

    // Length check
    if (password.length >= 8) {
      score += 25;
    } else {
      feedback.push("At least 8 characters");
    }

    // Lowercase check
    if (/[a-z]/.test(password)) {
      score += 15;
    } else {
      feedback.push("Add lowercase letters");
    }

    // Uppercase check
    if (/[A-Z]/.test(password)) {
      score += 15;
    } else {
      feedback.push("Add uppercase letters");
    }

    // Number check
    if (/\d/.test(password)) {
      score += 15;
    } else {
      feedback.push("Add numbers");
    }

    // Special character check
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 15;
    } else {
      feedback.push("Add special characters");
    }

    // Length bonus
    if (password.length >= 12) {
      score += 15;
    } else if (password.length >= 10) {
      score += 10;
    }

    // Determine color and label
    let color = "bg-destructive";
    let label = "Weak";

    if (score >= 80) {
      color = "bg-success";
      label = "Strong";
    } else if (score >= 60) {
      color = "bg-warning";
      label = "Fair";
    } else if (score >= 40) {
      color = "bg-accent";
      label = "Moderate";
    }

    return { score: Math.min(score, 100), feedback, color, label };
  }, [password]);

  if (!password) return null;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Password strength:</span>
        <span className={cn("font-medium", 
          strength.score >= 80 ? "text-success" :
          strength.score >= 60 ? "text-warning" :
          strength.score >= 40 ? "text-accent" : "text-destructive"
        )}>
          {strength.label}
        </span>
      </div>
      <Progress 
        value={strength.score} 
        className="h-2"
      />
      {strength.feedback.length > 0 && (
        <ul className="text-xs text-muted-foreground space-y-1">
          {strength.feedback.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              <span className="w-1 h-1 bg-muted-foreground rounded-full" />
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PasswordStrength;
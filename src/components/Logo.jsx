const Logo = () => (
    <svg viewBox="0 0 200 200" className="h-16 w-16">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#1E3A8A", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#3B82F6", stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      <circle cx="100" cy="100" r="90" fill="url(#grad)" />  {/* Background Gradient */}

      <path d="M70 60 L90 60 L90 80 L110 80 L110 100 L90 100 L90 120 L70 120 Z" 
            fill="white" opacity="0.9"/>
      <path d="M120 70 A25 25 0 1 1 120 120 L135 135 L125 125 A25 25 0 1 0 125 65 Z" 
            fill="white" opacity="0.8"/>
      <circle cx="60" cy="60" r="4" fill="white" opacity="0.6"/>
      <circle cx="140" cy="60" r="4" fill="white" opacity="0.6"/>
      <circle cx="60" cy="140" r="4" fill="white" opacity="0.6"/>
      <circle cx="140" cy="140" r="4" fill="white" opacity="0.6"/>
      <path d="M50 100 Q75 70, 100 100 T150 100" 
            fill="none" stroke="white" strokeWidth="3" opacity="0.4"/>

      {/* Text "Quiz" inside the circle */}
      <text x="100" y="155" fontSize="26" fill="white" fontWeight="bold" textAnchor="middle">
        Quiz
      </text>
    </svg>
);

export default Logo;

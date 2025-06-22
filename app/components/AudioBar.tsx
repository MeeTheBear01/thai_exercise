export default function AudioBars() {
    return (
      <div className="flex items-end w-[40px] h-[32px] gap-[2px] text-current">
        <div className="w-[2px] bg-current rounded animate-[bounceHeight_0.9s_infinite] origin-bottom" style={{ animationDelay: '0s' }} />
        <div className="w-[2px] bg-current rounded animate-[bounceHeight_0.7s_infinite] origin-bottom" style={{ animationDelay: '0.1s' }} />
        <div className="w-[2px] bg-current rounded animate-[bounceHeight_0.6s_infinite] origin-bottom" style={{ animationDelay: '0.2s' }} />
        <div className="w-[2px] bg-current rounded animate-[bounceHeight_0.5s_infinite] origin-bottom" style={{ animationDelay: '0.3s' }} />
        <div className="w-[2px] bg-current rounded animate-[bounceHeight_0.8s_infinite] origin-bottom" style={{ animationDelay: '0.4s' }} />
      </div>
    );
  }
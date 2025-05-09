import './LoadingSpinner.scss';

interface LoadingSpinnerProps {
  loadingText?: string;
  showDots?: boolean;
  showSkeleton?: boolean;
  skeletonCount?: number;
  className?: string;
}

export default function LoadingSpinner({
  loadingText = "Đang tải...",
  showDots = true,
  showSkeleton = true,
  skeletonCount = 3,
  className = ""
}: LoadingSpinnerProps) {
  return (
    <div className={`loading-spinner ${className}`}>
      <div className="spinner-container">
        <div className="spinner">
          <div className="circle-bg"></div>
          <div className="circle-fg"></div>
        </div>

        {loadingText && <div className="loading-text">{loadingText}</div>}

        {showDots && (
          <div className="loading-dots">
            <div className="dot" style={{ animationDelay: '0s' }}></div>
            <div className="dot" style={{ animationDelay: '0.2s' }}></div>
            <div className="dot" style={{ animationDelay: '0.4s' }}></div>
          </div>
        )}

        {showSkeleton && (
          <div className="skeleton-wrapper">
            {Array.from({ length: skeletonCount }).map((_, i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton-img"></div>
                <div className="skeleton-info">
                  <div className="skeleton-title"></div>
                  <div className="skeleton-lines">
                    <div className="skeleton-line"></div>
                    <div className="skeleton-line short"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
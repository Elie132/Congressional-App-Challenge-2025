interface LogoProps {
    className?: string;
    size?: "sm" | "md" | "lg";
}

export function Logo({ className = "", size = "md" }: LogoProps) {
    const sizeClasses = {
        sm: "w-8 h-8",
        md: "w-10 h-10",
        lg: "w-16 h-16"
    };

    return (
        <div className={`${sizeClasses[size]} ${className}`}>
            <img
                src="/assets/logos/shelfshare.png"
                alt="ShelfShare Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                    // Fallback to simple text if image doesn't load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                        parent.innerHTML = `
                            <div class="w-full h-full bg-green-600 rounded-lg flex items-center justify-center">
                                <span class="text-white font-bold ${size === 'lg' ? 'text-2xl' : size === 'md' ? 'text-lg' : 'text-sm'}">S</span>
                            </div>
                        `;
                    }
                }}
            />
        </div>
    );
}

export function LogoWithText({ className = "", size = "md" }: LogoProps) {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <Logo size={size} />
            <div className="flex flex-col">
                <span className="text-2xl font-bold text-green-600">ShelfShare</span>
                <span className="text-xs text-gray-500 -mt-1">Reducing Food Waste</span>
            </div>
        </div>
    );
}
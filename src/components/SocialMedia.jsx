import React from "react";

const SocialMedia = ({
  position = "home", // "home", "footer", "sidebar"
  theme = "dark", // "dark", "light", "transparent"
  size = "medium", // "small", "medium", "large"
  className = "",
  socialLinks = [
    { href: "#", src: "/facebook.png", alt: "Facebook", name: "facebook" },
    { href: "#", src: "/instagram.png", alt: "Instagram", name: "instagram" },
    { href: "#", src: "/whatsapp.png", alt: "WhatsApp", name: "whatsapp" },
    { href: "#", src: "/tik-tok.png", alt: "TikTok", name: "tiktok" },
  ],
}) => {
  // Configuraciones de estilo según el tema
  const themeStyles = {
    dark: {
      container: "bg-black/20 backdrop-blur-md",
      button: "bg-white/30 backdrop-blur-sm hover:bg-red-500",
    },
    light: {
      button: "bg-gray-100 hover:bg-red-500 hover:text-white",
    },
    transparent: {
      container: "bg-transparent",
      button: "bg-white/25 hover:bg-red-500",
    },
  };

  // Configuraciones de tamaño
  const sizeStyles = {
    small: {
      container: "px-3 py-2 gap-2",
      button: "p-1.5",
      icon: "w-4 h-4",
    },
    medium: {
      container: "px-4 py-2 gap-3",
      button: "p-2",
      icon: "w-5 h-5",
    },
    large: {
      container: "px-6 py-3 gap-4",
      button: "p-3",
      icon: "w-6 h-6",
    },
  };

  const currentTheme = themeStyles[theme];
  const currentSize = sizeStyles[size];

  //Renderizado movil
  if (position === "home-mobile") {
    return (
      <div className="w-full flex items-center mt-8">
        <div className="flex gap-4">
          {socialLinks.map(({ href, src, alt, name }) => (
            <a
              key={name}
              href={href}
              className="group"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-full transition duration-300 group-hover:bg-red-500 group-hover:scale-110 transform">
                <img src={src} alt={alt} className="w-5 h-5" />
              </div>
            </a>
          ))}
        </div>
      </div>
    );
  }

  // tablet
  if (position === "home-tablet") {
    return (
      <div className="w-full flex  mt-8  sm:flex md:flex lg:hidden">
        <div className="flex gap-5">
          {socialLinks.map(({ href, src, alt, name }) => (
            <a
              key={name}
              href={href}
              className="group"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="p-3 bg-white/25 backdrop-blur-sm rounded-full transition duration-300 group-hover:bg-red-500 group-hover:scale-110 transform">
                <img src={src} alt={alt} className="w-6 h-6" />
              </div>
            </a>
          ))}
        </div>
      </div>
    );
  }

  // desktop
  if (position === "home") {
    return (
      <>
        {/* Desktop y laptop grande (xl) */}
        <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-20 hidden xl:flex flex-col gap-4">
          {socialLinks.map(({ href, src, alt, name }) => (
            <a key={name} href={href} className="group">
              <div
                className={`p-3 ${currentTheme.button} rounded-full transition duration-300 group-hover:scale-110 transform`}
              >
                <img src={src} alt={alt} className="w-6 h-6" />
              </div>
            </a>
          ))}
        </div>
      </>
    );
  }

  // Renderizado para otras posiciones (footer, sidebar, etc.)
  return (
    <div
      className={`flex ${position === "sidebar" ? "flex-col" : "flex-row"} ${
        currentSize.container
      } ${currentTheme.container} rounded-full ${className}`}
    >
      {socialLinks.map(({ href, src, alt, name }) => (
        <a
          key={name}
          href={href}
          className="group"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div
            className={`${currentSize.button} ${currentTheme.button} rounded-full transition-all duration-300 group-hover:scale-110 transform`}
          >
            <img src={src} alt={alt} className={currentSize.icon} />
          </div>
        </a>
      ))}
    </div>
  );
};

export default SocialMedia;

import React from 'react';

export const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

export const WandIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.47 2.118L2.25 12.12a2.25 2.25 0 0 1 2.118-2.47m3.397 4.136-1.096-1.096a2.25 2.25 0 0 1 3.182-3.182l1.096 1.096-3.182 3.182Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25a8.967 8.967 0 0 1 8.967 8.967 8.967 8.967 0 0 1-8.967 8.967A8.967 8.967 0 0 1 3.033 11.217m9.308-3.834a2.25 2.25 0 0 1 3.182 0l1.096 1.096a2.25 2.25 0 0 1 0 3.182l-1.096 1.096a2.25 2.25 0 0 1-3.182 0l-1.096-1.096a2.25 2.25 0 0 1 0-3.182l1.096-1.096Z" />
  </svg>
);

export const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.067-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
  </svg>
);

export const CloseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export const DownloadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);

export const ZoomIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
);

export const ZaloIcon: React.FC<React.SVGProps<SVGSVGElement>> = ({
  className = "",
  ...props
}) => (
  <svg
    viewBox="0 0 64 64"
    className={className}
    role="img"
    aria-label="Zalo"
    {...props}
  >
    <defs>
      <linearGradient id="zaloGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#1E88FE" />
        <stop offset="1" stopColor="#0B63F6" />
      </linearGradient>
    </defs>

    {/* Nền bo góc */}
    <rect x="2" y="2" width="60" height="60" rx="14" fill="url(#zaloGrad)" />

    {/* Chữ Z cách điệu (trắng) */}
    <path d="M18 20h28l-22 24h22v4H16l22-24H18z" fill="#fff" />

    {/* chấm chat nhỏ (trắng) */}
    <circle cx="50" cy="44" r="3.2" fill="#fff" />
  </svg>
);

export const FacebookIcon: React.FC<React.SVGProps<SVGSVGElement>> = ({
  className = "",
  ...props
}) => (
  <svg viewBox="0 0 64 64" className={className} role="img" aria-label="Facebook" {...props}>
    {/* Nền xanh facebook */}
    <rect x="2" y="2" width="60" height="60" rx="14" fill="#1877F2" />
    {/* Chữ f trắng (chuẩn app icon) */}
    <path
      d="M35.2 22h5.1v-6.4h-5.1c-5.4 0-8.9 3.6-8.9 9.1v4.1h-4.7V35h4.7v14.9h7.2V35h5.7l1-6.2h-6.7v-3.4c0-2.2 1.1-3.4 3.7-3.4z"
      fill="#fff"
    />
  </svg>
);

export const YouTubeIcon: React.FC<React.SVGProps<SVGSVGElement>> = ({
  className = "",
  ...props
}) => (
  <svg viewBox="0 0 64 64" className={className} role="img" aria-label="YouTube" {...props}>
    {/* Nền đỏ YouTube */}
    <rect x="2" y="2" width="60" height="60" rx="14" fill="#FF0000" />
    {/* Nút play trắng (tỉ lệ an toàn trong app icon) */}
    <path d="M26 22c-5 0-7 1.9-7 8v4c0 6.1 2 8 7 8h12c5 0 7-1.9 7-8v-4c0-6.1-2-8-7-8H26z" fill="#fff" opacity="0.15"/>
    <path d="M28 22h8c9.5 0 14 2 14 10v0c0 8-4.5 10-14 10h-8c-9.5 0-14-2-14-10v0c0-8 4.5-10 14-10z" fill="none"/>
    <path d="M28 24l16 8-16 8V24z" fill="#fff"/>
  </svg>
);
import type { NextConfig } from "next";

/**
 * Product screenshots live in Supabase Storage, so next/image has to be told
 * that host is allowed. The host is pinned from the project URL rather than
 * opened up to **.supabase.co: a wildcard would let anyone point an image_url
 * at their own Supabase project and run their files through our optimiser.
 */
const supabaseHost = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").hostname;
  } catch {
    return null;
  }
})();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: supabaseHost
      ? [{
          protocol: "https",
          hostname: supabaseHost,
          pathname: "/storage/v1/object/public/**",
          search: "",
        }]
      : [],
  },
};

export default nextConfig;

import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    // Enable standalone output so we can deploy/run with plain Node.js
    output: "standalone",
};

export default nextConfig;

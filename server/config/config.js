const env = process.env.NODE_ENV || "development";
const config = await import(`./env/${env}.js`);
export default config.default;
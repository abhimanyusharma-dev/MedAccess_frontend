import mongoose from 'mongoose';
import { execSync } from 'child_process';
import dns from 'dns';

// Force DNS resolution to prioritize IPv4 (fixes IPv6 DNS resolution issues in node)
dns.setDefaultResultOrder('ipv4first');

/**
 * Resolves SRV records using the OS-level nslookup tool.
 * Bypasses c-ares library limitations on mixed networks.
 */
function resolveSRVWithNslookup(srvHost) {
  try {
    const output = execSync(`nslookup -type=SRV _mongodb._tcp.${srvHost}`, { encoding: 'utf8', timeout: 5000 });
    const hosts = [];
    const regex = /svr hostname\s*=\s*([a-zA-Z0-9.-]+)/g;
    let match;
    while ((match = regex.exec(output)) !== null) {
      hosts.push(match[1]);
    }
    return hosts;
  } catch (e) {
    return [];
  }
}

/**
 * Converts a mongodb+srv:// URI into a standard mongodb:// URI by resolving the SRV records manually.
 */
function convertSrvToStandardUri(srvUri) {
  const match = srvUri.match(/^mongodb\+srv:\/\/([^:]+):([^@]+)@([^/?]+)(.*)$/);
  if (!match) return srvUri;

  const [_, username, password, host, rest] = match;
  
  const shards = resolveSRVWithNslookup(host);
  if (shards.length === 0) {
    throw new Error('No shard hostnames could be resolved via DNS.');
  }

  const shardList = shards.map(h => `${h}:27017`).join(',');
  const queryParams = rest.includes('?') ? rest.substring(rest.indexOf('?')) : '';
  const cleanParams = queryParams.replace('?', '');
  
  const params = new URLSearchParams(cleanParams);
  if (!params.has('ssl')) params.set('ssl', 'true');
  if (!params.has('authSource')) params.set('authSource', 'admin');

  const dbName = rest.split('?')[0].replace('/', '');
  return `mongodb://${username}:${password}@${shardList}/${dbName}?${params.toString()}`;
}

/**
 * Connects to MongoDB Atlas using the URI from environment variables.
 * Exits process on failure.
 */
export const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    console.error('❌ MongoDB Connection Failed: MONGODB_URI environment variable is missing.');
    process.exit(1);
  }

  try {
    // Try standard srv connection first
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    // Fall back to standard connection string if SRV DNS query fails
    if (
      mongoURI.startsWith('mongodb+srv://') && 
      (error.message.includes('querySrv ECONNREFUSED') || error.message.includes('querySrv ENOTFOUND'))
    ) {
      try {
        const standardURI = convertSrvToStandardUri(mongoURI);
        await mongoose.connect(standardURI);
        console.log('✅ MongoDB Connected Successfully');
        return;
      } catch (fallbackError) {
        console.error(`❌ MongoDB Connection Failed: ${fallbackError.message}`);
        process.exit(1);
      }
    }
    console.error(`❌ MongoDB Connection Failed: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;

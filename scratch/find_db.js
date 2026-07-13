const fs = require("fs");
const path = require("path");

const envContent = fs.readFileSync(path.join(process.cwd(), ".env"), "utf8");
const envVars = {};
envContent.split("\n").forEach(line => {
  const parts = line.split("=");
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const value = parts.slice(1).join("=").trim().replace(/^['"]|['"]$/g, '');
    envVars[key] = value;
  }
});

const anonKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function testUrl(url) {
  try {
    console.log(`Testing: ${url}`);
    const res = await fetch(`${url}/rest/v1/submissions?select=id,student_name,nim`, {
      headers: {
        "apikey": anonKey,
        "Authorization": `Bearer ${anonKey}`
      }
    });
    console.log(`Status: ${res.status}`);
    if (res.ok) {
      const data = await res.json();
      console.log(`Data count: ${data.length}`);
      console.log(`Sample data:`, data.slice(0, 2));
    } else {
      const txt = await res.text();
      console.log(`Error body: ${txt}`);
    }
  } catch (err) {
    console.error(`Fetch failed for ${url}:`, err.message);
  }
  console.log("------------------------------------------\n");
}

async function run() {
  await testUrl("https://kumzohtlohxmbkiuends.supabase.co");
  await testUrl("https://reyvanpurnama-smart-assistant-lecturer.supabase.co");
}

run();

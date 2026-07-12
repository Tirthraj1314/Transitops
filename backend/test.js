import dns from "node:dns";

console.log("Starting DNS test...");

dns.resolveSrv(
  "_mongodb._tcp.cluster0.iy2drkj.mongodb.net",
  (err, records) => {
    console.log("Error:", err);
    console.log("Records:", records);
  }
);

setTimeout(() => {
  console.log("Finished.");
}, 5000);
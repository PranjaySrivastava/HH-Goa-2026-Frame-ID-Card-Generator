export const BUILDER_TITLES = [
  "GPU Whisperer",
  "Async Architect",
  "Goa Hustler",
  "Ship-It Shaman",
  "Latency Slayer",
  "Prompt Pirate",
  "Beach Bug Basher",
  "Midnight Merge Master",
  "Chai-Fueled Coder",
  "Sunset Deploy Wizard",
  "Full-Stack Flip-Flopper",
  "Context Window Surfer",
  "Kernel Panic Tamer",
  "Rate Limit Renegade",
  "Vibe Coder-in-Chief",
  "Terminal Tan Line",
  "404 Sunburn Not Found",
  "Git Blame Beach Bum",
  "Token Economy Tycoon",
  "Recursive Relaxer",
  "Cracked & Coastal",
  "Off-Grid On-Call"
];

export function randomBuilderTitle(exclude) {
  const pool = exclude ? BUILDER_TITLES.filter((t) => t !== exclude) : BUILDER_TITLES;
  return pool[Math.floor(Math.random() * pool.length)];
}

export const ROLE_SUGGESTIONS = [
  "Full-Stack",
  "Frontend",
  "Backend",
  "AI / ML Engineer",
  "Design",
  "DevOps",
  "Mobile",
  "Product",
  "Data Science",
  "Web3"
];

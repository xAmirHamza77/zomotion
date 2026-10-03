#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const skillRoot = path.resolve(__dirname, '..');
const templatesDir = path.join(skillRoot, 'templates');

const targetDir = process.argv[2]
  ? path.resolve(process.cwd(), process.argv[2])
  : process.cwd();

console.log(`🎬 Initializing Zomotion Motion Graphics in: ${targetDir}`);

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const libDir = path.join(targetDir, 'src', 'zomotion');
fs.mkdirSync(libDir, { recursive: true });

// Copy all template components to src/zomotion/
const templateFiles = fs.readdirSync(templatesDir);
for (const file of templateFiles) {
  const srcPath = path.join(templatesDir, file);
  const destPath = path.join(libDir, file);
  fs.copyFileSync(srcPath, destPath);
  console.log(`  ✓ Copied component: src/zomotion/${file}`);
}

// Generate demo composition if index.ts or Root.tsx doesn't exist
const demoCompPath = path.join(targetDir, 'src', 'ZomotionShowcase.tsx');
const showcaseCode = `import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { KineticTypography } from './zomotion/KineticTypography';
import { SpotlightHeroCard } from './zomotion/SpotlightHeroCard';
import { DigitRoll } from './zomotion/DigitRoll';
import { FlashCut } from './zomotion/FlashCut';

export const ZomotionShowcase: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#07070a', color: '#ffffff' }}>
      {/* Scene 1: Kinetic Lead-Word Assemble (0 - 90 frames) */}
      <Sequence from={0} durationInFrames={90}>
        <KineticTypography
          leadWord="ELEVATE"
          followingWords={['YOUR', 'PRODUCT', 'VISION']}
          subtitle="Programmatic React Video with Zomotion Dynamics"
          leadHighlightColor="#6366f1"
        />
      </Sequence>

      {/* Transition: Flash Cut at frame 90 */}
      <Sequence from={90} durationInFrames={8}>
        <FlashCut flashColor="#6366f1" peakOpacity={0.85} />
      </Sequence>

      {/* Scene 2: Spotlight Hero Product Card (90 - 180 frames) */}
      <Sequence from={90} durationInFrames={90}>
        <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <SpotlightHeroCard
            title="Real-Time Engine"
            subtitle="Physics-driven 2.5D camera moves with deterministic frame rendering."
            badge="Zomotion 1.0"
            accentColor="#6366f1"
          >
            <div style={{ marginTop: 24, display: 'flex', gap: 36, alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 13, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  FPS Throughput
                </div>
                <DigitRoll value={120} suffix=" fps" fontSize={48} color="#38bdf8" startFrame={10} />
              </div>
              <div>
                <div style={{ fontSize: 13, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Aesthetic Rating
                </div>
                <DigitRoll value={99.8} decimals={1} suffix="%" fontSize={48} color="#a855f7" startFrame={18} />
              </div>
            </div>
          </SpotlightHeroCard>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
`;

fs.writeFileSync(demoCompPath, showcaseCode, 'utf8');
console.log(`  ✓ Generated showcase composition: src/ZomotionShowcase.tsx`);

console.log(`
🎉 Zomotion setup complete!
To preview live in Zomotion Studio:
  npm run dev
`);
